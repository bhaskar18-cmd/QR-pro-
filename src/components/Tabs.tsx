import React from 'react';
import { motion } from 'motion/react';
import { AppState } from '../types';
import { ContentTab } from './tabs/ContentTab';
import { StyleTab } from './tabs/StyleTab';
import { BrandingTab } from './tabs/BrandingTab';
import { AdvancedTab } from './tabs/AdvancedTab';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, state, setState }) => {
  const tabs = ['Content', 'Style', 'Logo & Image', 'Advanced'];

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
      <div className="flex p-4 gap-2 border-b border-indigo-100/50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              activeTab === tab ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-indigo-100/50 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
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
