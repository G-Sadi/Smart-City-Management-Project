import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Search, Filter, MapPin, Building, Star, Clock, 
  ArrowUpRight, AlertCircle, CheckCircle2, PlayCircle, 
  Layers, Eye, EyeOff, Compass, Navigation 
} from 'lucide-react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  projects: Project[];
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
  onSelectProject,
  selectedProjectId
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const densityLayerRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<string, { marker: L.Marker; coords: [number, number] }>>(new Map());

  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [showDensityCircles, setShowDensityCircles] = useState(true);

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

  // Initialize Leaflet Map
  useEffect(() => {
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
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Jittered Positions when filteredProjects or theme change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !densityLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    densityLayerRef.current.clearLayers();
    markerMapRef.current.clear();

    const latLngBounds: L.LatLngExpression[] = [];

    // Group projects by coordinate key to calculate smart jitter
    const coordGroups = new Map<string, Project[]>();
    filteredProjects.forEach(p => {
      if (!p.latitude || !p.longitude) return;
      const key = `${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`;
      if (!coordGroups.has(key)) coordGroups.set(key, []);
      coordGroups.get(key)!.push(p);
    });

    // Render Zone Congestion Density Circles if enabled
    if (showDensityCircles) {
      coordGroups.forEach((groupProjects) => {
        const first = groupProjects[0];
        const count = groupProjects.length;
        const delayedCount = groupProjects.filter(p => p.status === 'Delayed').length;
        const isHighCongestion = count >= 6;
        const color = delayedCount > 0 ? '#f59e0b' : isHighCongestion ? '#6366f1' : '#10b981';

        const circle = L.circle([first.latitude, first.longitude], {
          radius: 1000 + count * 90,
          color: color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: isDark ? 0.15 : 0.08,
          dashArray: isHighCongestion ? '4, 4' : undefined,
        });

        circle.bindTooltip(`📍 ${first.location}: ${count} Projects (${delayedCount} Delayed)`, {
          permanent: false,
          direction: 'top',
          className: 'custom-map-tooltip'
        });

        densityLayerRef.current?.addLayer(circle);
      });
    }

    // Render Markers with smart jitter offset
    coordGroups.forEach((groupProjects) => {
      const totalInGroup = groupProjects.length;

      groupProjects.forEach((proj, idx) => {
        const [jitterLat, jitterLng] = getJitteredCoord(proj.latitude, proj.longitude, idx, totalInGroup);
        const color = getStatusColor(proj.status);
        const isSelected = proj.project_id === selectedProjectId;

        // Custom SVG div icon
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              background-color: ${color};
              width: ${isSelected ? '30px' : '22px'};
              height: ${isSelected ? '30px' : '22px'};
              border-radius: 50%;
              border: 2.5px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 10px;
              font-weight: 800;
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
            ">
              ${proj.completion > 0 ? Math.round(proj.completion) + '%' : '•'}
            </div>
          `,
          iconSize: [isSelected ? 30 : 22, isSelected ? 30 : 22],
          iconAnchor: [isSelected ? 15 : 11, isSelected ? 15 : 11],
        });

        const marker = L.marker([jitterLat, jitterLng], { icon: customIcon });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; max-width: 250px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: ${color}25; color: ${color}; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                ${proj.status}
              </span>
              <span style="color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 10px;">${proj.project_id}</span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: ${isDark ? '#f8fafc' : '#1e293b'};">${proj.name}</h4>
            <p style="margin: 0 0 6px 0; color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 11px;">📍 ${proj.location} • 🏛️ ${proj.exec}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; color: ${isDark ? '#e2e8f0' : '#334155'};">
              <span><strong>Cost:</strong> ${proj.cost} Cr Tk</span>
              <span><strong>Progress:</strong> ${proj.completion}%</span>
            </div>
            <button id="view-proj-btn-${proj.project_id}" style="
              width: 100%;
              padding: 6px 10px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              Inspect Project Details & Feedbacks →
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-proj-btn-${proj.project_id}`);
          if (btn) {
            btn.onclick = () => onSelectProject(proj.project_id);
          }
        });

        marker.on('click', () => {
          onSelectProject(proj.project_id);
        });

        markersLayerRef.current?.addLayer(marker);
        markerMapRef.current.set(proj.project_id, { marker, coords: [jitterLat, jitterLng] });
        latLngBounds.push([jitterLat, jitterLng]);
      });
    });

    if (latLngBounds.length > 0 && !selectedProjectId) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(latLngBounds), {
        padding: [40, 40],
        maxZoom: 13,
      });
    }
  }, [filteredProjects, selectedProjectId, isDark, showDensityCircles]);

  // Smoothly FlyTo project on map when selected
  const handleFlyToProject = (id: string) => {
    onSelectProject(id);
    const item = markerMapRef.current.get(id);
    if (item && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(item.coords, 14, { duration: 1.2 });
      setTimeout(() => item.marker.openPopup(), 600);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name, zone, agency or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Quick Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Location Filter */}
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

            {/* Agency Filter */}
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

            {/* Status Filter */}
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

      {/* Main View Grid: Map on Left (8 cols), Side Project Explorer on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet GIS Map Container */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm h-[600px] relative overflow-hidden group">
          <div ref={mapContainerRef} className="w-full h-full rounded-xl shadow-inner" />

          {/* Floating Map Controls Card (Top-Right) */}
          <div className="absolute top-5 right-5 z-20 flex flex-col space-y-2">
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

        {/* Project Cards Explorer List */}
        <div className="lg:col-span-4 space-y-2 h-[600px] overflow-y-auto pr-1">
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

                  {/* Progress bar */}
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
      </div>
    </div>
  );
};
