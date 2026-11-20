import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import L from 'leaflet';
import { 
  Search, Filter, MapPin, Building, Star, Clock, 
  ArrowUpRight, AlertCircle, CheckCircle2, PlayCircle, 
  Layers, Eye, EyeOff, Compass, Navigation, Radio,
  Activity, AlertTriangle, ShieldAlert, ChevronRight, MessageSquare
} from 'lucide-react';
import { Project, ComponentItem, CityTelemetrySnapshot, CivicIssue } from '../types';
import { useTheme } from '../context/ThemeContext';
import { telemetryService } from '../services/telemetryService';
import { api } from '../api';
import CivicIssueModal from './CivicIssueModal';
import CommunityIssueFeed from './CommunityIssueFeed';

// Lazy-load Three.js 3D Digital Twin to preserve bundle leanliness
const DigitalTwin3D = React.lazy(() => import('./DigitalTwin3D'));

interface MapViewProps {
  projects: Project[];
  components?: ComponentItem[];
  onSelectProject: (id: string) => void;
  selectedProjectId?: string | null;
}

// Compute deterministic circular/spiral jitter offset for co-located projects
function getJitteredCoord(lat: number, lng: number, index: number, total: number): [number, number] {
  if (total <= 1 || index === 0) return [lat, lng];
  const radius = 0.0035 * Math.sqrt(index); // ~350m expansion
  const angle = (index * 2.39996) % (2 * Math.PI); // golden angle in radians
  const dLat = radius * Math.cos(angle);
  const dLng = (radius * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
  return [lat + dLat, lng + dLng];
}

export const MapView: React.FC<MapViewProps> = ({
  projects,
  components = [],
  onSelectProject,
  selectedProjectId
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const densityLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, { marker: L.Marker; coords: [number, number] }>>(new Map());

  // View state: '2d' GIS or '3d' Digital Twin
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [sideTab, setSideTab] = useState<'projects' | 'civic_issues'>('projects');

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [showDensityCircles, setShowDensityCircles] = useState(true);

  // Live IoT Telemetry Stream State
  const [isLiveSensorActive, setIsLiveSensorActive] = useState(true);
  const [telemetrySnap, setTelemetrySnap] = useState<CityTelemetrySnapshot | null>(null);

  // Citizen Civic Issue Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [allComponents, setAllComponents] = useState<ComponentItem[]>(components);

  // Load components if not passed as prop
  useEffect(() => {
    if (components.length > 0) {
      setAllComponents(components);
    } else {
      api.getComponents().then(comps => setAllComponents(comps)).catch(() => {});
    }
  }, [components]);

  // Subscribe to live telemetry stream (FastAPI WebSocket + Browser fallback)
  useEffect(() => {
    const unsub = telemetryService.subscribe((snap) => {
      setTelemetrySnap(snap);
    });
    return () => unsub();
  }, []);

  const handleToggleLiveSensor = () => {
    const nextState = telemetryService.toggleLive();
    setIsLiveSensorActive(nextState);
  };

  // Extract unique locations and agencies
  const locations = useMemo(() => Array.from(new Set(projects.map(p => p.location))).sort(), [projects]);
  const agencies = useMemo(() => Array.from(new Set(projects.map(p => p.exec))).sort(), [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedLocation !== 'ALL' && p.location !== selectedLocation) return false;
      if (selectedAgency !== 'ALL' && p.exec !== selectedAgency) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (minRating > 0 && (p.average_rating || 0) < minRating) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.project_id.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.exec.toLowerCase().includes(q) ||
          (p.goal && p.goal.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [projects, selectedLocation, selectedAgency, selectedStatus, minRating, search]);

  // Color mapping helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return '#10b981'; // emerald-500
      case 'Delayed': return '#f59e0b'; // amber-500
      case 'Completed': return '#3b82f6'; // blue-500
      default: return '#8b5cf6'; // purple-500
    }
  };

  // Initialize Leaflet Map (only when viewMode === '2d')
  useEffect(() => {
    if (viewMode !== '2d') return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.75, 90.52],
        zoom: 11,
        zoomControl: true,
      });

      // Free, API-key-free OpenStreetMap raster tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      densityLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [viewMode]);

  // Invalidate map size on window resize or tab switch
  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync Markers and Density Rings
  useEffect(() => {
    if (viewMode !== '2d') return;
    if (!markersLayerRef.current || !densityLayerRef.current || !mapInstanceRef.current) return;

    markersLayerRef.current.clearLayers();
    densityLayerRef.current.clearLayers();
    markerMapRef.current.clear();

    // Group projects by base coordinate
    const locationClusters = new Map<string, Project[]>();
    filteredProjects.forEach(p => {
      const key = `${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`;
      if (!locationClusters.has(key)) {
        locationClusters.set(key, []);
      }
      locationClusters.get(key)!.push(p);
    });

    // 1. Draw Density Heat Circles
    if (showDensityCircles) {
      locationClusters.forEach((cluster) => {
        const first = cluster[0];
        const count = cluster.length;
        const totalBudget = cluster.reduce((sum, item) => sum + item.cost, 0);

        const circleRadius = Math.min(2200, 600 + count * 220);
        const hasDelayed = cluster.some(item => item.status === 'Delayed');

        const circleColor = hasDelayed ? '#f59e0b' : '#059669';

        const circle = L.circle([first.latitude, first.longitude], {
          radius: circleRadius,
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4',
        });

        circle.bindTooltip(
          `<strong>${first.location} Hub</strong><br/>${count} Project${count > 1 ? 's' : ''} • ৳${totalBudget.toFixed(1)} Cr`,
          { sticky: true, className: 'leaflet-custom-tooltip' }
        );

        densityLayerRef.current?.addLayer(circle);
      });
    }

    // 2. Render Markers with Spiral Jitter
    locationClusters.forEach((cluster) => {
      const totalInCluster = cluster.length;

      cluster.forEach((p, idx) => {
        const [jitteredLat, jitteredLng] = getJitteredCoord(p.latitude, p.longitude, idx, totalInCluster);
        const color = getStatusColor(p.status);
        const isSelected = p.project_id === selectedProjectId;

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              width: ${isSelected ? '32px' : '24px'};
              height: ${isSelected ? '32px' : '24px'};
              border-radius: 50%;
              background-color: ${color};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              transition: transform 0.2s ease;
              ${isSelected ? 'transform: scale(1.2); ring: 4px rgba(16, 185, 129, 0.4);' : ''}
            ">
              ${p.completion}%
            </div>
          `,
          iconSize: isSelected ? [32, 32] : [24, 24],
          iconAnchor: isSelected ? [16, 16] : [12, 12],
        });

        const marker = L.marker([jitteredLat, jitteredLng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; min-width: 210px; font-size: 12px; line-height: 1.4;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 10px; padding: 2px 5px; border-radius: 4px; background: #e2e8f0; color: #334155; font-weight: bold;">
                ${p.project_id}
              </span>
              <span style="font-weight: 700; color: ${color}; font-size: 11px;">
                ● ${p.status}
              </span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0 0 4px 0;">${p.name}</h4>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              📍 <strong>${p.location}</strong> &bull; 🏢 ${p.exec}
            </div>
            <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                <span style="color: #64748b;">Budget:</span>
                <strong style="color: #0f172a;">৳${p.cost} Cr</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span style="color: #64748b;">Progress:</span>
                <strong style="color: ${color};">${p.completion}%</strong>
              </div>
            </div>
            <button id="inspect-btn-${p.project_id}" style="
              width: 100%;
              background: #059669;
              color: #ffffff;
              border: none;
              padding: 6px;
              border-radius: 6px;
              font-weight: 600;
              cursor: pointer;
              font-size: 11px;
            ">
              Open Project Details &rarr;
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280 });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`inspect-btn-${p.project_id}`);
          if (btn) {
            btn.onclick = () => onSelectProject(p.project_id);
          }
        });

        marker.on('click', () => {
          onSelectProject(p.project_id);
        });

        markersLayerRef.current?.addLayer(marker);
        markerMapRef.current.set(p.project_id, { marker, coords: [jitteredLat, jitteredLng] });
      });
    });

    // Fit bounds if markers exist
    if (filteredProjects.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(filteredProjects.map(p => [p.latitude, p.longitude]));
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [filteredProjects, selectedProjectId, showDensityCircles, viewMode]);

  const handleFlyToProject = (id: string) => {
    onSelectProject(id);
    const item = markerMapRef.current.get(id);
    if (item && mapInstanceRef.current && viewMode === '2d') {
      mapInstanceRef.current.flyTo(item.coords, 14, { duration: 0.8 });
      item.marker.openPopup();
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Municipal Telemetry Streaming Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs shadow-md">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleToggleLiveSensor}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              isLiveSensorActive
                ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400'
                : 'border-slate-700 bg-slate-800 text-slate-400'
            }`}
            title="Toggle Live IoT Telemetry Simulator"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveSensorActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isLiveSensorActive ? 'Live Sensors ON' : 'Sensors Paused'}</span>
          </button>

          {/* Real-time Ticker Metrics */}
          <div className="hidden sm:flex items-center space-x-4 font-mono text-[11px]">
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="text-slate-400">Traffic Saturation:</span>
              <strong className={telemetrySnap && telemetrySnap.overall_traffic_congestion > 75 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {telemetrySnap?.overall_traffic_congestion || 62}%
              </strong>
            </span>
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="text-slate-400">Peak Noise:</span>
              <strong className="text-amber-400 font-bold">{telemetrySnap?.peak_noise_db || 76} dB</strong>
            </span>
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="text-slate-400">Avg AQI:</span>
              <strong className="text-sky-400 font-bold">{telemetrySnap?.avg_aqi || 148}</strong>
            </span>
            <span className="flex items-center space-x-1 text-slate-300">
              <span className="text-slate-400">Field Crews:</span>
              <strong className="text-cyan-400 font-bold">{telemetrySnap?.active_field_crews || 38}</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Congestion Hotspot Alert */}
        {telemetrySnap?.hotspot_alert && (
          <div
            onClick={() => telemetrySnap.hotspot_alert?.related_project_id && handleFlyToProject(telemetrySnap.hotspot_alert.related_project_id)}
            className="cursor-pointer flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-rose-950/90 border border-rose-800 text-rose-300 text-[11px] font-semibold hover:bg-rose-900 transition-colors animate-pulse"
            title="Click to zoom to bottleneck corridor"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="truncate max-w-[170px] sm:max-w-xs">{telemetrySnap.hotspot_alert.message}</span>
          </div>
        )}

        {/* Action: Report Civic Issue */}
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3 sm:px-3.5 py-1 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Civic Issue</span>
        </button>
      </div>

      {/* Filter and View Mode Switcher Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, zone, agency or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* View Mode Toggle: 2D GIS Map vs 3D Digital Twin */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-500" />
              <span>2D GIS Map</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>3D City Twin</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/80 text-cyan-200 uppercase font-mono">Three.js</span>
            </button>
          </div>

          {/* Quick Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Municipal Zones ({locations.length})</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Agencies ({agencies.length})</option>
              {agencies.map(ag => (
                <option key={ag} value={ag}>{ag}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Running">Running 🟢</option>
              <option value="Delayed">Delayed 🟠</option>
              <option value="Completed">Completed 🔵</option>
              <option value="Approved">Approved 🟣</option>
            </select>
          </div>
        </div>

        {/* Status Indicator Summary */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-100 font-bold">{filteredProjects.length}</strong> of {projects.length} municipal infrastructure projects
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Running ({filteredProjects.filter(p => p.status === 'Running').length})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Delayed ({filteredProjects.filter(p => p.status === 'Delayed').length})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Completed ({filteredProjects.filter(p => p.status === 'Completed').length})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main View Grid: Map/Twin on Left (8 cols), Explorer / Citizen Feed on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map / 3D Twin View Container */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm min-h-[360px] sm:min-h-[480px] lg:min-h-[600px] relative overflow-hidden group">
          {viewMode === '2d' ? (
            <div className="w-full h-[52dvh] min-h-[350px] sm:h-[480px] lg:h-[600px] relative">
              <div ref={mapContainerRef} className="w-full h-full rounded-xl shadow-inner" />

              {/* Floating Map Controls Card (Top-Right) */}
              <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between space-x-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Layer Controls</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">OSM Free</span>
                  </div>

                  <button
                    onClick={() => setShowDensityCircles(!showDensityCircles)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                      showDensityCircles
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span>Zone Density Heat</span>
                    {showDensityCircles ? <Eye className="w-3 h-3 text-emerald-500" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="w-full h-[52dvh] min-h-[350px] sm:h-[480px] lg:h-[600px] flex flex-col items-center justify-center bg-slate-950 text-slate-300 space-y-3 rounded-xl">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono text-cyan-400">Loading 3D Digital Twin Engine (Three.js)...</p>
                </div>
              }
            >
              <DigitalTwin3D
                projects={filteredProjects}
                components={allComponents}
                selectedProjectId={selectedProjectId}
                onSelectProject={onSelectProject}
                isDark={isDark}
              />
            </Suspense>
          )}
        </div>

        {/* Side Panel: Project Cards Explorer OR Citizen Feed */}
        <div className="lg:col-span-4 space-y-3">
          {/* Side Tabs Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setSideTab('projects')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                sideTab === 'projects'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Project Explorer ({filteredProjects.length})
            </button>
            <button
              onClick={() => setSideTab('civic_issues')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center space-x-1 ${
                sideTab === 'civic_issues'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Civic Reports</span>
            </button>
          </div>

          {sideTab === 'projects' ? (
            <div className="space-y-2 h-[550px] overflow-y-auto pr-1">
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto opacity-50 text-slate-400" />
                  <p className="text-xs">No projects match the selected filter criteria.</p>
                </div>
              ) : (
                filteredProjects.map(proj => {
                  const isSelected = proj.project_id === selectedProjectId;
                  return (
                    <div
                      key={proj.project_id}
                      onClick={() => handleFlyToProject(proj.project_id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          {proj.project_id}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${getStatusColor(proj.status)}20`,
                            color: getStatusColor(proj.status)
                          }}
                        >
                          ● {proj.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                        {proj.name}
                      </h4>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{proj.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{proj.exec}</span>
                        </span>
                        {proj.average_rating ? (
                          <span className="flex items-center space-x-0.5 text-amber-500 font-medium">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{proj.average_rating}</span>
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span>Progress</span>
                          <span><strong>{proj.completion}%</strong> (Cost: {proj.actual_cost} / {proj.cost} Cr)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, proj.completion)}%`,
                              backgroundColor: getStatusColor(proj.status)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <CommunityIssueFeed
              projectId={selectedProjectId}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSelectProject={handleFlyToProject}
            />
          )}
        </div>
      </div>

      {/* Citizen Issue Modal */}
      <CivicIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        preselectedProjectId={selectedProjectId}
        onIssueCreated={() => {
          // Re-fetch issues in community feed
        }}
      />
    </div>
  );
};

export default MapView;
