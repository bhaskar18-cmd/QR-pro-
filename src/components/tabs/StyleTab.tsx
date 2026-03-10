import React from 'react';
import { AppState } from '../../types';

interface StyleTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const StyleTab: React.FC<StyleTabProps> = ({ state, setState }) => {
  const { style } = state;

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
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Shape Engine</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dots Pattern</label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Corner Frame</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={style.cornersSquareType}
                    onChange={(e) => handleChange('cornersSquareType', e.target.value)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Dot</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Corner Center</label>
                  <select
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
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

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Color Palette</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      value={style.bgColor === 'transparent' ? '#ffffff' : style.bgColor}
                      onChange={(e) => handleChange('bgColor', e.target.value)}
                      disabled={!!style.bgImage}
                    />
                    <input
                      type="text"
                      className="flex-1 p-2 border border-slate-200 rounded-lg text-sm uppercase"
                      value={style.bgColor}
                      onChange={(e) => handleChange('bgColor', e.target.value)}
                      disabled={!!style.bgImage}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Foreground Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      value={style.fgColor}
                      onChange={(e) => handleChange('fgColor', e.target.value)}
                      disabled={style.gradientEnabled}
                    />
                    <input
                      type="text"
                      className="flex-1 p-2 border border-slate-200 rounded-lg text-sm uppercase"
                      value={style.fgColor}
                      onChange={(e) => handleChange('fgColor', e.target.value)}
                      disabled={style.gradientEnabled}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Background Image</label>
                <div className="flex items-center space-x-3">
                  <label className="flex-1 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-center hover:bg-slate-100 transition-colors">
                    <span className="text-slate-600 font-medium">Upload Image</span>
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
                      className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {style.bgImage && (
                  <div className="mt-2 text-xs text-slate-500">
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
                  <span className="text-sm font-medium text-slate-700">Enable Gradient Foreground</span>
                </label>

                {style.gradientEnabled && (
                  <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Start Color</label>
                        <input
                          type="color"
                          className="w-full h-8 rounded cursor-pointer border-0 p-0"
                          value={style.gradientStart}
                          onChange={(e) => handleChange('gradientStart', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">End Color</label>
                        <input
                          type="color"
                          className="w-full h-8 rounded cursor-pointer border-0 p-0"
                          value={style.gradientEnd}
                          onChange={(e) => handleChange('gradientEnd', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                        <select
                          className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                          value={style.gradientType}
                          onChange={(e) => handleChange('gradientType', e.target.value)}
                        >
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>
                      {style.gradientType === 'linear' && (
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">
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
