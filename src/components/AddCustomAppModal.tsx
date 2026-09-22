import React, { useState, useRef } from 'react';
import { X, Upload, Link2, Sparkles, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { CuratedApp } from '../data/curatedApps';
import { useTheme } from '../ThemeContext';

interface AddCustomAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: CuratedApp) => void;
  initialName?: string;
}

export const AddCustomAppModal: React.FC<AddCustomAppModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  initialName = '',
}) => {
  const { isClean } = useTheme();
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<CuratedApp['category']>('productivity');
  const [iconMode, setIconMode] = useState<'upload' | 'url' | 'generate'>('upload');
  
  const [iconUrlInput, setIconUrlInput] = useState('');
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);
  
  // Generator options
  const [monogramColor, setMonogramColor] = useState<'cyan' | 'purple' | 'emerald' | 'rose' | 'amber'>('cyan');
  const [genText, setGenText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const MONOGRAM_COLORS = {
    cyan: { name: 'Cyan', stops: ['#06b6d4', '#0284c7'], dot: 'bg-cyan-400' },
    purple: { name: 'Violet', stops: ['#a855f7', '#6366f1'], dot: 'bg-purple-400' },
    emerald: { name: 'Emerald', stops: ['#10b981', '#059669'], dot: 'bg-emerald-400' },
    rose: { name: 'Crimson', stops: ['#f43f5e', '#ea580c'], dot: 'bg-rose-400' },
    amber: { name: 'Gold', stops: ['#f59e0b', '#ea580c'], dot: 'bg-amber-400' },
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentPreviewIcon = (): string | null => {
    if (iconMode === 'upload') return uploadedDataUrl;
    if (iconMode === 'url') return iconUrlInput.trim() || null;
    if (iconMode === 'generate') {
      const initials = (genText || name || 'AP').trim().substring(0, 2).toUpperCase();
      const currentGrad = MONOGRAM_COLORS[monogramColor] || MONOGRAM_COLORS.cyan;
      // Generate svg data uri
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${currentGrad.stops[0]}" />
            <stop offset="100%" stop-color="${currentGrad.stops[1]}" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" rx="28" fill="url(#grad)" />
        <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${initials}</text>
      </svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }
    return null;
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setErrorMsg('Please enter an app name');
      return;
    }

    const finalIcon = currentPreviewIcon();
    if (!finalIcon) {
      setErrorMsg('Please provide or generate an app icon');
      return;
    }

    const newApp: CuratedApp = {
      id: `custom-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      category,
      iconUrl: finalIcon,
      badge: 'Custom',
    };

    onAdd(newApp);
    onClose();
  };

  const preview = currentPreviewIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-colors ${
          isClean
            ? 'bg-white border border-slate-200 text-slate-900'
            : 'bg-slate-950 border border-amber-500/30 text-white shadow-[0_0_50px_rgba(245,158,11,0.15)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4.5 border-b ${
            isClean ? 'bg-slate-50 border-slate-200' : 'border-white/10 bg-slate-900/60'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isClean
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isClean ? 'text-slate-900' : 'text-white'}`}>
                Add New App
              </h3>
              <p className={`text-xs ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                Add any app icon to your studio collection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isClean ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {errorMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                isClean
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* App Name */}
          <div>
            <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${isClean ? 'text-slate-700' : 'font-mono text-slate-300'}`}>
              App Name *
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors ${
                isClean
                  ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs'
                  : 'bg-slate-900/90 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40'
              }`}
              placeholder="e.g., My Company App, BlueSky, Midjourney..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${isClean ? 'text-slate-700' : 'font-mono text-slate-300'}`}>
              Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { id: 'ai', label: 'AI & Smart' },
                { id: 'social', label: 'Social & Chat' },
                { id: 'entertainment', label: 'Media' },
                { id: 'productivity', label: 'Productivity' },
                { id: 'finance', label: 'Finance' },
                { id: 'developer', label: 'Developer' },
                { id: 'lifestyle', label: 'Lifestyle' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                    category === cat.id
                      ? isClean
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                      : isClean
                        ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Source Mode Switcher */}
          <div>
            <label className={`block text-xs uppercase tracking-wider font-semibold mb-2 ${isClean ? 'text-slate-700' : 'font-mono text-slate-300'}`}>
              App Icon Source *
            </label>
            <div
              className={`grid grid-cols-3 gap-2 p-1 border rounded-xl mb-3 ${
                isClean ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setIconMode('upload')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  iconMode === 'upload'
                    ? isClean
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'bg-amber-500 text-slate-950 shadow-md'
                    : isClean
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setIconMode('url')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  iconMode === 'url'
                    ? isClean
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'bg-amber-500 text-slate-950 shadow-md'
                    : isClean
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Image URL</span>
              </button>
              <button
                type="button"
                onClick={() => setIconMode('generate')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  iconMode === 'generate'
                    ? isClean
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'bg-amber-500 text-slate-950 shadow-md'
                    : isClean
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto Monogram</span>
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {iconMode === 'upload' && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  uploadedDataUrl
                    ? isClean
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-amber-500/60 bg-amber-500/5'
                    : isClean
                      ? 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30'
                      : 'border-white/20 bg-slate-900/40 hover:border-amber-400/40 hover:bg-slate-900/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {uploadedDataUrl ? (
                  <div className="flex items-center space-x-3">
                    <img
                      src={uploadedDataUrl}
                      alt="Uploaded icon"
                      className={`w-12 h-12 rounded-xl object-cover border shadow-sm ${isClean ? 'border-slate-200' : 'border-white/20 shadow-lg'}`}
                    />
                    <div className="text-left">
                      <span className={`text-xs font-semibold block ${isClean ? 'text-slate-900' : 'text-white'}`}>Icon Loaded</span>
                      <span className={`text-[11px] ${isClean ? 'text-blue-600' : 'text-amber-400'}`}>Click or drag another to change</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-8 h-8 mb-2 ${isClean ? 'text-slate-400' : 'text-slate-400'}`} />
                    <p className={`text-xs font-medium ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>
                      Drop an app icon image here or <span className={`underline ${isClean ? 'text-blue-600 font-semibold' : 'text-amber-400'}`}>browse</span>
                    </p>
                    <p className={`text-[11px] mt-1 ${isClean ? 'text-slate-500' : 'text-slate-500'}`}>PNG, JPG, SVG, WebP (Square recommended)</p>
                  </>
                )}
              </div>
            )}

            {/* Mode 2: Image URL */}
            {iconMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    isClean
                      ? 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs'
                      : 'bg-slate-900/90 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40'
                  }`}
                  placeholder="https://example.com/app-icon.png"
                  value={iconUrlInput}
                  onChange={(e) => setIconUrlInput(e.target.value)}
                />
                <p className={`text-[11px] ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>Paste any public direct link to an app icon</p>
              </div>
            )}

            {/* Mode 3: Monogram Generator */}
            {iconMode === 'generate' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className={`block text-[11px] mb-1 ${isClean ? 'text-slate-600' : 'text-slate-400'}`}>Badge Initials (1-2 chars)</label>
                    <input
                      type="text"
                      maxLength={2}
                      className={`w-20 px-3 py-2 rounded-xl text-sm text-center font-bold uppercase transition-colors ${
                        isClean
                          ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 shadow-xs'
                          : 'bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-cyan-400'
                      }`}
                      placeholder="AP"
                      value={genText}
                      onChange={(e) => setGenText(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] mb-1 ${isClean ? 'text-slate-600' : 'text-slate-400'}`}>Badge Colour</label>
                    <div
                      className={`flex items-center space-x-1.5 p-1 rounded-xl border ${
                        isClean ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/80 border-white/10'
                      }`}
                    >
                      {(Object.keys(MONOGRAM_COLORS) as (keyof typeof MONOGRAM_COLORS)[]).map((key) => {
                        const col = MONOGRAM_COLORS[key];
                        const isSelected = monogramColor === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setMonogramColor(key)}
                            title={col.name}
                            className={`w-5 h-5 rounded-lg ${col.dot} transition-all cursor-pointer ${
                              isSelected
                                ? 'scale-110 ring-2 ring-slate-800 shadow-sm'
                                : 'opacity-40 hover:opacity-100 hover:scale-105'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <p className={`text-[11px] ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  Generates an ultra-crisp vector monogram badge for your app
                </p>
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-white/10'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-13 h-13 rounded-2xl flex items-center justify-center overflow-hidden p-1 shadow-xs border ${
                  isClean ? 'bg-white border-slate-200' : 'bg-slate-950 border border-white/15'
                }`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-10 h-10 object-contain rounded-xl" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <span className={`text-xs font-mono uppercase tracking-wider block ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  Studio Preview
                </span>
                <span className={`text-sm font-bold ${isClean ? 'text-slate-900' : 'text-white'}`}>{name.trim() || 'App Name'}</span>
                <span className={`text-[10px] block font-mono capitalize ${isClean ? 'text-blue-600' : 'text-amber-400'}`}>
                  {category} • Ready for QR Center
                </span>
              </div>
            </div>
            {preview && (
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 border ${
                  isClean
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <Check className="w-3 h-3" /> Ready
              </span>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div
          className={`p-4.5 px-6 border-t flex items-center justify-end space-x-3 ${
            isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-white/10'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isClean
                ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center space-x-1.5 cursor-pointer ${
              isClean
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Add App & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
