import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppState } from './types';
import { Tabs } from './components/Tabs';
import { PreviewPanel } from './components/PreviewPanel';
import { QrCode } from 'lucide-react';
import { FuturisticBackground } from './components/FuturisticBackground';

const initialState: AppState = {
  content: {
    type: 'text',
    text: '',
    wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
    vcard: { firstName: '', lastName: '', phone: '', email: '', company: '', jobTitle: '', website: '' },
    vevent: { title: '', location: '', startTime: new Date().toISOString().slice(0, 16), endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16) },
  },
  style: {
    isAdvanced: false,
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    fgColor: '#4f46e5',
    bgColor: '#ffffff',
    bgImage: null,
    gradientEnabled: false,
    gradientStart: '#4f46e5',
    gradientEnd: '#ec4899',
    gradientType: 'linear',
    gradientRotation: 0,
  },
  branding: {
    type: 'none',
    logoUrl: null,
    textValue: '',
    iconSlug: 'logos:github-icon',
    logoSize: 0.2,
  },
  advanced: {
    resolution: 512,
    margin: 10,
    errorCorrectionLevel: 'Q',
  },
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [activeTab, setActiveTab] = useState('Content');

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden relative">
      <FuturisticBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform -rotate-6">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">QR Craft</h1>
              <p className="text-sm font-bold text-slate-100">Next-Gen Professional QR Code Generator</p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 xl:col-span-8 h-[calc(100vh-12rem)]"
          >
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              state={state}
              setState={setState}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-5 xl:col-span-4 h-[calc(100vh-12rem)]"
          >
            <PreviewPanel state={state} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
