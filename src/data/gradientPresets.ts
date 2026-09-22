export interface GradientPreset {
  id: string;
  name: string;
  start: string;
  end: string;
  rotation: number;
}

export const POPULAR_GRADIENTS: GradientPreset[] = [
  { id: 'cyan-matrix', name: 'Electric Cyan', start: '#00f5ff', end: '#3b82f6', rotation: 45 },
  { id: 'sunset-blaze', name: 'Sunset Blaze', start: '#f43f5e', end: '#f59e0b', rotation: 45 },
  { id: 'cyber-violet', name: 'Cyber Violet', start: '#c084fc', end: '#ec4899', rotation: 135 },
  { id: 'liquid-gold', name: 'Liquid Gold', start: '#f59e0b', end: '#fef08a', rotation: 45 },
  { id: 'matrix-emerald', name: 'Matrix Emerald', start: '#00ff66', end: '#059669', rotation: 90 },
  { id: 'midnight-ice', name: 'Midnight Ice', start: '#38bdf8', end: '#6366f1', rotation: 120 },
  { id: 'rose-copper', name: 'Rose Copper', start: '#fb7185', end: '#f59e0b', rotation: 135 },
  { id: 'nordic-aurora', name: 'Nordic Aurora', start: '#34d399', end: '#38bdf8', rotation: 45 },
  { id: 'solar-flare', name: 'Solar Flare', start: '#ff007a', end: '#7928ca', rotation: 60 },
  { id: 'mint-frost', name: 'Mint Frost', start: '#2dd4bf', end: '#0284c7', rotation: 90 },
];
