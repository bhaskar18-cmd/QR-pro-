import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppState } from './types';
import { Tabs } from './components/Tabs';
import { PreviewPanel } from './components/PreviewPanel';
import { QrCode, Sparkles, RotateCcw, ShieldCheck, Briefcase } from 'lucide-react';
import { FuturisticBackground } from './components/FuturisticBackground';
import { CleanProRockets } from './components/CleanProRockets';
import { Footer } from './components/Footer';
import { ThemeProvider, useTheme, UiTheme } from './ThemeContext';

const initialState: AppState = {
  content: {
    type: 'text',
    text: 'https://github.com',
    wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
    vcard: { firstName: '', lastName: '', phone: '', email: '', company: '', jobTitle: '', website: '' },
    vevent: { title: '', location: '', startTime: new Date().toISOString().slice(0, 16), endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16) },
  },
  style: {
    isAdvanced: false,
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    bgImage: null,
    gradientEnabled: false,
    gradientStart: '#06b6d4',
    gradientEnd: '#3b82f6',
    gradientType: 'linear',
    gradientRotation: 45,
    customCorners: false,
    cornersSquareColor: '#06b6d4',
    cornersDotColor: '#3b82f6',
    frameStyle: 'none',
    frameText: 'SCAN ME',
    frameColor: '#06b6d4',
  },
  branding: {
    type: 'none',
    logoUrl: null,
    textValue: '',
    iconSlug: '',
    logoSize: 0.2,
  },
  advanced: {
    resolution: 512,
    margin: 10,
    errorCorrectionLevel: 'Q',
  },
};

export type LogoColorTheme = 'cyan' | 'purple' | 'emerald' | 'rose' | 'amber';

export interface LogoColorConfig {
  id: LogoColorTheme;
  name: string;
  gradientGlow: string;
  boxBorder: string;
  boxShadow: string;
  iconClass: string;
  iconHoverClass: string;
  trademarkColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  pulseDot: string;
  paletteDot: string;
}

export const LOGO_COLOR_THEMES: Record<LogoColorTheme, LogoColorConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Electric Cyan',
    gradientGlow: 'from-cyan-500 via-teal-400 to-blue-500',
    boxBorder: 'border-cyan-400/60',
    boxShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.45)]',
    iconClass: 'text-cyan-400',
    iconHoverClass: 'group-hover:text-cyan-200',
    trademarkColor: 'text-cyan-400',
    badgeBg: 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-300',
    pulseDot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
    paletteDot: 'bg-cyan-400',
  },
  purple: {
    id: 'purple',
    name: 'Cyber Violet',
    gradientGlow: 'from-purple-500 via-fuchsia-400 to-indigo-500',
    boxBorder: 'border-purple-400/60',
    boxShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.45)]',
    iconClass: 'text-purple-400',
    iconHoverClass: 'group-hover:text-fuchsia-200',
    trademarkColor: 'text-purple-400',
    badgeBg: 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20',
    badgeBorder: 'border-purple-400/40',
    badgeText: 'text-purple-300',
    pulseDot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
    paletteDot: 'bg-purple-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Emerald',
    gradientGlow: 'from-emerald-400 via-teal-300 to-green-500',
    boxBorder: 'border-emerald-400/60',
    boxShadow: 'shadow-[0_0_25px_rgba(16,185,129,0.45)]',
    iconClass: 'text-emerald-400',
    iconHoverClass: 'group-hover:text-emerald-200',
    trademarkColor: 'text-emerald-400',
    badgeBg: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
    badgeBorder: 'border-emerald-400/40',
    badgeText: 'text-emerald-300',
    pulseDot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    paletteDot: 'bg-emerald-400',
  },
  rose: {
    id: 'rose',
    name: 'Solar Crimson',
    gradientGlow: 'from-rose-500 via-pink-400 to-orange-500',
    boxBorder: 'border-rose-400/60',
    boxShadow: 'shadow-[0_0_25px_rgba(244,63,94,0.45)]',
    iconClass: 'text-rose-400',
    iconHoverClass: 'group-hover:text-pink-200',
    trademarkColor: 'text-rose-400',
    badgeBg: 'bg-gradient-to-r from-rose-500/20 to-pink-500/20',
    badgeBorder: 'border-rose-400/40',
    badgeText: 'text-rose-300',
    pulseDot: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
    paletteDot: 'bg-rose-400',
  },
  amber: {
    id: 'amber',
    name: 'Liquid Gold',
    gradientGlow: 'from-amber-500 via-yellow-400 to-amber-600',
    boxBorder: 'border-amber-500/50',
    boxShadow: 'shadow-[0_0_25px_rgba(245,158,11,0.45)]',
    iconClass: 'text-amber-400',
    iconHoverClass: 'group-hover:text-yellow-300',
    trademarkColor: 'text-amber-400',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    pulseDot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    paletteDot: 'bg-amber-400',
  },
};

const cleanColorAccents = [
  { name: 'Slate Onyx', fg: '#0f172a', dot: 'bg-slate-900', ring: 'ring-slate-900' },
  { name: 'Sapphire Blue', fg: '#1d4ed8', dot: 'bg-blue-600', ring: 'ring-blue-600' },
  { name: 'Nordic Emerald', fg: '#047857', dot: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { name: 'Executive Violet', fg: '#6d28d9', dot: 'bg-purple-600', ring: 'ring-purple-600' },
  { name: 'Crimson Rose', fg: '#be123c', dot: 'bg-rose-600', ring: 'ring-rose-600' },
  { name: 'Tuscan Amber', fg: '#b45309', dot: 'bg-amber-600', ring: 'ring-amber-600' },
];

const cleanSurpriseStyles = [
  { name: 'Classic Slate', fg: '#0f172a', bg: '#ffffff', dots: 'rounded', corner: 'extra-rounded', gradient: false },
  { name: 'Corporate Indigo', fg: '#1e3a8a', bg: '#ffffff', dots: 'classy-rounded', corner: 'extra-rounded', gradient: false },
  { name: 'Business Charcoal', fg: '#334155', bg: '#f8fafc', dots: 'square', corner: 'square', gradient: false },
  { name: 'Emerald Trust', fg: '#065f46', bg: '#ffffff', dots: 'rounded', corner: 'dot', gradient: false },
  { name: 'Royal Sapphire', fg: '#1d4ed8', bg: '#ffffff', dots: 'classy', corner: 'extra-rounded', gradient: false },
  { name: 'Warm Espresso', fg: '#3e2723', bg: '#fdfbf7', dots: 'rounded', corner: 'extra-rounded', gradient: false },
  { name: 'Cobalt Modern', fg: '#1e40af', bg: '#ffffff', dots: 'classy-rounded', corner: 'extra-rounded', gradient: false },
  { name: 'Nordic Mint', fg: '#064e3b', bg: '#f0fdf4', dots: 'rounded', corner: 'extra-rounded', gradient: false },
];

const surpriseStyles = [
  { name: 'Electric Cyan', fg: '#00f5ff', bg: '#080d1a', dots: 'classy-rounded', corner: 'extra-rounded', gradient: true, gStart: '#00f5ff', gEnd: '#3b82f6', gType: 'linear', gRot: 45 },
  { name: 'Liquid Gold', fg: '#fbbf24', bg: '#08070b', dots: 'classy', corner: 'extra-rounded', gradient: true, gStart: '#f59e0b', gEnd: '#fef08a', gType: 'linear', gRot: 45 },
  { name: 'Obsidian Magma', fg: '#f97316', bg: '#09080d', dots: 'dots', corner: 'dot', gradient: true, gStart: '#ea580c', gEnd: '#fbbf24', gType: 'linear', gRot: 90 },
  { name: 'Neon Cyber', fg: '#00f0ff', bg: '#080d1a', dots: 'classy', corner: 'dot', gradient: false },
  { name: 'Hyper Violet', fg: '#c084fc', bg: '#090614', dots: 'rounded', corner: 'extra-rounded', gradient: true, gStart: '#c084fc', gEnd: '#f43f5e', gType: 'linear', gRot: 135 },
  { name: 'Terminal Matrix', fg: '#00ff66', bg: '#021408', dots: 'dots', corner: 'square', gradient: true, gStart: '#00ff66', gEnd: '#059669', gType: 'linear', gRot: 90 },
  { name: 'Royal Platinum', fg: '#f8fafc', bg: '#080c14', dots: 'extra-rounded', corner: 'extra-rounded', gradient: true, gStart: '#f8fafc', gEnd: '#94a3b8', gType: 'linear', gRot: 45 },
  { name: 'Sunset Fusion', fg: '#f43f5e', bg: '#ffffff', dots: 'rounded', corner: 'extra-rounded', gradient: true, gStart: '#f43f5e', gEnd: '#f59e0b', gType: 'linear', gRot: 45 },
  { name: 'Emerald Matrix', fg: '#10b981', bg: '#03140d', dots: 'dots', corner: 'dot', gradient: false },
  { name: 'Electric Violet', fg: '#a855f7', bg: '#0f0728', dots: 'classy-rounded', corner: 'extra-rounded', gradient: true, gStart: '#a855f7', gEnd: '#ec4899', gType: 'linear', gRot: 135 },
  { name: 'Nordic Aurora', fg: '#34d399', bg: '#06131c', dots: 'extra-rounded', corner: 'extra-rounded', gradient: true, gStart: '#34d399', gEnd: '#38bdf8', gType: 'linear', gRot: 45 },
  { name: 'Rose Gold Luxe', fg: '#fb7185', bg: '#0f070e', dots: 'classy-rounded', corner: 'dot', gradient: true, gStart: '#fb7185', gEnd: '#f59e0b', gType: 'linear', gRot: 90 },
  { name: 'Tokyo Soft Slate', fg: '#1e293b', bg: '#f8fafc', dots: 'extra-rounded', corner: 'extra-rounded', gradient: false },
  { name: 'Swiss Minimalist', fg: '#000000', bg: '#ffffff', dots: 'square', corner: 'square', gradient: false },
];

function AppContent() {
  const { uiTheme, setUiTheme, isClean } = useTheme();
  const [state, setState] = useState<AppState>(initialState);
  const [activeTab, setActiveTab] = useState('Content');
  const [logoTheme, setLogoTheme] = useState<LogoColorTheme>(() => {
    try {
      const saved = localStorage.getItem('qrcraft_logo_color');
      if (saved && saved in LOGO_COLOR_THEMES) {
        return saved as LogoColorTheme;
      }
    } catch (e) {
      // ignore
    }
    return 'cyan';
  });

  const currentTheme = LOGO_COLOR_THEMES[logoTheme] || LOGO_COLOR_THEMES.cyan;

  const handleLogoThemeChange = (newTheme: LogoColorTheme) => {
    setLogoTheme(newTheme);
    try {
      localStorage.setItem('qrcraft_logo_color', newTheme);
    } catch (e) {
      // ignore
    }
  };

  const cycleLogoTheme = () => {
    const themeKeys = Object.keys(LOGO_COLOR_THEMES) as LogoColorTheme[];
    const currentIndex = themeKeys.indexOf(logoTheme);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    handleLogoThemeChange(nextTheme);
  };

  const handleSwitchTheme = (newTheme: UiTheme) => {
    setUiTheme(newTheme);
    if (newTheme === 'clean-pro' && (state.style.bgColor !== '#ffffff' || state.style.fgColor === '#06b6d4' || state.style.fgColor === '#00f5ff')) {
      setState((prev) => ({
        ...prev,
        style: {
          ...prev.style,
          fgColor: '#0f172a',
          bgColor: '#ffffff',
          gradientEnabled: false,
          frameStyle: prev.style.frameStyle === 'futuristic-hud' ? 'none' : prev.style.frameStyle,
        },
      }));
    } else if (newTheme === 'studio-dark' && state.style.bgColor === '#ffffff' && state.style.fgColor === '#0f172a') {
      setState((prev) => ({
        ...prev,
        style: {
          ...prev.style,
          fgColor: '#06b6d4',
          bgColor: '#ffffff',
          gradientEnabled: true,
          gradientStart: '#06b6d4',
          gradientEnd: '#3b82f6',
        },
      }));
    }
  };

  const handleSurprise = () => {
    const list = isClean ? cleanSurpriseStyles : surpriseStyles;
    const random = list[Math.floor(Math.random() * list.length)] as any;
    setState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        fgColor: random.fg,
        bgColor: random.bg,
        dotsType: random.dots,
        cornersSquareType: random.corner,
        cornersDotType: random.corner === 'extra-rounded' ? 'dot' : random.corner,
        gradientEnabled: !!random.gradient,
        gradientStart: random.gStart || prev.style.gradientStart,
        gradientEnd: random.gEnd || prev.style.gradientEnd,
        gradientType: random.gType || prev.style.gradientType,
        gradientRotation: random.gRot !== undefined ? random.gRot : prev.style.gradientRotation,
      },
    }));
  };

  const handleReset = () => {
    if (isClean) {
      setState({
        ...initialState,
        style: {
          ...initialState.style,
          fgColor: '#0f172a',
          bgColor: '#ffffff',
          gradientEnabled: false,
          dotsType: 'rounded',
          cornersSquareType: 'extra-rounded',
          cornersDotType: 'dot',
        },
      });
    } else {
      setState(initialState);
    }
  };

  return (
    <div
      className={`min-h-screen font-sans overflow-x-hidden relative transition-colors duration-300 ${
        isClean
          ? 'bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900'
          : 'text-slate-100 selection:bg-amber-500/30 selection:text-amber-200'
      }`}
    >
      {/* Background Decor */}
      {isClean ? (
        <>
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Subtle soft organic gradient blobs for Clean Pro */}
            <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/60 via-indigo-100/40 to-sky-50/20 blur-3xl animate-pulse-glow" />
            <div className="absolute top-[35%] right-[-5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-teal-100/40 via-emerald-50/30 to-blue-50/20 blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[25%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-violet-100/40 via-purple-50/30 to-slate-100/20 blur-3xl animate-blob animation-delay-4000" />
            {/* Subtle architectural dot-grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_80%,transparent_100%)] opacity-70" />
          </div>
          {/* Multiple Flying Rockets in Clean Pro (Max: 5 rockets, collision + thrown away + fly again) */}
          <CleanProRockets maxRockets={5} interactive={true} />
        </>
      ) : (
        <>
          <FuturisticBackground />
          <div className="bg-blob bg-amber-500/15 top-[-10%] left-[-10%] animate-blob" />
          <div className="bg-blob bg-orange-600/10 bottom-[-10%] right-[-10%] animate-blob animation-delay-2000" />
          <div className="bg-blob bg-yellow-500/10 top-[40%] left-[30%] animate-blob animation-delay-4000" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Navigation Bar Header */}
        <header
          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b transition-colors duration-200 ${
            isClean ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
            {/* Logo Emblem */}
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={cycleLogoTheme}
              title={isClean ? 'QR craft Professional' : `Current logo colour: ${currentTheme.name}. Click to cycle colours.`}
            >
              {!isClean && (
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${currentTheme.gradientGlow} rounded-2xl blur-md opacity-85 group-hover:opacity-100 transition-all duration-500`}
                />
              )}
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 ${
                  isClean
                    ? 'bg-blue-600 text-white shadow-sm border border-blue-700/20'
                    : `bg-slate-950 border ${currentTheme.boxBorder} ${currentTheme.boxShadow}`
                }`}
              >
                <QrCode
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isClean ? 'text-white' : `${currentTheme.iconClass} ${currentTheme.iconHoverClass}`
                  }`}
                />
              </div>
            </div>

            {/* Brand Titles & Theme Mode Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <h1
                  className={`text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 whitespace-nowrap ${
                    isClean ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  QR craft
                  <span
                    className={`${
                      isClean ? 'text-blue-600' : currentTheme.trademarkColor
                    } text-lg font-bold transition-colors duration-300`}
                  >
                    ®
                  </span>
                </h1>

                <span
                  className={`px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider rounded-full transition-all duration-300 whitespace-nowrap shrink-0 relative overflow-hidden ${
                    isClean
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-xs'
                      : `${currentTheme.badgeBg} border ${currentTheme.badgeBorder} ${currentTheme.badgeText}`
                  }`}
                >
                  {isClean && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-clean-shimmer pointer-events-none" />
                  )}
                  {isClean ? 'Clean Edition' : 'Luxury Studio'}
                </span>

                {/* Inline Color Palette Selector for Clean Pro */}
                {isClean && (
                  <div
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 shadow-xs backdrop-blur-sm shrink-0"
                    title="Quick accent color for your QR code"
                  >
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mr-0.5 hidden sm:inline">
                      Accent:
                    </span>
                    {cleanColorAccents.map((accent) => {
                      const isSelected = state.style.fgColor === accent.fg;
                      return (
                        <button
                          key={accent.name}
                          type="button"
                          onClick={() => {
                            setState((prev) => ({
                              ...prev,
                              style: {
                                ...prev.style,
                                fgColor: accent.fg,
                                gradientEnabled: false,
                              },
                            }));
                          }}
                          title={`Set accent to ${accent.name}`}
                          className={`w-3.5 h-3.5 rounded-full ${accent.dot} transition-all duration-200 cursor-pointer shrink-0 hover:scale-125 ${
                            isSelected
                              ? 'scale-125 ring-2 ring-offset-1 ring-slate-800 ring-offset-white shadow-xs'
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Inline Color Palette Selector (in studio-dark mode) */}
                {!isClean && (
                  <div
                    className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-sm shrink-0"
                    title="Choose logo colour"
                  >
                    {(Object.keys(LOGO_COLOR_THEMES) as LogoColorTheme[]).map((themeKey) => {
                      const t = LOGO_COLOR_THEMES[themeKey];
                      const isActive = logoTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogoThemeChange(themeKey);
                          }}
                          title={`Switch logo to ${t.name}`}
                          className={`w-3.5 h-3.5 rounded-full ${t.paletteDot} transition-all duration-200 cursor-pointer shrink-0 ${
                            isActive
                              ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-950 shadow-md'
                              : 'opacity-40 hover:opacity-100 hover:scale-110'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className={`text-xs flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 leading-normal ${
                  isClean ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {isClean ? (
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-slate-700 font-medium">Standard High-Precision QR Generator</span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-500 text-[11px] hidden sm:inline">100% Reliable Camera Recognition</span>
                    <span className="text-slate-400 hidden md:inline">•</span>
                    <span className="text-blue-600 text-[11px] font-semibold hidden md:inline-flex items-center space-x-1 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100">
                      <span>🚀 5 Rockets Active</span>
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${currentTheme.pulseDot} animate-pulse transition-all duration-300 shrink-0`}
                      />
                      <span className="text-slate-300 font-medium whitespace-nowrap">Obsidian Magma</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      Theme:{' '}
                      <span className={`${currentTheme.trademarkColor} font-semibold transition-colors duration-300`}>
                        {currentTheme.name}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Header Toolbar & Theme Mode Switcher */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Mode Switcher Option */}
            <div
              className={`flex items-center p-1 rounded-xl border shadow-xs transition-colors ${
                isClean ? 'bg-slate-100/90 border-slate-200/90 backdrop-blur-sm' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => handleSwitchTheme('clean-pro')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isClean
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/90 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Normal clean professional theme (no neon or futuristic effects)"
              >
                <Briefcase className={`w-3.5 h-3.5 shrink-0 ${isClean ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">Clean Pro</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTheme('studio-dark')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !isClean
                    ? 'bg-slate-800 text-white shadow-sm border border-white/10 font-bold scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Futuristic studio theme with neon effects and ambient particles"
              >
                <Sparkles className={`w-3.5 h-3.5 shrink-0 ${!isClean ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">Futuristic</span>
              </button>
            </div>

            <button
              onClick={handleSurprise}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap active:scale-95 ${
                isClean
                  ? 'bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-slate-800 hover:text-blue-700 hover:shadow-sm'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-white'
              }`}
              title="Shuffle a stylish preset"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isClean ? 'text-blue-600 group-hover:rotate-45 transition-transform' : 'text-amber-400 animate-pulse'}`} />
              <span>{isClean ? 'Preset Shuffle' : 'Surprise Style'}</span>
            </button>

            <button
              onClick={handleReset}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition-all text-xs font-medium cursor-pointer whitespace-nowrap active:scale-95 ${
                isClean
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs hover:border-slate-300'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Reset</span>
            </button>

            <div
              className={`hidden sm:flex items-center space-x-1.5 pl-2 border-l text-[11px] font-mono whitespace-nowrap shrink-0 ${
                isClean ? 'border-slate-200 text-emerald-700 font-semibold' : 'border-white/10 text-amber-300/80'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isClean ? 'text-emerald-600' : 'text-amber-400'}`} />
              <span>100% Client-Side</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-7 xl:col-span-8 min-h-[580px] lg:h-[calc(100vh-13rem)]"
          >
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              state={state}
              setState={setState}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
            className="lg:col-span-5 xl:col-span-4 min-h-[580px] lg:h-[calc(100vh-13rem)]"
          >
            <PreviewPanel state={state} setState={setState} />
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

