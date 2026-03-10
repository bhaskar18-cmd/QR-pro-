import React, { useRef, useEffect, useState } from 'react';
import { colord, AnyColor } from 'colord';

import { X } from 'lucide-react';

interface FuturisticColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose?: () => void;
}

export const FuturisticColorPicker: React.FC<FuturisticColorPickerProps> = ({ color, onChange, onClose }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDraggingWheel, setIsDraggingWheel] = useState(false);
  const [isDraggingBrightness, setIsDraggingBrightness] = useState(false);
  
  const hsv = colord(color).toHsv();
  const [hue, setHue] = useState(hsv.h);
  const [saturation, setSaturation] = useState(hsv.s);
  const [brightness, setBrightness] = useState(hsv.v);

  useEffect(() => {
    const newHsv = colord(color).toHsv();
    setHue(newHsv.h);
    setSaturation(newHsv.s);
    setBrightness(newHsv.v);
  }, [color]);

  const updateColor = (h: number, s: number, v: number) => {
    const newColor = colord({ h, s, v }).toHex();
    onChange(newColor);
  };

  const handleWheelMove = (e: MouseEvent | TouchEvent) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = rect.width / 2;
    
    // Calculate hue (angle)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    // Calculate saturation (distance from center)
    const s = Math.min(100, (distance / radius) * 100);
    
    setHue(angle);
    setSaturation(s);
    updateColor(angle, s, brightness);
  };

  const handleBrightnessMove = (e: MouseEvent | TouchEvent) => {
    const slider = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = Math.max(0, Math.min(slider.width, clientX - slider.left));
    const v = (x / slider.width) * 100;
    
    setBrightness(v);
    updateColor(hue, saturation, v);
  };

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingWheel) handleWheelMove(e);
    };
    const handleGlobalUp = () => {
      setIsDraggingWheel(false);
    };

    if (isDraggingWheel) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
      window.addEventListener('touchmove', handleGlobalMove);
      window.addEventListener('touchend', handleGlobalUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDraggingWheel, hue, saturation, brightness]);

  // Calculate indicator position
  const angleRad = (hue * Math.PI) / 180;
  const radius = 100; // base radius for calculation
  const indicatorX = 50 + (saturation / 2) * Math.cos(angleRad);
  const indicatorY = 50 + (saturation / 2) * Math.sin(angleRad);

  return (
    <div className="relative flex flex-col items-center space-y-5 p-5 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-white/30 hover:text-white transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {/* Color Wheel */}
      <div 
        ref={wheelRef}
        className="relative w-44 h-44 rounded-full cursor-crosshair shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-[#2a2a2a]"
        style={{
          background: `
            radial-gradient(circle, #fff 0%, transparent 100%),
            conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)
          `
        }}
        onMouseDown={() => setIsDraggingWheel(true)}
        onTouchStart={() => setIsDraggingWheel(true)}
      >
        {/* Indicator */}
        <div 
          className="absolute w-5 h-5 border-2 border-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${indicatorX}%`,
            top: `${indicatorY}%`,
            backgroundColor: colord({ h: hue, s: saturation, v: 100 }).toHex()
          }}
        />
      </div>

      {/* Brightness Slider */}
      <div className="w-full space-y-1.5">
        <div 
          className="relative h-6 w-full rounded-full cursor-pointer overflow-hidden bg-[#111] border border-white/5"
          onMouseDown={(e) => {
            setIsDraggingBrightness(true);
            handleBrightnessMove(e as any);
          }}
          style={{
            background: `linear-gradient(to right, #000, ${colord({ h: hue, s: saturation, v: 100 }).toHex()})`
          }}
        >
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-black/20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `calc(${brightness}% - 8px)` }}
          />
        </div>
      </div>

      {/* Saturation Slider */}
      <div className="w-full space-y-1.5">
        <div 
          className="relative h-6 w-full rounded-full cursor-pointer overflow-hidden bg-[#111] border border-white/5"
          onMouseDown={(e) => {
            const slider = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = Math.max(0, Math.min(slider.width, e.clientX - slider.left));
            const s = (x / slider.width) * 100;
            setSaturation(s);
            updateColor(hue, s, brightness);
          }}
          style={{
            background: `linear-gradient(to right, ${colord({ h: hue, s: 0, v: brightness }).toHex()}, ${colord({ h: hue, s: 100, v: brightness }).toHex()})`
          }}
        >
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-black/20 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `calc(${saturation}% - 8px)` }}
          />
        </div>
      </div>

      {/* On/Off Style Buttons (Matching the image) */}
      <div className="flex space-x-4 w-full justify-center">
        <button className="px-4 py-1.5 rounded-full bg-[#2a2a2a] text-[10px] font-bold text-white/50 border border-white/5 hover:bg-[#333] transition-colors">
          Off
        </button>
        <button className="px-4 py-1.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white border border-white/10 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
          On
        </button>
      </div>

      {/* Hex Input */}
      <div className="flex items-center space-x-2 w-full px-2">
        <div 
          className="w-8 h-8 rounded-lg border border-white/10 shadow-lg shrink-0"
          style={{ backgroundColor: color }}
        />
        <input 
          type="text"
          value={color.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value;
            if (colord(val).isValid()) {
              onChange(val);
            }
          }}
          className="w-full bg-black/30 border border-white/5 rounded-lg px-2 py-1.5 text-[10px] font-mono text-white/70 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-center"
        />
      </div>
    </div>
  );
};
