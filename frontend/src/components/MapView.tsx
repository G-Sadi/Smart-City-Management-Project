import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Search, Filter, MapPin, Building, Star, Clock, 
  ArrowUpRight, AlertCircle, CheckCircle2, PlayCircle 
} from 'lucide-react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  projects: Project[];
  onSelectProject: (id: string) => void;
  selectedProjectId?: string | null;
}

export const MapView: React.FC<MapViewProps> = ({
  projects,
  onSelectProject,
  selectedProjectId
}) => {
  const { isDark } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedAgency, setSelectedAgency] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [minRating, setMinRating] = useState<number>(0);

  // Extract unique locations and agencies
  const locations = Array.from(new Set(projects.map(p => p.location))).sort();
  const agencies = Array.from(new Set(projects.map(p => p.exec))).sort();

  // Filter projects
  const filteredProjects = projects.filter(p => {
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
      // Center near Dhaka / Narayanganj region
      const map = L.map(mapContainerRef.current, {
        center: [23.75, 90.52],
        zoom: 11,
        zoomControl: true,
      });

      const initialTileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(initialTileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Dynamically update tile layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const newTileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current.setUrl(newTileUrl);
  }, [isDark]);

  // Update Markers when filteredProjects change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    const latLngBounds: L.LatLngExpression[] = [];

    filteredProjects.forEach(proj => {
      if (!proj.latitude || !proj.longitude) return;

      const color = getStatusColor(proj.status);
      const isSelected = proj.project_id === selectedProjectId;

      // Custom SVG div icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: ${color};
            width: ${isSelected ? '28px' : '22px'};
            height: ${isSelected ? '28px' : '22px'};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${proj.completion > 0 ? Math.round(proj.completion) + '%' : '•'}
          </div>
        `,
        iconSize: [isSelected ? 28 : 22, isSelected ? 28 : 22],
        iconAnchor: [isSelected ? 14 : 11, isSelected ? 14 : 11],
      });

      const marker = L.marker([proj.latitude, proj.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; max-width: 240px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="background: ${color}25; color: ${color}; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
              ${proj.status}
            </span>
            <span style="color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 10px;">${proj.project_id}</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: ${isDark ? '#f8fafc' : '#1e293b'};">${proj.name}</h4>
          <p style="margin: 0 0 6px 0; color: ${isDark ? '#94a3b8' : '#64748b'}; font-size: 11px;">📍 ${proj.location} • 🏛️ ${proj.exec}</p>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; color: ${isDark ? '#e2e8f0' : '#334155'};">
            <span><strong>Cost:</strong> ${proj.cost} Cr Tk</span>
            <span><strong>Progress:</strong> ${proj.completion}%</span>
          </div>
          <button id="view-proj-btn-${proj.project_id}" style="
            width: 100%;
            padding: 6px 10px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            Inspect Project Details & Feedbacks
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
      latLngBounds.push([proj.latitude, proj.longitude]);
    });

    if (latLngBounds.length > 0 && !selectedProjectId) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(latLngBounds), {
        padding: [30, 30],
        maxZoom: 13,
      });
    }
  }, [filteredProjects, selectedProjectId, isDark]);

  // Center on selected project if available
  useEffect(() => {
    if (selectedProjectId && mapInstanceRef.current) {
      const proj = projects.find(p => p.project_id === selectedProjectId);
      if (proj && proj.latitude && proj.longitude) {
        mapInstanceRef.current.setView([proj.latitude, proj.longitude], 14, { animate: true });
      }
    }
  }, [selectedProjectId, projects]);

  return (
    <div className="space-y-4">
      {/* Top Filter Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, ID, or goal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Locations ({locations.length})</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Agency Filter */}
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Running">Running 🟢</option>
              <option value="Delayed">Delayed 🟠</option>
              <option value="Completed">Completed 🔵</option>
              <option value="Approved">Approved 🟣</option>
            </select>

            {/* Min Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars ⭐</option>
              <option value="3">3+ Stars ⭐</option>
              <option value="2">2+ Stars ⭐</option>
            </select>
          </div>
        </div>

        {/* Status Indicator Summary */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-100">{filteredProjects.length}</strong> of {projects.length} municipal infrastructure projects
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
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Approved ({filteredProjects.filter(p => p.status === 'Approved').length})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main View Grid: Map on Left (7 cols), Side Project Explorer on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Leaflet GIS Map Container */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-inner" />
        </div>

        {/* Project Cards List */}
        <div className="lg:col-span-4 space-y-2 h-[560px] overflow-y-auto pr-1">
          {filteredProjects.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No projects match the selected filters.</p>
            </div>
          ) : (
            filteredProjects.map(proj => {
              const isSelected = proj.project_id === selectedProjectId;
              return (
                <div
                  key={proj.project_id}
                  onClick={() => onSelectProject(proj.project_id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {proj.project_id}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${getStatusColor(proj.status)}20`,
                        color: getStatusColor(proj.status)
                      }}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
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
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Progress</span>
                      <span><strong>{proj.completion}%</strong> (Cost: {proj.actual_cost} / {proj.cost} Cr)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
