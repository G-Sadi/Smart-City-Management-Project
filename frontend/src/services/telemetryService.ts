import { CityTelemetrySnapshot, ZoneTelemetry } from '../types';
import { browserEngine } from '../browserEngine';

const ZONE_COORDINATES: Array<{ zone_id: string; name: string; latitude: number; longitude: number }> = [
  { zone_id: 'zn_mirpur', name: 'Mirpur', latitude: 23.8068, longitude: 90.3687 },
  { zone_id: 'zn_uttara', name: 'Uttara', latitude: 23.8759, longitude: 90.3795 },
  { zone_id: 'zn_gulshan', name: 'Gulshan', latitude: 23.7925, longitude: 90.4078 },
  { zone_id: 'zn_motijheel', name: 'Motijheel', latitude: 23.7330, longitude: 90.4172 },
  { zone_id: 'zn_dhanmondi', name: 'Dhanmondi', latitude: 23.7461, longitude: 90.3742 },
  { zone_id: 'zn_mohammadpur', name: 'Mohammadpur', latitude: 23.7658, longitude: 90.3584 },
  { zone_id: 'zn_banani', name: 'Banani', latitude: 23.7937, longitude: 90.4066 },
  { zone_id: 'zn_olddhaka', name: 'Old Dhaka', latitude: 23.7104, longitude: 90.4074 },
];

class TelemetryService {
  private socket: WebSocket | null = null;
  private intervalId: any = null;
  private subscribers: Array<(snap: CityTelemetrySnapshot) => void> = [];
  private currentSnapshot: CityTelemetrySnapshot | null = null;
  private isLiveActive: boolean = true;
  private isUsingWebSocket: boolean = false;

  constructor() {
    this.currentSnapshot = this.generateFallbackSnapshot();
  }

  public subscribe(fn: (snap: CityTelemetrySnapshot) => void): () => void {
    this.subscribers.push(fn);
    if (this.currentSnapshot) {
      fn(this.currentSnapshot);
    }
    if (this.subscribers.length === 1 && this.isLiveActive) {
      this.startStreaming();
    }
    return () => {
      const idx = this.subscribers.indexOf(fn);
      if (idx >= 0) this.subscribers.splice(idx, 1);
      if (this.subscribers.length === 0) {
        this.stopStreaming();
      }
    };
  }

  public toggleLive(active?: boolean): boolean {
    this.isLiveActive = active !== undefined ? active : !this.isLiveActive;
    if (this.isLiveActive && this.subscribers.length > 0) {
      this.startStreaming();
    } else {
      this.stopStreaming();
    }
    return this.isLiveActive;
  }

  public getLiveStatus(): boolean {
    return this.isLiveActive;
  }

  public getSnapshot(): CityTelemetrySnapshot {
    if (!this.currentSnapshot) {
      this.currentSnapshot = this.generateFallbackSnapshot();
    }
    return this.currentSnapshot;
  }

  private startStreaming() {
    if (typeof window === 'undefined') return;

    // Try WebSocket if running with backend
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const isLocalBackend = !window.location.hostname.includes('github.io');

    if (isLocalBackend && !this.socket) {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = apiBase ? new URL(apiBase, window.location.href).host : (window.location.host || 'localhost:8000');
        const wsUrl = `${protocol}//${host}/ws/telemetry`;

        this.socket = new WebSocket(wsUrl);
        this.socket.onopen = () => {
          this.isUsingWebSocket = true;
          this.stopInterval();
        };
        this.socket.onmessage = (event) => {
          try {
            const data: CityTelemetrySnapshot = JSON.parse(event.data);
            this.broadcast(data);
          } catch {
            // ignore parse error
          }
        };
        this.socket.onerror = () => {
          this.cleanupSocket();
          this.startInterval();
        };
        this.socket.onclose = () => {
          this.cleanupSocket();
          this.startInterval();
        };
      } catch {
        this.startInterval();
      }
    } else {
      this.startInterval();
    }
  }

  private stopStreaming() {
    this.cleanupSocket();
    this.stopInterval();
  }

  private cleanupSocket() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        // ignore
      }
      this.socket = null;
      this.isUsingWebSocket = false;
    }
  }

  private startInterval() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      const snap = this.generateFallbackSnapshot();
      this.broadcast(snap);
    }, 3000);
  }

  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private broadcast(snap: CityTelemetrySnapshot) {
    this.currentSnapshot = snap;
    this.subscribers.forEach(fn => fn(snap));
  }

  private generateFallbackSnapshot(): CityTelemetrySnapshot {
    const projects = browserEngine.getProjects();
    const activeProjectsByZone: Record<string, Array<{ project_id: string; name: string }>> = {};

    projects.forEach(p => {
      if (['Running', 'Delayed'].includes(p.status)) {
        ZONE_COORDINATES.forEach(z => {
          if (p.location.toLowerCase().includes(z.name.toLowerCase()) || z.name.toLowerCase().includes(p.location.toLowerCase())) {
            if (!activeProjectsByZone[z.name]) activeProjectsByZone[z.name] = [];
            activeProjectsByZone[z.name].push({ project_id: p.project_id, name: p.name });
          }
        });
      }
    });

    let highestCongestion = 0;
    let hotspotZone = '';
    let hotspotProjId: string | undefined = undefined;
    let hotspotProjName: string = 'Civil Excavation & Utility Works';

    const zones: ZoneTelemetry[] = [];
    for (const z of ZONE_COORDINATES) {
      const activeP = activeProjectsByZone[z.name] || [];
      const baseCong = 48 + Math.min(32, activeP.length * 10);
      const jitter = Math.floor(Math.random() * 21) - 10;
      const traffic = Math.min(98, Math.max(25, baseCong + jitter));

      const noise = Math.min(95, Math.max(50, Math.floor(52 + traffic * 0.35 + (Math.random() * 8 - 4))));
      const aqi = Math.min(275, Math.max(68, Math.floor(95 + traffic * 1.35 + (Math.random() * 16 - 8))));
      const crews = Math.max(3, activeP.length * 5 + Math.floor(Math.random() * 6));

      if (traffic > highestCongestion) {
        highestCongestion = traffic;
        hotspotZone = z.name;
        if (activeP.length > 0) {
          hotspotProjId = activeP[0].project_id;
          hotspotProjName = activeP[0].name;
        }
      }

      zones.push({
        zone_id: z.zone_id,
        name: z.name,
        latitude: z.latitude,
        longitude: z.longitude,
        traffic_index: traffic,
        noise_db: noise,
        aqi: aqi,
        field_crews: crews,
        active_projects: activeP.map(p => p.project_id),
      });
    }

    const avgCong = Number((zones.reduce((acc, z) => acc + z.traffic_index, 0) / zones.length).toFixed(1));
    const peakNoise = Math.max(...zones.map(z => z.noise_db));
    const avgAqi = Number((zones.reduce((acc, z) => acc + z.aqi, 0) / zones.length).toFixed(1));
    const totalCrews = zones.reduce((acc, z) => acc + z.field_crews, 0);

    let hotspot_alert = undefined;
    if (highestCongestion >= 82 && hotspotZone) {
      hotspot_alert = {
        zone: hotspotZone,
        traffic_index: highestCongestion,
        related_project_id: hotspotProjId,
        related_project_name: hotspotProjName,
        message: `Corridor Congestion Alert: ${highestCongestion}% saturation in ${hotspotZone} corridor tied to ${hotspotProjName}.`,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      overall_traffic_congestion: avgCong,
      peak_noise_db: peakNoise,
      avg_aqi: avgAqi,
      active_field_crews: totalCrews,
      zones,
      hotspot_alert,
    };
  }
}

export const telemetryService = new TelemetryService();
