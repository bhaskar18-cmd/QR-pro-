import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { AppState } from '../types';
import { generateQROptions, generateQRData } from '../utils/qrUtils';
import { Download, Copy, ScanLine, AlertCircle, X } from 'lucide-react';
import { SimulateScanModal } from './SimulateScanModal';

interface PreviewPanelProps {
  state: AppState;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ state }) => {
  const [liveMode, setLiveMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [showLiveModeAlert, setShowLiveModeAlert] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (showLiveModeAlert) {
      const timer = setTimeout(() => {
        setShowLiveModeAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLiveModeAlert]);

  useEffect(() => {
    qrCode.current = new QRCodeStyling(generateQROptions(state));
    if (qrRef.current) {
      qrCode.current.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    if (!qrCode.current) return;

    setIsGenerating(true);
    qrCode.current.update(generateQROptions(state));
    const timer = setTimeout(() => setIsGenerating(false), 300);
    return () => clearTimeout(timer);
  }, [state]);

  const handleDownload = async (extension: 'png' | 'svg') => {
    if (!qrCode.current) return;

    if (state.style.bgImage && extension === 'png') {
      try {
        const rawData = await qrCode.current.getRawData('png');
        if (!rawData) return;

        const qrBlob = new Blob([rawData], { type: 'image/png' });
        const qrUrl = URL.createObjectURL(qrBlob);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
          bgImg.src = state.style.bgImage!;
        });

        const qrImg = new Image();
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
          qrImg.src = qrUrl;
        });

        canvas.width = qrImg.width;
        canvas.height = qrImg.height;

        // Draw background
        // Calculate cover dimensions
        const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
        ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

        // Draw QR
        ctx.drawImage(qrImg, 0, 0);

        const finalUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcraft.png`;
        link.href = finalUrl;
        link.click();

        URL.revokeObjectURL(qrUrl);
      } catch (error) {
        console.error('Error generating image with background:', error);
        qrCode.current.download({ name: 'qrcraft', extension });
      }
    } else {
      qrCode.current.download({ name: 'qrcraft', extension });
    }
  };

  const handleCopy = () => {
    const data = generateQRData(state.content);
    navigator.clipboard.writeText(data);
  };

  return (
    <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden sticky top-6">
      <div className="flex p-4 gap-2 border-b border-indigo-100/50 justify-between items-center bg-white/40">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Preview</h2>
        <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-600">Live Mode</span>
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              liveMode ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                liveMode ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <div className="relative group w-full flex justify-center">
          <div
            className={`bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 transition-all duration-300 w-full max-w-[280px] aspect-square flex items-center justify-center animate-float hover:scale-105 ${
              isGenerating ? 'scale-95 opacity-70 blur-[2px]' : 'scale-100 opacity-100 blur-0'
            }`}
            style={state.style.bgImage ? {
              backgroundImage: `url(${state.style.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            <div ref={qrRef} className="rounded-2xl overflow-hidden w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white/60 border-t border-indigo-100/50 space-y-4">
        <button
          onClick={() => {
            if (!liveMode) {
              setShowLiveModeAlert(true);
            } else {
              setIsScanModalOpen(true);
            }
          }}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-medium shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center space-x-2 group"
        >
          <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Simulate Scan</span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleDownload('png')}
            className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-700"
          >
            <Download className="w-5 h-5 mb-1 text-indigo-600" />
            <span className="text-xs font-medium">PNG</span>
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-700"
          >
            <Download className="w-5 h-5 mb-1 text-indigo-600" />
            <span className="text-xs font-medium">SVG</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-700"
          >
            <Copy className="w-5 h-5 mb-1 text-indigo-600" />
            <span className="text-xs font-medium">Copy Data</span>
          </button>
        </div>
      </div>

      {isScanModalOpen && (
        <SimulateScanModal
          state={state}
          onClose={() => setIsScanModalOpen(false)}
        />
      )}

      {showLiveModeAlert && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[90%] max-w-sm">
          <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-sm font-medium flex-1">Please turn on Live Mode to simulate scan.</p>
          <button 
            onClick={() => setShowLiveModeAlert(false)}
            className="text-red-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
