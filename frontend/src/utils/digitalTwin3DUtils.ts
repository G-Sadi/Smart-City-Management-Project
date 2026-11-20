import { Project } from '../types';

export type InfrastructureCategory =
  | 'Healthcare'
  | 'Education'
  | 'Transport'
  | 'Utilities'
  | 'Recreation'
  | 'Civic';

export type PaceStatus = 'Ahead' | 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Not Started';

export type ColorByMode = 'status' | 'agency' | 'progress';

export type PhaseFilter = 'all' | 'not_started' | 'in_progress' | 'delayed' | 'completed';

export interface ProjectPaceInfo {
  pace: PaceStatus;
  expectedProgress: number;
  elapsedPercent: number;
  timeWindowText: string;
  startDateText: string;
  endDateText: string;
  durationYears: number;
}

export interface DeclusteredProjectPosition {
  projectId: string;
  worldX: number;
  worldZ: number;
  anchorX: number;
  anchorZ: number;
  isDeclustered: boolean;
  clusterSize: number;
  category: InfrastructureCategory;
  height: number;
  baseRadius: number;
}

export interface MunicipalZoneData {
  name: string;
  worldX: number;
  worldZ: number;
  radius: number;
  colorHex: number;
  colorStr: string;
  projectCount: number;
  totalBudgetCr: number;
  delayedCount: number;
}

// Category Detection from Project Name & Description
export function classifyInfrastructureCategory(name?: string, goal?: string): InfrastructureCategory {
  const text = `${name || ''} ${goal || ''}`.toLowerCase();
  if (/hospital|clinic|health|medical|doctor|ambulance/i.test(text)) return 'Healthcare';
  if (/school|college|education|madrasa|university|academy/i.test(text)) return 'Education';
  if (/road|bridge|culvert|highway|flyover|transport|corridor|pavement|transit/i.test(text)) return 'Transport';
  if (/water|drainage|sewer|sanitation|pump|pipeline|treatment|electric|power|grid/i.test(text)) return 'Utilities';
  if (/park|recreation|garden|playground|lake|pond|green/i.test(text)) return 'Recreation';
  return 'Civic';
}

export const CATEGORY_META: Record<InfrastructureCategory, { label: string; emoji: string }> = {
  Healthcare: { label: 'Healthcare & Hospital', emoji: '🏥' },
  Education: { label: 'School & Academic Campus', emoji: '🏫' },
  Transport: { label: 'Road, Bridge & Transit', emoji: '🌉' },
  Utilities: { label: 'Water, Drainage & Utilities', emoji: '💧' },
  Recreation: { label: 'Community Park & Eco', emoji: '🌳' },
  Civic: { label: 'Civic & Municipal Complex', emoji: '🏢' },
};

// 5 Main Executing Agencies Colors
export const AGENCY_COLORS: Record<string, { hex: number; str: string }> = {
  MOEDU: { hex: 0x8b5cf6, str: '#8b5cf6' }, // Violet
  LGD: { hex: 0xf59e0b, str: '#f59e0b' },   // Amber
  BBA: { hex: 0x0ea5e9, str: '#0ea5e9' },   // Sky Blue
  LGED: { hex: 0x10b981, str: '#10b981' },  // Emerald
  PWD: { hex: 0xf43f5e, str: '#f43f5e' },   // Rose
};

// Pace & Status Colors
export const PACE_COLORS: Record<PaceStatus, { hex: number; emissive: number; str: string }> = {
  'On Track': { hex: 0x10b981, emissive: 0x059669, str: '#10b981' },
  'Ahead': { hex: 0x06b6d4, emissive: 0x0891b2, str: '#06b6d4' },
  'At Risk': { hex: 0xf59e0b, emissive: 0xb45309, str: '#f59e0b' },
  'Delayed': { hex: 0xef4444, emissive: 0x991b1b, str: '#ef4444' },
  'Completed': { hex: 0x3b82f6, emissive: 0x1d4ed8, str: '#3b82f6' },
  'Not Started': { hex: 0x6366f1, emissive: 0x3730a3, str: '#6366f1' },
};

// Calculate Pace vs Elapsed Working Time
export function calculateProjectPace(p: Project, refDate: Date = new Date('2024-06-01')): ProjectPaceInfo {
  const comp = Number(p.completion) || 0;
  const timespan = Number(p.timespan) || 3;
  const startDateStr = p.start_date || '2023-01-01';
  let sDate = new Date(startDateStr);
  if (isNaN(sDate.getTime())) sDate = new Date('2023-01-01');

  const endDate = new Date(sDate.getTime() + timespan * 365.25 * 86400000);
  const totalDays = Math.max(30, timespan * 365.25);
  const elapsedDays = Math.max(0, (refDate.getTime() - sDate.getTime()) / 86400000);
  const elapsedPercent = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  const expectedProgress = Math.round(elapsedPercent);

  let pace: PaceStatus = 'On Track';
  if (p.status === 'Completed' || comp >= 100) {
    pace = 'Completed';
  } else if (comp === 0) {
    pace = 'Not Started';
  } else if (p.status === 'Delayed' || comp < expectedProgress - 15) {
    pace = 'Delayed';
  } else if (comp < expectedProgress - 5) {
    pace = 'At Risk';
  } else if (comp > expectedProgress + 15) {
    pace = 'Ahead';
  } else {
    pace = 'On Track';
  }

  const sDateText = sDate.toISOString().split('T')[0];
  const eDateText = endDate.toISOString().split('T')[0];
  const timeWindowText = `${sDateText} → ${eDateText} (${timespan} yr${timespan > 1 ? 's' : ''})`;

  return {
    pace,
    expectedProgress,
    elapsedPercent: Math.round(elapsedPercent),
    timeWindowText,
    startDateText: sDateText,
    endDateText: eDateText,
    durationYears: timespan,
  };
}

// Resolve Visual Color by selected mode
export function resolveProjectColor(
  p: Project,
  paceInfo: ProjectPaceInfo,
  mode: ColorByMode
): { hex: number; emissive: number; str: string } {
  if (mode === 'agency') {
    const ag = AGENCY_COLORS[p.exec] || { hex: 0x94a3b8, str: '#94a3b8' };
    return {
      hex: ag.hex,
      emissive: Math.floor(ag.hex * 0.35),
      str: ag.str,
    };
  }
  if (mode === 'progress') {
    const comp = p.completion || 0;
    if (comp >= 75) return { hex: 0x10b981, emissive: 0x047857, str: '#10b981' };
    if (comp >= 50) return { hex: 0x06b6d4, emissive: 0x0891b2, str: '#06b6d4' };
    if (comp >= 25) return { hex: 0xf59e0b, emissive: 0xb45309, str: '#f59e0b' };
    return { hex: 0xef4444, emissive: 0x991b1b, str: '#ef4444' };
  }
  return PACE_COLORS[paceInfo.pace] || PACE_COLORS['On Track'];
}

// Anti-Collision Layout Engine with Golden-Angle Spiral De-Clustering
export function computeDeclusteredPositions(
  projects: Project[],
  worldSpan: number = 82.0
): {
  projectPositions: Map<string, DeclusteredProjectPosition>;
  zones: MunicipalZoneData[];
  geoBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
    centerLat: number;
    centerLng: number;
    scale: number;
  };
} {
  const valid = projects.filter(p => {
    const lat = Number(p.latitude);
    const lng = Number(p.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  });

  if (valid.length === 0) {
    return {
      projectPositions: new Map(),
      zones: [],
      geoBounds: { minLat: 23.6, maxLat: 23.9, minLng: 90.4, maxLng: 90.6, centerLat: 23.75, centerLng: 90.52, scale: 1 },
    };
  }

  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  valid.forEach(p => {
    const lat = Number(p.latitude);
    const lng = Number(p.longitude);
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  const latSpan = Math.max(0.005, maxLat - minLat);
  const lngSpan = Math.max(0.005, maxLng - minLng);
  const latRad = (centerLat * Math.PI) / 180;
  const lngRatio = Math.cos(latRad);
  const adjLngSpan = lngSpan * lngRatio;
  const maxSpan = Math.max(latSpan, adjLngSpan);
  const scale = worldSpan / maxSpan;

  // Group co-located projects sharing the exact same coordinate (e.g. zone centroids)
  const clusterMap = new Map<string, Project[]>();
  valid.forEach(p => {
    const key = `${Number(p.latitude).toFixed(4)},${Number(p.longitude).toFixed(4)}`;
    if (!clusterMap.has(key)) clusterMap.set(key, []);
    clusterMap.get(key)!.push(p);
  });

  const resultMap = new Map<string, DeclusteredProjectPosition>();

  clusterMap.forEach(cluster => {
    const anchorLat = Number(cluster[0].latitude);
    const anchorLng = Number(cluster[0].longitude);
    const anchorX = (anchorLng - centerLng) * lngRatio * scale;
    const anchorZ = -(anchorLat - centerLat) * scale;

    cluster.forEach((p, index) => {
      let worldX = anchorX;
      let worldZ = anchorZ;
      let isDeclustered = false;

      // Deterministic Golden-Angle Spiral Offset
      if (cluster.length > 1 && index > 0) {
        isDeclustered = true;
        const radius = 1.75 * Math.sqrt(index);
        const angle = index * 2.39996; // Golden angle in radians
        worldX += radius * Math.cos(angle);
        worldZ += radius * Math.sin(angle);
      }

      const cost = Math.max(1, Number(p.cost) || 10);
      // Log-scaled height with strong minimum base height (3.4) so 0% progress projects are never flat
      const height = Math.max(3.4, Math.min(18.5, 3.4 + Math.log10(cost) * 4.3));
      const category = classifyInfrastructureCategory(p.name, p.goal);

      resultMap.set(p.project_id, {
        projectId: p.project_id,
        worldX,
        worldZ,
        anchorX,
        anchorZ,
        isDeclustered,
        clusterSize: cluster.length,
        category,
        height,
        baseRadius: 1.1,
      });
    });
  });

  // Calculate 24 Municipal Zones
  const ZONE_PALETTE = [
    { hex: 0x38bdf8, str: '#38bdf8' }, // Sky
    { hex: 0x10b981, str: '#10b981' }, // Emerald
    { hex: 0x818cf8, str: '#818cf8' }, // Indigo
    { hex: 0xf59e0b, str: '#f59e0b' }, // Amber
    { hex: 0x2dd4bf, str: '#2dd4bf' }, // Teal
    { hex: 0xa78bfa, str: '#a78bfa' }, // Purple
    { hex: 0xf43f5e, str: '#f43f5e' }, // Rose
    { hex: 0x06b6d4, str: '#06b6d4' }, // Cyan
    { hex: 0xec4899, str: '#ec4899' }, // Pink
    { hex: 0x14b8a6, str: '#14b8a6' }, // Mint
  ];

  const zoneMap = new Map<string, { lats: number[]; lngs: number[]; count: number; cost: number; delayed: number }>();
  valid.forEach(p => {
    const loc = p.location || 'Municipal Center';
    if (!zoneMap.has(loc)) {
      zoneMap.set(loc, { lats: [], lngs: [], count: 0, cost: 0, delayed: 0 });
    }
    const z = zoneMap.get(loc)!;
    z.lats.push(Number(p.latitude));
    z.lngs.push(Number(p.longitude));
    z.count += 1;
    z.cost += Number(p.cost) || 0;
    if (p.status === 'Delayed') z.delayed += 1;
  });

  const zones: MunicipalZoneData[] = [];
  let cIdx = 0;

  zoneMap.forEach((data, name) => {
    const avgLat = data.lats.reduce((a, b) => a + b, 0) / data.lats.length;
    const avgLng = data.lngs.reduce((a, b) => a + b, 0) / data.lngs.length;
    const zX = (avgLng - centerLng) * lngRatio * scale;
    const zZ = -(avgLat - centerLat) * scale;

    let maxDist = 2.5;
    for (let i = 0; i < data.lats.length; i++) {
      const pX = (data.lngs[i] - centerLng) * lngRatio * scale;
      const pZ = -(data.lats[i] - centerLat) * scale;
      const d = Math.hypot(pX - zX, pZ - zZ);
      if (d > maxDist) maxDist = d;
    }

    const color = ZONE_PALETTE[cIdx % ZONE_PALETTE.length];
    zones.push({
      name,
      worldX: zX,
      worldZ: zZ,
      radius: Math.max(5.0, Math.min(24.0, maxDist + 3.0)),
      colorHex: color.hex,
      colorStr: color.str,
      projectCount: data.count,
      totalBudgetCr: data.cost,
      delayedCount: data.delayed,
    });
    cIdx++;
  });

  return {
    projectPositions: resultMap,
    zones,
    geoBounds: { minLat, maxLat, minLng, maxLng, centerLat, centerLng, scale },
  };
}

// Generate Crisp 2D Canvas Billboard Texture for Municipal Zone Badges
export function createZoneBadgeCanvasTexture(
  zoneName: string,
  count: number,
  totalCostCr: number,
  colorHexStr: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background Glass Pill
  const x = 12;
  const y = 12;
  const w = canvas.width - 24;
  const h = canvas.height - 24;
  const r = 24;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  // Glass Dark Fill
  ctx.fillStyle = 'rgba(8, 14, 28, 0.88)';
  ctx.fill();

  // Accent Border
  ctx.strokeStyle = colorHexStr;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Indicator Dot
  ctx.beginPath();
  ctx.arc(42, 60, 12, 0, Math.PI * 2);
  ctx.fillStyle = colorHexStr;
  ctx.fill();

  // Zone Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(zoneName.toUpperCase(), 66, 72);

  // Subtitle Pill
  ctx.fillStyle = 'rgba(148, 163, 184, 0.95)';
  ctx.font = '600 24px monospace, system-ui';
  ctx.fillText(`${count} Projects • ৳${Math.round(totalCostCr)} Cr`, 42, 118);

  return canvas;
}

// Generate High-Tech Tactical Radar GIS Ground Canvas Texture
export function createTacticalGroundCanvasTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep Midnight Background
  ctx.fillStyle = '#070d1a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Tactical Minor Grid Lines
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let i = 0; i <= 1024; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Major Axis Lines
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 1024; i += step * 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  // Tactical Radar Range Rings (Concentric circles around center)
  const cx = 512, cy = 512;
  const rings = [140, 280, 420];
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
  ctx.lineWidth = 2;
  rings.forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Range Tag
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.font = '14px monospace';
    ctx.fillText(`${(idx + 1) * 5} KM RADAR ZONE`, cx + r - 80, cy - 8);
  });
  ctx.setLineDash([]);

  // Major Waterway Simulation (Shitalakshya River Curve)
  ctx.strokeStyle = 'rgba(3, 105, 161, 0.45)';
  ctx.lineWidth = 28;
  ctx.beginPath();
  ctx.moveTo(220, 0);
  ctx.bezierCurveTo(340, 320, 260, 680, 440, 1024);
  ctx.stroke();

  // River Name
  ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('SHITALAKSHYA RIVER CORRIDOR', 310, 480);

  // Border Coordinates
  ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
  ctx.font = '12px monospace';
  ctx.fillText('N 23° 45\' 00" | E 90° 31\' 12"', 24, 36);
  ctx.fillText('CIVICGRID TACTICAL DIGITAL TWIN • WGS-84 GIS DATUM', 24, 1000);

  return canvas;
}
