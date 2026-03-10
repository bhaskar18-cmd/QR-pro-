import React from 'react';
import { AppState } from '../../types';

interface AdvancedTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ state, setState }) => {
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-700">Resolution</label>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              {advanced.resolution}px
            </span>
          </div>
          <input
            type="range"
            min="128"
            max="1024"
            step="32"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={advanced.resolution}
            onChange={(e) => handleChange('resolution', parseInt(e.target.value))}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
            <span>128px</span>
            <span>1024px</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-slate-700">Quiet Zone / Margin</label>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              {advanced.margin}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={advanced.margin}
            onChange={(e) => handleChange('margin', parseInt(e.target.value))}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
            <span>0px</span>
            <span>50px</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-4">Error Recovery Level</label>
          <div className="grid grid-cols-4 gap-3">
            {['L', 'M', 'Q', 'H'].map((level) => (
              <button
                key={level}
                onClick={() => handleChange('errorCorrectionLevel', level)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  advanced.errorCorrectionLevel === level
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg font-bold mb-1">{level}</span>
                <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">
                  {level === 'L' && '7%'}
                  {level === 'M' && '15%'}
                  {level === 'Q' && '25%'}
                  {level === 'H' && '30%'}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Higher error recovery allows more of the QR code to be damaged or covered by a logo while still remaining scannable.
          </p>
        </div>
      </div>
    </div>
  );
};
