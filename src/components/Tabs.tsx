import React from 'react';
import { motion } from 'motion/react';
import { AppState } from '../types';
import { ContentTab } from './tabs/ContentTab';
import { StyleTab } from './tabs/StyleTab';
import { BrandingTab } from './tabs/BrandingTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { Link2, Palette, Sparkles, Sliders } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, state, setState }) => {
  const { isClean } = useTheme();
  const tabs = [
    { id: 'Content', label: 'Content', icon: Link2 },
    { id: 'Style', label: 'Style & Colors', icon: Palette },
    { id: 'Logo & Image', label: 'Logo & Image', icon: Sparkles },
    { id: 'Advanced', label: 'Engine & Resolution', icon: Sliders },
  ];

  return (
    <div
      className={`flex flex-col h-full rounded-3xl overflow-hidden transition-colors duration-300 ${
        isClean
          ? 'bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-100'
          : 'bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/5'
      }`}
    >
      {/* Tab Navigation Rail */}
      <div
        className={`flex items-center p-3 gap-1.5 border-b overflow-x-auto custom-scrollbar transition-colors ${
          isClean ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/40 border-white/10'
        }`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center space-x-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? isClean
                    ? 'text-blue-700'
                    : 'text-white'
                  : isClean
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className={`absolute inset-0 rounded-xl transition-all ${
                    isClean
                      ? 'bg-blue-50 border border-blue-200/80 shadow-xs'
                      : 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  }`}
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                />
              )}
              <Icon
                className={`w-4 h-4 relative z-10 transition-colors ${
                  isActive
                    ? isClean
                      ? 'text-blue-600'
                      : 'text-indigo-400'
                    : isClean
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
              />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div
        className={`flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar transition-colors ${
          isClean ? 'text-slate-800' : 'text-slate-100'
        }`}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {activeTab === 'Content' && <ContentTab state={state} setState={setState} />}
          {activeTab === 'Style' && <StyleTab state={state} setState={setState} />}
          {activeTab === 'Logo & Image' && <BrandingTab state={state} setState={setState} />}
          {activeTab === 'Advanced' && <AdvancedTab state={state} setState={setState} />}
        </motion.div>
      </div>
    </div>
  );
};

