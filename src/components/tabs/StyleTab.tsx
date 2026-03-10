import React, { useState } from 'react';
import { AppState } from '../../types';
import { FuturisticColorPicker } from '../FuturisticColorPicker';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StyleTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const StyleTab: React.FC<StyleTabProps> = ({ state, setState }) => {
  const { style } = state;
  const [activePicker, setActivePicker] = useState<'fg' | 'bg' | 'gStart' | 'gEnd' | null>(null);
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

  const basicPresets = [
    { name: 'Modern', fg: '#000000', bg: '#ffffff', dots: 'rounded', corner: 'extra-rounded', gradient: false },
    { name: 'Cyber', fg: '#00ffcc', bg: '#000000', dots: 'classy', corner: 'dot', gradient: false },
    { name: 'Minimal', fg: '#333333', bg: '#f5f5f5', dots: 'dots', corner: 'dot', gradient: false },
    { name: 'Brand', fg: '#4f46e5', bg: '#ffffff', dots: 'classy-rounded', corner: 'extra-rounded', gradient: false },
    { name: 'Sunset', fg: '#f43f5e', bg: '#ffffff', dots: 'rounded', corner: 'extra-rounded', gradient: true, gStart: '#f43f5e', gEnd: '#f59e0b', gType: 'linear', gRot: 45 },
    { name: 'Ocean', fg: '#0ea5e9', bg: '#ffffff', dots: 'classy', corner: 'extra-rounded', gradient: true, gStart: '#0ea5e9', gEnd: '#10b981', gType: 'linear', gRot: 90 },
  ];

  const applyPreset = (preset: any) => {
    setState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        fgColor: preset.fg,
        bgColor: preset.bg,
        dotsType: preset.dots,
        cornersSquareType: preset.corner,
        cornersDotType: preset.corner === 'extra-rounded' ? 'dot' : preset.corner,
        gradientEnabled: preset.gradient || false,
        gradientStart: preset.gStart || prev.style.gradientStart,
        gradientEnd: preset.gEnd || prev.style.gradientEnd,
        gradientType: preset.gType || prev.style.gradientType,
        gradientRotation: preset.gRot !== undefined ? preset.gRot : prev.style.gradientRotation,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            !style.isAdvanced ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => handleChange('isAdvanced', false)}
        >
          Basic Presets
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            style.isAdvanced ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => handleChange('isAdvanced', true)}
        >
          Advanced Editor
        </button>
      </div>

      {!style.isAdvanced ? (
        <div className="grid grid-cols-2 gap-4">
          {basicPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div
                className="w-16 h-16 rounded-xl mb-3 border border-slate-100 shadow-inner flex items-center justify-center"
                style={{ backgroundColor: preset.bg }}
              >
                <div
                  className="w-8 h-8 rounded-md"
                  style={{ 
                    background: preset.gradient 
                      ? `linear-gradient(${preset.gRot}deg, ${preset.gStart}, ${preset.gEnd})` 
                      : preset.fg 
                  }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">{preset.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Shape Engine</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Dots Pattern</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                  value={style.dotsType}
                  onChange={(e) => handleChange('dotsType', e.target.value)}
                >
                  <option value="square">Square</option>
                  <option value="dots">Dots</option>
                  <option value="rounded">Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Corner Frame</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                    value={style.cornersSquareType}
                    onChange={(e) => handleChange('cornersSquareType', e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Corner Center</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                    value={style.cornersDotType}
                    onChange={(e) => handleChange('cornersDotType', e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100" ref={pickerRef}>
            <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Color Palette</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-bold text-black mb-2">Background</label>
                  <button
                    onClick={() => setActivePicker(activePicker === 'bg' ? null : 'bg')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all"
                    disabled={!!style.bgImage}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-md border border-slate-200" 
                        style={{ backgroundColor: style.bgColor === 'transparent' ? '#ffffff' : style.bgColor }}
                      />
                      <span className="text-xs font-mono uppercase text-black">{style.bgColor}</span>
                    </div>
                    {activePicker === 'bg' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
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

                <div className="relative">
                  <label className="block text-sm font-bold text-black mb-2">Foreground</label>
                  <button
                    onClick={() => setActivePicker(activePicker === 'fg' ? null : 'fg')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all"
                    disabled={style.gradientEnabled}
                  >
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-md border border-slate-200" 
                        style={{ backgroundColor: style.fgColor }}
                      />
                      <span className="text-xs font-mono uppercase text-black">{style.fgColor}</span>
                    </div>
                    {activePicker === 'fg' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activePicker === 'fg' && (
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

              <div>
                <label className="block text-sm font-bold text-black mb-2">Background Image</label>
                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-center hover:bg-slate-100 transition-colors">
                    <span className="text-black font-bold">Upload Image</span>
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
                      className="px-3 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {style.bgImage && (
                  <div className="mt-2 text-xs font-bold text-black">
                    Background color set to transparent for image visibility.
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    checked={style.gradientEnabled}
                    onChange={(e) => handleChange('gradientEnabled', e.target.checked)}
                  />
                  <span className="text-sm font-bold text-black">Enable Gradient Foreground</span>
                </label>

                {style.gradientEnabled && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-xs font-bold text-black mb-1">Start Color</label>
                        <button
                          onClick={() => setActivePicker(activePicker === 'gStart' ? null : 'gStart')}
                          className="w-full flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: style.gradientStart }} />
                            <span className="text-[10px] font-mono uppercase text-black">{style.gradientStart}</span>
                          </div>
                          {activePicker === 'gStart' ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </button>
                        {activePicker === 'gStart' && (
                          <div className="absolute z-50 mt-2 left-0 right-[-100%]">
                            <FuturisticColorPicker 
                              color={style.gradientStart} 
                              onChange={(c) => handleChange('gradientStart', c)} 
                              onClose={() => setActivePicker(null)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-bold text-black mb-1">End Color</label>
                        <button
                          onClick={() => setActivePicker(activePicker === 'gEnd' ? null : 'gEnd')}
                          className="w-full flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: style.gradientEnd }} />
                            <span className="text-[10px] font-mono uppercase text-black">{style.gradientEnd}</span>
                          </div>
                          {activePicker === 'gEnd' ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </button>
                        {activePicker === 'gEnd' && (
                          <div className="absolute z-50 mt-2 left-[-100%] right-0">
                            <FuturisticColorPicker 
                              color={style.gradientEnd} 
                              onChange={(c) => handleChange('gradientEnd', c)} 
                              onClose={() => setActivePicker(null)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">Type</label>
                        <select
                          className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-black"
                          value={style.gradientType}
                          onChange={(e) => handleChange('gradientType', e.target.value)}
                        >
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      {style.gradientType === 'linear' && (
                        <div>
                          <label className="block text-xs font-bold text-black mb-1">
                            Rotation ({style.gradientRotation}°)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            className="w-full h-2 mt-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            value={style.gradientRotation}
                            onChange={(e) => handleChange('gradientRotation', parseInt(e.target.value))}
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
