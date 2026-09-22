import React, { useState } from 'react';
import { AppState, QRFrameStyle } from '../../types';
import { FuturisticColorPicker } from '../FuturisticColorPicker';
import { QR_STYLE_PRESETS, QRPreset } from '../../data/stylePresets';
import { POPULAR_GRADIENTS } from '../../data/gradientPresets';
import { useTheme } from '../../ThemeContext';
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  LayoutGrid,
  Check,
  Sparkles,
  Frame,
  Palette,
  Eye,
  Type,
} from 'lucide-react';

interface StyleTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const StyleTab: React.FC<StyleTabProps> = ({ state, setState }) => {
  const { isClean } = useTheme();
  const { style } = state;
  const [subTab, setSubTab] = useState<'presets' | 'frames' | 'advanced'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePicker, setActivePicker] = useState<
    'fg' | 'bg' | 'gStart' | 'gEnd' | 'cornerSquare' | 'cornerDot' | 'frameColor' | null
  >(null);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [field]: value,
      },
    }));
  };

  const applyPreset = (preset: QRPreset) => {
    setState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        fgColor: preset.fg,
        bgColor: preset.bg,
        dotsType: preset.dots,
        cornersSquareType: preset.corner,
        cornersDotType: preset.cornerDot,
        gradientEnabled: preset.gradient,
        gradientStart: preset.gStart || prev.style.gradientStart,
        gradientEnd: preset.gEnd || prev.style.gradientEnd,
        gradientType: preset.gType || prev.style.gradientType,
        gradientRotation: preset.gRot !== undefined ? preset.gRot : prev.style.gradientRotation,
        customCorners: preset.customCorners || false,
        cornersSquareColor: preset.cornersSquareColor || preset.fg,
        cornersDotColor: preset.cornersDotColor || preset.fg,
      },
    }));
  };

  const allCategories = [
    { id: 'all', label: isClean ? 'All Clean' : 'All Styles' },
    { id: 'minimal', label: 'Minimal & Clean' },
    { id: 'vibrant', label: 'Vibrant Gradients' },
    { id: 'luxury', label: 'Luxury & Gold' },
    { id: 'cyberpunk', label: 'Cyber & Sci-Fi' },
    { id: 'dark', label: 'Neon Dark' },
  ];

  const categories = isClean
    ? allCategories.filter((c) => c.id !== 'cyberpunk' && c.id !== 'dark')
    : allCategories;

  const basePresets = isClean
    ? QR_STYLE_PRESETS.filter((p) => p.category !== 'cyberpunk' && p.category !== 'dark')
    : QR_STYLE_PRESETS;

  const filteredPresets =
    selectedCategory === 'all'
      ? basePresets
      : basePresets.filter((p) => p.category === selectedCategory);

  const frameOptions: { id: QRFrameStyle; label: string; desc: string; preview: string }[] = [
    {
      id: 'none',
      label: 'Pure Matrix',
      desc: 'No outer frame, minimalist raw QR matrix',
      preview: '◻ Clean',
    },
    {
      id: 'scan-me',
      label: 'Scan Me Banner',
      desc: 'Top call-to-action pill banner for high visibility',
      preview: '✦ SCAN ME',
    },
    {
      id: 'luxury-badge',
      label: 'Luxury Bevel Badge',
      desc: 'Refined presentation badge with verify crest',
      preview: '★ VERIFY',
    },
    ...(!isClean
      ? [
          {
            id: 'futuristic-hud' as QRFrameStyle,
            label: 'Cyberpunk HUD',
            desc: 'Optical telemetry corner brackets & matrix scanline',
            preview: '[ TARGET ]',
          },
        ]
      : []),
    {
      id: 'minimal-pill',
      label: 'Floating Pill',
      desc: 'Clean rounded bottom pill badge with scan icon',
      preview: '● SCAN',
    },
  ];

  const frameSuggestions = [
    'SCAN ME',
    'VISIT US',
    'CONNECT WIFI',
    'SAVE CONTACT',
    'FOLLOW ME',
    'PAY SECURELY',
    'VIEW MENU',
    'EXCLUSIVE PASS',
  ];

  const frameColorSwatches = isClean
    ? [
        { name: 'Classic Blue', color: '#2563eb' },
        { name: 'Emerald Forest', color: '#059669' },
        { name: 'Warm Amber', color: '#d97706' },
        { name: 'Pure Indigo', color: '#4f46e5' },
        { name: 'Crimson Red', color: '#dc2626' },
        { name: 'Dark Slate', color: '#1e293b' },
        { name: 'Clean White', color: '#ffffff' },
      ]
    : [
        { name: 'Electric Cyan', color: '#06b6d4' },
        { name: 'Liquid Gold', color: '#f59e0b' },
        { name: 'Cyber Violet', color: '#a855f7' },
        { name: 'Matrix Emerald', color: '#10b981' },
        { name: 'Solar Crimson', color: '#ef4444' },
        { name: 'Pure White', color: '#ffffff' },
        { name: 'Titanium Slate', color: '#64748b' },
      ];

  return (
    <div className="space-y-6">
      {/* 3-Way Mode Switcher Toggle */}
      <div
        className={`flex p-1.5 rounded-2xl border transition-colors gap-1 ${
          isClean
            ? 'bg-slate-100 border-slate-200 shadow-xs'
            : 'bg-slate-950/70 border-white/10 shadow-inner'
        }`}
      >
        <button
          className={`flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 px-2 text-[11px] sm:text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            subTab === 'presets'
              ? isClean
                ? 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                : 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-white border border-cyan-400/40 shadow-sm'
              : isClean
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setSubTab('presets')}
        >
          <LayoutGrid className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
          <span className="truncate">Curated Styles <span className="hidden sm:inline">({basePresets.length})</span></span>
        </button>

        <button
          className={`flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 px-2 text-[11px] sm:text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            subTab === 'frames'
              ? isClean
                ? 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                : 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-white border border-cyan-400/40 shadow-sm'
              : isClean
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setSubTab('frames')}
        >
          <Frame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
          <span className="truncate">Frames</span>
        </button>

        <button
          className={`flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-1.5 py-2 px-2 text-[11px] sm:text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            subTab === 'advanced'
              ? isClean
                ? 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                : 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-white border border-cyan-400/40 shadow-sm'
              : isClean
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setSubTab('advanced')}
        >
          <SlidersHorizontal className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
          <span className="truncate">Matrix Shape</span>
        </button>
      </div>

      {/* MODE 1: CURATED STYLES */}
      {subTab === 'presets' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? isClean
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : isClean
                      ? 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                      : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredPresets.map((preset) => {
              const isCurrent =
                style.fgColor.toLowerCase() === preset.fg.toLowerCase() &&
                style.bgColor.toLowerCase() === preset.bg.toLowerCase() &&
                style.dotsType === preset.dots &&
                style.cornersSquareType === preset.corner;

              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`group relative flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                    isCurrent
                      ? isClean
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                        : 'bg-gradient-to-b from-cyan-950/70 to-slate-900/90 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40'
                      : isClean
                        ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                        : 'bg-slate-950/40 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Visual Swatch */}
                  <div
                    className="w-full h-16 rounded-xl mb-3 border border-slate-200/50 shadow-sm flex items-center justify-center relative overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]"
                    style={{ backgroundColor: preset.bg }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg shadow-xs flex items-center justify-center"
                      style={{
                        background: preset.gradient
                          ? `linear-gradient(${preset.gRot || 45}deg, ${preset.gStart}, ${preset.gEnd})`
                          : preset.fg,
                      }}
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shadow-xs ${
                            isClean ? 'bg-blue-600 text-white' : 'bg-cyan-400 text-slate-950'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-xs font-bold mb-0.5 truncate block w-full ${
                      isClean ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {preset.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono mb-1.5 truncate block w-full ${
                      isClean ? 'text-blue-700 font-semibold' : 'text-cyan-300/80'
                    }`}
                  >
                    {preset.tag}
                  </span>
                  <p
                    className={`text-[10.5px] line-clamp-2 leading-relaxed w-full ${
                      isClean ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: DESIGNER FRAMES & BADGES */}
      {subTab === 'frames' && (
        <div
          className={`space-y-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isClean
              ? 'bg-white border-slate-200/90 shadow-xs'
              : 'bg-slate-950/50 border-white/10 shadow-xl backdrop-blur-md'
          }`}
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Frame className={`w-4 h-4 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
              <h3
                className={`text-xs font-mono uppercase tracking-widest font-bold ${
                  isClean ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Presentation Frame Shell
              </h3>
            </div>
            <p className={`text-xs mb-4 ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
              Wrap your QR code inside an eye-catching call-to-action banner or luxury badge frame.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {frameOptions.map((opt) => {
                const isSelected = (style.frameStyle || 'none') === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleChange('frameStyle', opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? isClean
                          ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500/20'
                          : 'bg-cyan-950/50 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40'
                        : isClean
                          ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-100/50'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isClean ? 'text-slate-900' : 'text-white'}`}>
                        {opt.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isClean ? 'bg-slate-200/80 text-slate-700 font-semibold' : 'bg-white/10 text-cyan-300'
                        }`}
                      >
                        {opt.preview}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-normal ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {(style.frameStyle && style.frameStyle !== 'none') && (
            <div className={`space-y-5 pt-4 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
              {/* Frame CTA Text */}
              <div>
                <label
                  className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider flex items-center space-x-2 ${
                    isClean ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <Type className={`w-3.5 h-3.5 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span>Call-to-Action Text</span>
                </label>
                <input
                  type="text"
                  maxLength={28}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isClean
                      ? 'bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs'
                      : 'bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                  }`}
                  placeholder="e.g. SCAN ME"
                  value={style.frameText || 'SCAN ME'}
                  onChange={(e) => handleChange('frameText', e.target.value.toUpperCase())}
                />

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {frameSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleChange('frameText', sug)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer border ${
                        isClean
                          ? 'bg-slate-100 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                          : 'bg-slate-900 border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-white'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Accent Color */}
              <div ref={pickerRef}>
                <label
                  className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider flex items-center space-x-2 ${
                    isClean ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  <Palette className={`w-3.5 h-3.5 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span>Frame Accent Color</span>
                </label>

                {/* Swatches */}
                <div className="flex items-center space-x-2 mb-3">
                  {frameColorSwatches.map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => handleChange('frameColor', swatch.color)}
                      title={swatch.name}
                      className={`w-7 h-7 rounded-xl border transition-all cursor-pointer ${
                        isClean ? 'border-slate-300/80' : 'border-white/20'
                      } ${
                        (style.frameColor || (isClean ? '#2563eb' : '#06b6d4')).toLowerCase() === swatch.color.toLowerCase()
                          ? 'scale-110 ring-2 ring-blue-500 shadow-md'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.color }}
                    />
                  ))}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setActivePicker(activePicker === 'frameColor' ? null : 'frameColor')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isClean
                        ? 'bg-white border-slate-300 hover:border-blue-400 text-slate-800'
                        : 'bg-slate-900 border-white/15 hover:border-cyan-400/50 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-lg border border-slate-300/60 shadow-inner"
                        style={{ backgroundColor: style.frameColor || (isClean ? '#2563eb' : '#06b6d4') }}
                      />
                      <span
                        className={`text-xs font-mono uppercase font-semibold ${
                          isClean ? 'text-slate-800' : 'text-slate-200'
                        }`}
                      >
                        {style.frameColor || (isClean ? '#2563eb' : '#06b6d4')}
                      </span>
                    </div>
                    {activePicker === 'frameColor' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {activePicker === 'frameColor' && (
                    <div className="absolute z-50 mt-2 left-0 right-0">
                      <FuturisticColorPicker
                        color={style.frameColor || (isClean ? '#2563eb' : '#06b6d4')}
                        onChange={(c) => handleChange('frameColor', c)}
                        onClose={() => setActivePicker(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: ADVANCED SHAPE & ENGINE */}
      {subTab === 'advanced' && (
        <div
          className={`space-y-6 p-5 sm:p-6 rounded-2xl border transition-colors ${
            isClean
              ? 'bg-white border-slate-200/90 shadow-xs'
              : 'bg-slate-950/50 border-white/10 shadow-xl backdrop-blur-md'
          }`}
        >
          {/* Shape Engine */}
          <div>
            <div className={`flex items-center space-x-2 mb-4 pb-2 border-b ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
              <Sparkles className={`w-4 h-4 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
              <h3
                className={`text-xs font-mono uppercase tracking-widest font-bold ${
                  isClean ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Geometric Matrix & Corner Shapes
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                  Dots Matrix Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'square', label: 'Square Matrix', sub: 'Precision Grid' },
                    { id: 'dots', label: 'Round Circles', sub: 'Organic Dots' },
                    { id: 'rounded', label: 'Rounded Cubes', sub: 'Balanced Pill' },
                    { id: 'extra-rounded', label: 'Extra Soft', sub: 'Ultra Smooth Squircles' },
                    { id: 'classy', label: 'Classy Diamond', sub: 'Faceted Diamond Cut' },
                    { id: 'classy-rounded', label: 'Classy Smooth', sub: 'Diamond Curvature' },
                  ].map((pat) => {
                    const isSelected = style.dotsType === pat.id;
                    return (
                      <button
                        key={pat.id}
                        onClick={() => handleChange('dotsType', pat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? isClean
                              ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-1 ring-blue-500/20 shadow-xs'
                              : 'bg-cyan-950/60 border-cyan-400 text-white ring-1 ring-cyan-400/40 shadow-sm'
                            : isClean
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                              : 'bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <span className={`text-xs font-bold block ${isSelected && isClean ? 'text-blue-900' : isClean ? 'text-slate-900' : 'text-white'}`}>
                          {pat.label}
                        </span>
                        <span className={`text-[10px] ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>{pat.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                    Corner Frame (Outer Marker)
                  </label>
                  <select
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isClean
                        ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
                        : 'bg-slate-900 border border-white/15 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400'
                    }`}
                    value={style.cornersSquareType}
                    onChange={(e) => handleChange('cornersSquareType', e.target.value)}
                  >
                    <option value="extra-rounded">Extra Rounded Squircle Frame</option>
                    <option value="dot">Circular Dot Frame</option>
                    <option value="square">Square Precision Frame</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                    Corner Eye (Center Pupil)
                  </label>
                  <select
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isClean
                        ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500'
                        : 'bg-slate-900 border border-white/15 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400'
                    }`}
                    value={style.cornersDotType}
                    onChange={(e) => handleChange('cornersDotType', e.target.value)}
                  >
                    <option value="dot">Round Center Pupil</option>
                    <option value="square">Square Center Pupil</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* TWO-TONE INDEPENDENT CORNER ACCENT EYES */}
          <div className={`pt-4 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
            <label
              className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl border transition-colors mb-3 ${
                isClean
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                checked={style.customCorners || false}
                onChange={(e) => handleChange('customCorners', e.target.checked)}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Eye className={`w-3.5 h-3.5 ${isClean ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span className={`text-xs font-semibold block ${isClean ? 'text-slate-800' : 'text-white'}`}>
                    Independent Accent Corner Eyes
                  </span>
                </div>
                <span className={`text-[11px] font-normal ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  Colorize corner position-detection eyes independently from body matrix
                </span>
              </div>
            </label>

            {style.customCorners && (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border ${
                  isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                }`}
              >
                {/* Corner Frame Color */}
                <div className="relative">
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                    Outer Frame Color
                  </label>
                  <button
                    onClick={() =>
                      setActivePicker(activePicker === 'cornerSquare' ? null : 'cornerSquare')
                    }
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isClean
                        ? 'bg-white border-slate-300 hover:border-blue-400 text-slate-800'
                        : 'bg-slate-950 border-white/15 hover:border-cyan-400/50 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-5 h-5 rounded border border-slate-300/70"
                        style={{ backgroundColor: style.cornersSquareColor || style.fgColor }}
                      />
                      <span className={`text-xs font-mono uppercase ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                        {style.cornersSquareColor || style.fgColor}
                      </span>
                    </div>
                    {activePicker === 'cornerSquare' ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                  {activePicker === 'cornerSquare' && (
                    <div className="absolute z-50 mt-2 left-0 right-0">
                      <FuturisticColorPicker
                        color={style.cornersSquareColor || style.fgColor}
                        onChange={(c) => handleChange('cornersSquareColor', c)}
                        onClose={() => setActivePicker(null)}
                      />
                    </div>
                  )}
                </div>

                {/* Corner Pupil Dot Color */}
                <div className="relative">
                  <label className={`block text-[11px] font-mono uppercase mb-1 ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                    Inner Pupil Color
                  </label>
                  <button
                    onClick={() =>
                      setActivePicker(activePicker === 'cornerDot' ? null : 'cornerDot')
                    }
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isClean
                        ? 'bg-white border-slate-300 hover:border-blue-400 text-slate-800'
                        : 'bg-slate-950 border-white/15 hover:border-cyan-400/50 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-5 h-5 rounded border border-slate-300/70"
                        style={{ backgroundColor: style.cornersDotColor || style.fgColor }}
                      />
                      <span className={`text-xs font-mono uppercase ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                        {style.cornersDotColor || style.fgColor}
                      </span>
                    </div>
                    {activePicker === 'cornerDot' ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                  {activePicker === 'cornerDot' && (
                    <div className="absolute z-50 mt-2 left-0 right-0">
                      <FuturisticColorPicker
                        color={style.cornersDotColor || style.fgColor}
                        onChange={(c) => handleChange('cornersDotColor', c)}
                        onClose={() => setActivePicker(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Color Palette & Contrast */}
          <div className={`pt-4 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`} ref={pickerRef}>
            <div className={`flex items-center space-x-2 mb-4 pb-2 border-b ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`w-2 h-2 rounded-full ${isClean ? 'bg-blue-600' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`} />
              <h3
                className={`text-xs font-mono uppercase tracking-widest font-bold ${
                  isClean ? 'text-slate-800' : 'text-slate-300'
                }`}
              >
                Color Palette & Contrast
              </h3>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Background Color Trigger */}
                <div className="relative">
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                    Background Color
                  </label>
                  <button
                    onClick={() => setActivePicker(activePicker === 'bg' ? null : 'bg')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isClean
                        ? 'bg-white border-slate-300 hover:border-blue-400 hover:bg-slate-50 text-slate-900 shadow-xs'
                        : 'bg-slate-900/80 border-white/15 hover:border-cyan-400/50 hover:bg-slate-900 text-white'
                    }`}
                    disabled={!!style.bgImage}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-300/70 shadow-inner"
                        style={{
                          backgroundColor:
                            style.bgColor === 'transparent' ? '#ffffff' : style.bgColor,
                        }}
                      />
                      <span className={`text-xs font-mono uppercase font-semibold ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                        {style.bgColor}
                      </span>
                    </div>
                    {activePicker === 'bg' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {activePicker === 'bg' && (
                    <div className="absolute z-50 mt-2 left-0 right-0">
                      <FuturisticColorPicker
                        color={style.bgColor === 'transparent' ? '#ffffff' : style.bgColor}
                        onChange={(c) => handleChange('bgColor', c)}
                        onClose={() => setActivePicker(null)}
                      />
                    </div>
                  )}
                </div>

                {/* Foreground Color Trigger */}
                <div className="relative">
                  <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                    Foreground Color
                  </label>
                  <button
                    onClick={() => setActivePicker(activePicker === 'fg' ? null : 'fg')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isClean
                        ? 'bg-white border-slate-300 hover:border-blue-400 hover:bg-slate-50 text-slate-900 shadow-xs'
                        : 'bg-slate-900/80 border-white/15 hover:border-cyan-400/50 hover:bg-slate-900 text-white'
                    } ${
                      style.gradientEnabled ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                    disabled={style.gradientEnabled}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-7 h-7 rounded-lg border border-slate-300/70 shadow-inner"
                        style={{ backgroundColor: style.fgColor }}
                      />
                      <span className={`text-xs font-mono uppercase font-semibold ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                        {style.fgColor}
                      </span>
                    </div>
                    {activePicker === 'fg' ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {activePicker === 'fg' && !style.gradientEnabled && (
                    <div className="absolute z-50 mt-2 left-0 right-0">
                      <FuturisticColorPicker
                        color={style.fgColor}
                        onChange={(c) => handleChange('fgColor', c)}
                        onClose={() => setActivePicker(null)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Canvas Background Image */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                  Custom Canvas Background Texture / Photo
                </label>
                <div className="flex items-center space-x-3">
                  <label
                    className={`flex-1 cursor-pointer rounded-xl p-3 text-xs text-center border transition-all ${
                      isClean
                        ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-blue-400'
                        : 'bg-slate-900/80 border-white/15 hover:bg-slate-800/80 hover:border-cyan-400/50'
                    }`}
                  >
                    <span className={`font-semibold ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>
                      Upload Photo / Texture
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            handleChange('bgImage', reader.result as string);
                            handleChange('bgColor', 'transparent');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {style.bgImage && (
                    <button
                      onClick={() => {
                        handleChange('bgImage', null);
                        handleChange('bgColor', '#ffffff');
                      }}
                      className="px-3.5 py-3 bg-rose-500/20 text-rose-600 border border-rose-500/30 text-xs font-bold rounded-xl hover:bg-rose-500/30 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {style.bgImage && (
                  <div className={`mt-2 text-[11px] font-mono ${isClean ? 'text-blue-600' : 'text-cyan-300'}`}>
                    Background color automatically configured transparent for image transparency.
                  </div>
                )}
              </div>

              {/* Multi-Color Gradient Engine */}
              <div className="pt-2">
                <label
                  className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl border transition-colors mb-4 ${
                    isClean
                      ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    checked={style.gradientEnabled}
                    onChange={(e) => handleChange('gradientEnabled', e.target.checked)}
                  />
                  <div>
                    <span className={`text-xs font-semibold block ${isClean ? 'text-slate-800' : 'text-white'}`}>
                      Enable Multi-Color Gradient Foreground
                    </span>
                    <span className={`text-[11px] font-normal ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                      Blends two harmonious colors across the QR matrix dots
                    </span>
                  </div>
                </label>

                {style.gradientEnabled && (
                  <div
                    className={`space-y-4 p-4 rounded-xl border ${
                      isClean ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/10'
                    }`}
                  >
                    {/* Live Gradient Preview Bar */}
                    <div
                      className="w-full h-3.5 rounded-full border border-slate-300/40 shadow-inner"
                      style={{
                        background: `linear-gradient(${style.gradientRotation}deg, ${style.gradientStart}, ${style.gradientEnd})`,
                      }}
                    />

                    {/* Quick 1-Click Gradient Swatches */}
                    <div>
                      <span className={`text-[11px] font-mono uppercase tracking-wider block mb-2 ${isClean ? 'text-slate-600' : 'text-slate-400'}`}>
                        1-Click Gradient Presets
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {POPULAR_GRADIENTS.map((gp) => (
                          <button
                            key={gp.id}
                            type="button"
                            onClick={() => {
                              handleChange('gradientStart', gp.start);
                              handleChange('gradientEnd', gp.end);
                              handleChange('gradientRotation', gp.rotation);
                            }}
                            className={`p-1.5 rounded-lg border flex items-center space-x-2 transition-all cursor-pointer ${
                              isClean
                                ? 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 shadow-xs'
                                : 'border-white/10 hover:border-cyan-400/50 bg-slate-950 text-slate-300'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{
                                background: `linear-gradient(45deg, ${gp.start}, ${gp.end})`,
                              }}
                            />
                            <span className="text-[10px] font-mono truncate">
                              {gp.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Gradient Start */}
                      <div className="relative">
                        <label className={`block text-[11px] font-mono uppercase mb-1 ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                          Gradient Start
                        </label>
                        <button
                          onClick={() =>
                            setActivePicker(activePicker === 'gStart' ? null : 'gStart')
                          }
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isClean
                              ? 'bg-white border-slate-300 hover:border-blue-400 text-slate-800'
                              : 'bg-slate-950 border-white/15 hover:border-cyan-400/50 text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-5 h-5 rounded border border-slate-300/70"
                              style={{ backgroundColor: style.gradientStart }}
                            />
                            <span className={`text-xs font-mono uppercase ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                              {style.gradientStart}
                            </span>
                          </div>
                          {activePicker === 'gStart' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        {activePicker === 'gStart' && (
                          <div className="absolute z-50 mt-2 left-0 right-0">
                            <FuturisticColorPicker
                              color={style.gradientStart}
                              onChange={(c) => handleChange('gradientStart', c)}
                              onClose={() => setActivePicker(null)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Gradient End */}
                      <div className="relative">
                        <label className={`block text-[11px] font-mono uppercase mb-1 ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                          Gradient End
                        </label>
                        <button
                          onClick={() =>
                            setActivePicker(activePicker === 'gEnd' ? null : 'gEnd')
                          }
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                            isClean
                              ? 'bg-white border-slate-300 hover:border-blue-400 text-slate-800'
                              : 'bg-slate-950 border-white/15 hover:border-cyan-400/50 text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-5 h-5 rounded border border-slate-300/70"
                              style={{ backgroundColor: style.gradientEnd }}
                            />
                            <span className={`text-xs font-mono uppercase ${isClean ? 'text-slate-800' : 'text-slate-200'}`}>
                              {style.gradientEnd}
                            </span>
                          </div>
                          {activePicker === 'gEnd' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        {activePicker === 'gEnd' && (
                          <div className="absolute z-50 mt-2 left-0 right-0">
                            <FuturisticColorPicker
                              color={style.gradientEnd}
                              onChange={(c) => handleChange('gradientEnd', c)}
                              onClose={() => setActivePicker(null)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className={`block text-[11px] font-mono uppercase mb-1 ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                          Gradient Curve
                        </label>
                        <select
                          className={`w-full p-2.5 text-xs rounded-lg border ${
                            isClean
                              ? 'bg-white border-slate-300 text-slate-800 focus:ring-2 focus:ring-blue-500/30'
                              : 'bg-slate-950 border-white/15 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400'
                          }`}
                          value={style.gradientType}
                          onChange={(e) => handleChange('gradientType', e.target.value)}
                        >
                          <option value="linear">Linear Directional</option>
                          <option value="radial">Radial Central Bloom</option>
                        </select>
                      </div>
                      {style.gradientType === 'linear' && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className={`block text-[11px] font-mono uppercase ${isClean ? 'text-slate-600' : 'text-slate-300'}`}>
                              Angle Rotation
                            </label>
                            <span className={`text-[11px] font-mono ${isClean ? 'text-blue-600' : 'text-cyan-400'}`}>
                              {style.gradientRotation}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            className={`w-full h-2 mt-1.5 rounded-lg appearance-none cursor-pointer ${
                              isClean ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-cyan-400'
                            }`}
                            value={style.gradientRotation}
                            onChange={(e) =>
                              handleChange('gradientRotation', parseInt(e.target.value))
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
