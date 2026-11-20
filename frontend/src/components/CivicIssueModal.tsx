import React, { useState, useEffect } from 'react';
import { Project, CivicIssue, CivicIssueCategory } from '../types';
import { api } from '../api';
import {
  AlertTriangle, Camera, Upload, X, CheckCircle, MapPin,
  Building, User, Phone, FileText
} from 'lucide-react';

interface CivicIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  preselectedProjectId?: string | null;
  onIssueCreated?: (issue: CivicIssue) => void;
}

const CATEGORIES: Array<{ key: CivicIssueCategory; label: string; iconColor: string }> = [
  { key: 'Traffic Bottleneck', label: 'Traffic Bottleneck / Gridlock', iconColor: 'text-amber-500' },
  { key: 'Road Damage', label: 'Pavement / Road Damage', iconColor: 'text-orange-500' },
  { key: 'Waterlogging', label: 'Severe Waterlogging / Drainage Overflow', iconColor: 'text-blue-500' },
  { key: 'Work Stalled', label: 'Construction Stalled / Abandoned Work', iconColor: 'text-purple-500' },
  { key: 'Safety Hazard', label: 'Uncovered Trench / Severe Safety Hazard', iconColor: 'text-rose-500' },
];

export const CivicIssueModal: React.FC<CivicIssueModalProps> = ({
  isOpen,
  onClose,
  projects,
  preselectedProjectId,
  onIssueCreated,
}) => {
  const [category, setCategory] = useState<CivicIssueCategory>('Traffic Bottleneck');
  const [projectId, setProjectId] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedProjectId) {
      setProjectId(preselectedProjectId);
      const proj = projects.find(p => p.project_id === preselectedProjectId);
      if (proj) setLocationName(proj.location);
    } else if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].project_id);
      setLocationName(projects[0].location);
    }
  }, [preselectedProjectId, projects]);

  const handleProjectChange = (pid: string) => {
    setProjectId(pid);
    const proj = projects.find(p => p.project_id === pid);
    if (proj) setLocationName(proj.location);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress image using canvas to keep payload small (< 150KB)
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          setPhotoDataUrl(compressed);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const proj = projects.find(p => p.project_id === projectId);
      const newIssue = await api.createCivicIssue({
        project_id: projectId,
        project_name: proj?.name || projectId,
        category,
        location_name: locationName || proj?.location || 'Dhaka Metropolitan Area',
        latitude: proj?.latitude || 23.8103,
        longitude: proj?.longitude || 90.4125,
        citizen_name: citizenName.trim() || 'Civic Observer',
        citizen_phone: citizenPhone.trim() || undefined,
        description: description.trim(),
        photo_url: photoDataUrl || undefined,
      });

      setSuccessMessage('Civic issue registered and cryptographically anchored to municipal audit log.');
      if (onIssueCreated) onIssueCreated(newIssue);

      setTimeout(() => {
        setSuccessMessage(null);
        setDescription('');
        setPhotoDataUrl('');
        onClose();
      }, 1400);
    } catch (err) {
      console.error('Failed to submit civic issue:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Report Ground Civic Disruption
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ground telemetry informs dynamic predictive risk & mitigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Report Registered</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    className={`flex items-center space-x-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                      category === c.key
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 font-semibold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Infrastructure Project
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <select
                  value={projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {projects.map(p => (
                    <option key={p.project_id} value={p.project_id}>
                      [{p.project_id}] {p.name} ({p.exec} - {p.location})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Corridor Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Mirpur-10 Circle"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Citizen Name (Optional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Anonymous or Name"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ground Observation & Safety Impact *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current severity, traffic lane blockage, or missing safety signage..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attach Site Photo (Optional)
              </label>
              {photoDataUrl ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                  <img src={photoDataUrl} alt="Issue evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoDataUrl('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Camera className="w-5 h-5 text-slate-400 mb-1" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload photo from camera or gallery
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg shadow-md disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Submit Civic Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CivicIssueModal;
