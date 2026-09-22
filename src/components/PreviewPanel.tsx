import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { AppState } from '../types';
import { generateQROptions, generateQRData } from '../utils/qrUtils';
import {
  Download,
  Copy,
  Check,
  ScanLine,
  AlertCircle,
  X,
  Sparkles,
  QrCode,
  CreditCard,
  Layers,
  Smartphone,
} from 'lucide-react';
import { SimulateScanModal } from './SimulateScanModal';
import { TowerIndicator } from './TowerIndicator';
import { useTheme } from '../ThemeContext';

interface PreviewPanelProps {
  state: AppState;
  setState?: React.Dispatch<React.SetStateAction<AppState>>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ state }) => {
  const { isClean } = useTheme();
  const [liveMode, setLiveMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [showLiveModeAlert, setShowLiveModeAlert] = useState(false);
  const [previewMode, setPreviewMode] = useState<'flat' | 'card'>('flat');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showLiveModeAlert) {
      const timer = setTimeout(() => {
        setShowLiveModeAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLiveModeAlert]);

  // Standard QR Code initialization and real-time updates
  useEffect(() => {
    if (!qrRef.current) return;

    try {
      const options = generateQROptions(state);

      if (!qrCode.current) {
        qrCode.current = new QRCodeStyling(options);
        qrRef.current.innerHTML = '';
        qrCode.current.append(qrRef.current);
      } else {
        if (!qrRef.current.querySelector('canvas') && !qrRef.current.querySelector('svg')) {
          qrRef.current.innerHTML = '';
          qrCode.current.append(qrRef.current);
        }
        qrCode.current.update(options);
      }

      setIsScanning(true);
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = setTimeout(() => {
        setIsScanning(false);
      }, 500);
    } catch (err) {
      console.error('Error rendering QR code:', err);
    }

    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, [state]);

  const handleDownload = async (extension: 'png' | 'svg') => {
    if (!qrCode.current) return;

    if (extension === 'png') {
      const hasFrame = state.style.frameStyle && state.style.frameStyle !== 'none';
      if (state.style.bgImage || hasFrame) {
        try {
          const rawData = await qrCode.current.getRawData('png');
          if (!rawData) return;

          const qrBlob = new Blob([rawData], { type: 'image/png' });
          const qrUrl = URL.createObjectURL(qrBlob);

          const qrImg = new Image();
          await new Promise((resolve, reject) => {
            qrImg.onload = resolve;
            qrImg.onerror = reject;
            qrImg.src = qrUrl;
          });

          const qrW = qrImg.width;
          const qrH = qrImg.height;

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          if (!hasFrame) {
            canvas.width = qrW;
            canvas.height = qrH;

            if (state.style.bgImage) {
              const bgImg = new Image();
              bgImg.crossOrigin = 'anonymous';
              await new Promise((resolve, reject) => {
                bgImg.onload = resolve;
                bgImg.onerror = reject;
                bgImg.src = state.style.bgImage!;
              });

              const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
              const x = canvas.width / 2 - (bgImg.width / 2) * scale;
              const y = canvas.height / 2 - (bgImg.height / 2) * scale;
              ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
            }

            ctx.drawImage(qrImg, 0, 0);
          } else {
            const frame = state.style.frameStyle;
            const frameColor = state.style.frameColor || '#06b6d4';
            const frameText = state.style.frameText || 'SCAN ME';
            const pad = Math.round(qrW * 0.08);
            const bannerH = Math.round(qrW * 0.16);

            canvas.width = qrW + pad * 2;
            canvas.height = qrH + pad * 2 + bannerH;

            ctx.fillStyle = state.style.bgColor === 'transparent' ? '#0b0f19' : state.style.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (frame === 'scan-me') {
              ctx.fillStyle = frameColor;
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(pad, pad, qrW, bannerH * 0.85, 14);
              } else {
                ctx.rect(pad, pad, qrW, bannerH * 0.85);
              }
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = `bold ${Math.round(bannerH * 0.42)}px system-ui, -apple-system, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`✦ ${frameText} ✦`, canvas.width / 2, pad + (bannerH * 0.85) / 2);

              ctx.drawImage(qrImg, pad, pad + bannerH);
            } else if (frame === 'minimal-pill') {
              ctx.drawImage(qrImg, pad, pad);

              ctx.fillStyle = frameColor;
              const pillW = Math.round(qrW * 0.7);
              const pillH = Math.round(bannerH * 0.85);
              const pillX = (canvas.width - pillW) / 2;
              const pillY = pad + qrH + Math.round(pad * 0.4);
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
              } else {
                ctx.rect(pillX, pillY, pillW, pillH);
              }
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.font = `bold ${Math.round(pillH * 0.45)}px system-ui, -apple-system, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(frameText, canvas.width / 2, pillY + pillH / 2);
            } else if (frame === 'luxury-badge') {
              ctx.fillStyle = frameColor;
              ctx.font = `bold ${Math.round(bannerH * 0.35)}px monospace, sans-serif`;
              ctx.textAlign = 'center';
              ctx.fillText('★ AUTHENTIC PASS ★', canvas.width / 2, pad + bannerH * 0.45);

              ctx.drawImage(qrImg, pad, pad + bannerH);

              const pillH = Math.round(bannerH * 0.75);
              const pillY = pad + bannerH + qrH + Math.round(pad * 0.2);
              ctx.fillStyle = frameColor;
              ctx.fillRect(pad, pillY, qrW, pillH);

              ctx.fillStyle = '#09080d';
              ctx.font = `bold ${Math.round(pillH * 0.48)}px monospace, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(frameText, canvas.width / 2, pillY + pillH / 2);
            } else if (frame === 'futuristic-hud') {
              ctx.fillStyle = frameColor;
              ctx.font = `bold ${Math.round(bannerH * 0.32)}px monospace, sans-serif`;
              ctx.textAlign = 'left';
              ctx.fillText('SYS // TARGET MATRIX [READY]', pad, pad + bannerH * 0.5);

              ctx.drawImage(qrImg, pad, pad + bannerH);

              const footerY = pad + bannerH + qrH + Math.round(pad * 0.3);
              ctx.fillStyle = frameColor;
              ctx.font = `bold ${Math.round(bannerH * 0.35)}px monospace, sans-serif`;
              ctx.textAlign = 'center';
              ctx.fillText(`[ ${frameText} ]`, canvas.width / 2, footerY);
            }
          }

          const link = document.createElement('a');
          link.download = `qrcraft-${hasFrame ? 'framed' : 'styled'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          return;
        } catch (e) {
          console.error('Framed export fallback', e);
        }
      }
    }

    qrCode.current.download({ name: 'qrcraft', extension });
  };

  const handleCopy = () => {
    const data = generateQRData(state.content);
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={`flex flex-col h-full rounded-3xl overflow-hidden sticky top-6 transition-colors duration-300 ${
        isClean
          ? 'bg-white border border-slate-200/90 shadow-sm ring-1 ring-slate-100'
          : 'bg-slate-950/60 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
      }`}
    >
      {/* Viewport Header Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2.5 p-4 px-5 border-b transition-colors ${
          isClean ? 'bg-slate-50/90 border-slate-200' : 'bg-white/[0.02] border-white/10'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isClean ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse'
            }`}
          />
          <h2
            className={`text-xs uppercase tracking-widest font-bold whitespace-nowrap ${
              isClean ? 'font-sans text-slate-700' : 'font-mono text-slate-300'
            }`}
          >
            Live Viewport
          </h2>

          {/* Clean Pro View Switcher: Flat Canvas vs Card Mockup */}
          {isClean ? (
            <div className="flex items-center p-0.5 rounded-lg bg-slate-200/70 border border-slate-300/60 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('flat')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  previewMode === 'flat'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Direct flat QR view"
              >
                Flat
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('card')}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
                  previewMode === 'card'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Business Card Mockup view"
              >
                <CreditCard className="w-3 h-3" />
                <span>Card</span>
              </button>
            </div>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap shrink-0 bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono">
              Standard QR
            </span>
          )}
        </div>

        <div
          className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-full border shadow-xs shrink-0 transition-colors ${
            isClean ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/80 border-white/10 text-slate-300'
          }`}
        >
          <TowerIndicator isActive={liveMode} />
          <span
            className={`text-xs uppercase tracking-wider font-semibold whitespace-nowrap ${
              isClean ? 'font-sans text-slate-700' : 'font-mono text-slate-300'
            }`}
          >
            Scanner Mode
          </span>
          <button
            onClick={() => setLiveMode(!liveMode)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer shrink-0 ${
              liveMode
                ? isClean
                  ? 'bg-blue-600'
                  : 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.6)]'
                : isClean
                  ? 'bg-slate-200'
                  : 'bg-slate-800'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                liveMode ? 'translate-x-4.5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Optical Code Display Podium */}
      <div
        className={`flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative min-h-[420px] transition-colors ${
          isClean ? 'bg-slate-50/50' : 'bg-transparent'
        }`}
      >
        {/* Ambient background glow (in futuristic mode only) */}
        {!isClean && (
          <>
            <div className="absolute w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        <div className="relative group w-full flex justify-center items-center">
          {/* If Clean Pro and 'card' mockup mode is selected, render Executive Business Card Mockup */}
          {isClean && previewMode === 'card' ? (
            <div
              className="relative w-full max-w-[320px] bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl p-5 border border-slate-200/90 shadow-[0_20px_45px_-12px_rgba(15,23,42,0.12)] hover:shadow-[0_25px_55px_-10px_rgba(15,23,42,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Card Header */}
              <div className="w-full flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-xs">
                    QC
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-900 tracking-tight leading-none">
                      EXECUTIVE PASS
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                      Verified Contact & URL
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono font-semibold uppercase text-slate-500">NFC Active</span>
                </div>
              </div>

              {/* QR Container Canvas/SVG Host in Card */}
              <div className="relative p-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden w-full max-w-[220px] aspect-square">
                <div
                  ref={qrRef}
                  className="rounded-xl overflow-hidden w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:w-auto [&>canvas]:h-auto [&>canvas]:object-contain [&>svg]:max-w-full [&>svg]:max-h-full"
                />

                {/* Clean Laser Scan Sweep in Card */}
                {(isScanning || isHovered) && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-clean-shimmer" />
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="w-full mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                  {state.content.url || state.content.text || 'Scan to view details'}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-blue-600 font-bold shrink-0">
                  ISO 18004
                </span>
              </div>
            </div>
          ) : (
            /* Standard Flat Viewport */
            <div
              className={`relative p-4 rounded-3xl flex flex-col items-center transition-all duration-300 ${
                isClean
                  ? 'bg-white border border-slate-200/90 shadow-md ring-1 ring-slate-100 hover:shadow-xl hover:-translate-y-1'
                  : 'bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-md'
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Corner Sci-Fi Bracket Accents (Futuristic mode only) */}
              {!isClean && (
                <>
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg pointer-events-none" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg pointer-events-none" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg pointer-events-none" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-lg pointer-events-none" />
                </>
              )}

              {/* Optional Frame Top */}
              {state.style.frameStyle === 'scan-me' && (
                <div
                  className="w-full max-w-[276px] py-2 px-3 mb-2.5 rounded-xl text-center text-xs font-bold tracking-wider uppercase text-white shadow-xs flex items-center justify-center space-x-1.5 transition-all overflow-hidden"
                  style={{ backgroundColor: state.style.frameColor || (isClean ? '#2563eb' : '#06b6d4') }}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{state.style.frameText || 'SCAN ME'}</span>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                </div>
              )}

              {state.style.frameStyle === 'luxury-badge' && (
                <div className="w-full max-w-[276px] flex items-center justify-between mb-2 px-1 text-[10px] font-mono font-bold tracking-wider uppercase">
                  <span className="truncate" style={{ color: state.style.frameColor || '#f59e0b' }}>
                    ★ AUTHENTIC PASS
                  </span>
                  <span
                    className={`text-[9px] uppercase whitespace-nowrap shrink-0 ml-1.5 ${
                      isClean ? 'text-slate-500 font-sans' : 'text-slate-400 font-mono'
                    }`}
                  >
                    VERIFIED
                  </span>
                </div>
              )}

              {state.style.frameStyle === 'futuristic-hud' && !isClean && (
                <div className="w-full max-w-[276px] flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                      style={{ backgroundColor: state.style.frameColor || '#06b6d4' }}
                    />
                    <span
                      className="text-[10px] font-mono tracking-wider uppercase font-bold truncate"
                      style={{ color: state.style.frameColor || '#06b6d4' }}
                    >
                      SYS // MATRIX
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap shrink-0 ml-1.5">
                    READY
                  </span>
                </div>
              )}

              {/* QR Card Container */}
              <div
                className={`relative bg-white p-4 rounded-2xl transition-all duration-300 w-full max-w-[276px] aspect-square flex items-center justify-center overflow-hidden ${
                  isClean
                    ? 'border border-slate-200 shadow-sm'
                    : `shadow-[0_10px_40px_rgba(0,0,0,0.5)] border animate-float hover:scale-[1.02] ${
                        isScanning
                          ? 'border-cyan-400/60 ring-2 ring-cyan-400/40 shadow-[0_0_35px_rgba(34,211,238,0.3)]'
                          : 'border-white/20'
                      }`
                }`}
                style={
                  state.style.bgImage
                    ? {
                        backgroundImage: `url(${state.style.bgImage})`,
                        backgroundPosition: 'center',
                      }
                    : {}
                }
              >
                {/* QR Container Canvas/SVG Host */}
                <div
                  ref={qrRef}
                  className="rounded-xl overflow-hidden w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:w-auto [&>canvas]:h-auto [&>canvas]:object-contain [&>svg]:max-w-full [&>svg]:max-h-full"
                />

                {/* Scanning Indicator Overlay */}
                {isClean ? (
                  (isScanning || isHovered) && (
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-10">
                      {/* Subtle Clean Pro Sapphire Laser Sweep */}
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-[0_0_10px_rgba(37,99,235,0.7)] animate-scan-beam" />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/95 border border-blue-200 shadow-xs backdrop-blur-sm flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-[9.5px] font-semibold tracking-wider text-blue-700 uppercase whitespace-nowrap">
                          {isScanning ? 'Syncing Matrix' : 'Hover Active'}
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  isScanning && (
                    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden z-10">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
                      <div className="absolute left-0 right-0 w-full -mt-24 h-24 animate-scan-beam pointer-events-none">
                        <div className="w-full h-full bg-gradient-to-t from-cyan-400/35 via-cyan-400/10 to-transparent" />
                        <div className="w-full h-[2.5px] bg-cyan-300 shadow-[0_0_10px_#22d3ee,0_0_22px_#06b6d4,0_0_35px_#38bdf8,0_0_3px_#ffffff]" />
                      </div>
                      <div className="absolute inset-2.5 border border-cyan-400/30 rounded-xl pointer-events-none">
                        <div className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
                        <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
                      </div>
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.5)] backdrop-blur-md flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span className="text-[9.5px] font-mono font-bold tracking-wider text-cyan-300 uppercase whitespace-nowrap">
                          Regenerating QR
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Optional Frame Bottom */}
              {state.style.frameStyle === 'luxury-badge' && (
                <div
                  className="w-full max-w-[276px] mt-2.5 py-2 px-3 rounded-lg text-center text-[11px] font-bold tracking-widest uppercase shadow-xs border overflow-hidden"
                  style={{
                    backgroundColor: state.style.frameColor || '#f59e0b',
                    color: '#09080d',
                    borderColor: isClean ? '#e2e8f0' : 'rgba(255,255,255,0.2)',
                    fontFamily: isClean ? 'inherit' : 'monospace',
                  }}
                >
                  <span className="truncate block">{state.style.frameText || 'SCAN TO VERIFY'}</span>
                </div>
              )}

              {state.style.frameStyle === 'futuristic-hud' && !isClean && (
                <div className="w-full max-w-[276px] mt-2 flex items-center justify-between px-1 gap-2">
                  <span
                    className="text-[10px] font-mono font-bold tracking-wider truncate"
                    style={{ color: state.style.frameColor || '#06b6d4' }}
                  >
                    [ {state.style.frameText || 'OPTICAL SCAN READY'} ]
                  </span>
                  <div className="flex space-x-1 shrink-0">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-2.5 rounded-xs"
                        style={{ backgroundColor: state.style.frameColor || '#06b6d4' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {state.style.frameStyle === 'minimal-pill' && (
                <div className="mt-2.5 flex justify-center max-w-[276px]">
                  <div
                    className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase text-white shadow-xs flex items-center space-x-1.5 overflow-hidden max-w-full"
                    style={{ backgroundColor: state.style.frameColor || (isClean ? '#2563eb' : '#06b6d4') }}
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{state.style.frameText || 'SCAN ME'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live status tag */}
        <div
          className={`mt-4 flex items-center justify-center space-x-2 text-[11px] text-center px-4 max-w-full ${
            isClean ? 'font-sans text-slate-500' : 'font-mono text-slate-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isScanning
                ? isClean
                  ? 'bg-blue-600 animate-ping'
                  : 'bg-cyan-400 animate-ping'
                : 'bg-emerald-500'
            }`}
          />
          <span
            className={`leading-tight transition-colors duration-300 ${
              isScanning
                ? isClean
                  ? 'text-blue-600 font-semibold'
                  : 'text-cyan-300 font-semibold'
                : isClean
                  ? 'text-slate-600 font-medium'
                  : 'text-slate-400'
            }`}
          >
            {isScanning ? 'UPDATING QR MATRIX...' : 'STANDARD QR MATRIX READY • SCAN WITH ANY PHONE'}
          </span>
        </div>
      </div>

      {/* Action Footer Controls */}
      <div
        className={`p-5 sm:p-6 border-t space-y-4 transition-colors ${
          isClean ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/70 border-white/10'
        }`}
      >
        <button
          onClick={() => {
            if (!liveMode) {
              setShowLiveModeAlert(true);
            } else {
              setIsScanModalOpen(true);
            }
          }}
          className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2.5 group cursor-pointer active:scale-[0.99] ${
            isClean
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)]'
          }`}
        >
          <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold tracking-wide">Launch Scanner Simulation</span>
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleDownload('png')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all group cursor-pointer active:scale-95 ${
              isClean
                ? 'bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-sm'
                : 'bg-slate-900/80 border border-white/10 hover:border-indigo-400/50 hover:bg-slate-800/80 text-white'
            }`}
          >
            <Download className="w-5 h-5 mb-1.5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className={`text-xs font-semibold ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>PNG HD</span>
          </button>
          <button
            onClick={() => handleDownload('svg')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all group cursor-pointer active:scale-95 ${
              isClean
                ? 'bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-sm'
                : 'bg-slate-900/80 border border-white/10 hover:border-indigo-400/50 hover:bg-slate-800/80 text-white'
            }`}
          >
            <Download className="w-5 h-5 mb-1.5 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className={`text-xs font-semibold ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>SVG Vector</span>
          </button>
          <button
            onClick={handleCopy}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all group cursor-pointer active:scale-95 ${
              isClean
                ? copied
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-700 shadow-xs'
                  : 'bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800 shadow-xs hover:-translate-y-0.5 hover:shadow-sm'
                : 'bg-slate-900/80 border border-white/10 hover:border-indigo-400/50 hover:bg-slate-800/80 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mb-1.5 text-emerald-600 animate-bounce" />
                <span className="text-xs font-bold text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mb-1.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className={`text-xs font-semibold ${isClean ? 'text-slate-700' : 'text-slate-200'}`}>Copy Payload</span>
              </>
            )}
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
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 w-[90%] max-w-sm backdrop-blur-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <p className="text-xs font-medium flex-1">Toggle "Scanner Mode" at the top right to simulate scanning.</p>
          <button 
            onClick={() => setShowLiveModeAlert(false)}
            className="text-rose-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
