import React from 'react';
import { AppState } from '../../types';
import { Sliders, ShieldCheck, Maximize2 } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

interface AdvancedTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ state, setState }) => {
  const { isClean } = useTheme();
  const { advanced } = state;

  const handleChange = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-2xl border transition-colors space-y-7 ${
          isClean
            ? 'bg-white border-slate-200/90 shadow-xs'
            : 'bg-slate-950/50 border-white/10 shadow-xl backdrop-blur-md'
        }`}
      >
        {/* Resolution Control */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Maximize2 className={`w-4 h-4 ${isClean ? 'text-blue-600' : 'text-indigo-400'}`} />
              <label className={`text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                Export Resolution
              </label>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                isClean
                  ? 'bg-slate-100 border-slate-200 text-blue-700'
                  : 'bg-white/5 border-white/10 text-indigo-300'
              }`}
            >
              {advanced.resolution} × {advanced.resolution} px
            </span>
          </div>
          <input
            type="range"
            min="128"
            max="1024"
            step="32"
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              isClean ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-indigo-500'
            }`}
            value={advanced.resolution}
            onChange={(e) => handleChange('resolution', parseInt(e.target.value))}
          />
          <div className={`flex justify-between mt-2 text-[11px] font-mono ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Compact (128px)</span>
            <span>Ultra HD (1024px)</span>
          </div>
        </div>

        {/* Margin / Quiet Zone Control */}
        <div className={`pt-6 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Sliders className={`w-4 h-4 ${isClean ? 'text-blue-600' : 'text-indigo-400'}`} />
              <label className={`text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
                Quiet Zone Margin
              </label>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                isClean
                  ? 'bg-slate-100 border-slate-200 text-blue-700'
                  : 'bg-white/5 border-white/10 text-indigo-300'
              }`}
            >
              {advanced.margin} px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
              isClean ? 'bg-slate-200 accent-blue-600' : 'bg-slate-800 accent-indigo-500'
            }`}
            value={advanced.margin}
            onChange={(e) => handleChange('margin', parseInt(e.target.value))}
          />
          <div className={`flex justify-between mt-2 text-[11px] font-mono ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
            <span>Border Flush (0px)</span>
            <span>Spacious (50px)</span>
          </div>
        </div>

        {/* Error Recovery Level */}
        <div className={`pt-6 border-t ${isClean ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center space-x-2 mb-3">
            <ShieldCheck className={`w-4 h-4 ${isClean ? 'text-emerald-600' : 'text-cyan-400'}`} />
            <label className={`text-xs font-semibold uppercase tracking-wider ${isClean ? 'text-slate-700' : 'text-slate-300'}`}>
              Reed-Solomon Error Correction Level
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['L', 'M', 'Q', 'H'].map((level) => (
              <button
                key={level}
                onClick={() => handleChange('errorCorrectionLevel', level)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                  advanced.errorCorrectionLevel === level
                    ? isClean
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-gradient-to-b from-indigo-950/80 to-slate-900/90 border-indigo-500/70 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] ring-1 ring-indigo-400/40'
                    : isClean
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <span className="text-lg font-bold font-mono mb-1">{level}</span>
                <span className={`text-[10px] uppercase font-mono tracking-wider ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
                  {level === 'L' && '7% Loss'}
                  {level === 'M' && '15% Loss'}
                  {level === 'Q' && '25% Loss'}
                  {level === 'H' && '30% Loss'}
                </span>
              </button>
            ))}
          </div>
          <p className={`text-xs mt-4 leading-relaxed ${isClean ? 'text-slate-500' : 'text-slate-400'}`}>
            High (H - 30%) redundancy is recommended when embedding custom center logos or text to ensure instant scanning across all phone cameras.
          </p>
        </div>
      </div>
    </div>
  );
};

