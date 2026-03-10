import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCodeStyling from 'qr-code-styling';
import { AppState } from '../types';
import { generateQROptions, generateQRData } from '../utils/qrUtils';
import { ArrowLeft, MoreVertical, Languages, Mic, Share2, Globe, Copy, Wifi } from 'lucide-react';

interface SimulateScanModalProps {
  state: AppState;
  onClose: () => void;
}

export const SimulateScanModal: React.FC<SimulateScanModalProps> = ({ state, onClose }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrThumbRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const qrData = generateQRData(state.content);
    setData(qrData);

    const qrCode = new QRCodeStyling({
      ...generateQROptions(state),
      width: 300,
      height: 300,
    });
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }

    const qrThumb = new QRCodeStyling({
      ...generateQROptions(state),
      width: 32,
      height: 32,
      margin: 0,
    });
    if (qrThumbRef.current) {
      qrThumbRef.current.innerHTML = '';
      qrThumb.append(qrThumbRef.current);
    }
  }, [state]);

  const getTruncatedText = (text: string) => {
    try {
      const url = new URL(text);
      return url.hostname + '/...';
    } catch {
      return text.length > 15 ? text.substring(0, 15) + '...' : text;
    }
  };

  const isUrl = data.startsWith('http://') || data.startsWith('https://');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 h-[100dvh] w-full z-50 bg-black overflow-hidden font-sans text-white"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-50 bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="text-lg font-medium text-white">Google Lens</span>
          <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Main QR Area */}
        <div className="absolute inset-0 flex flex-col pt-16 pb-[40vh]">
          <div className="flex-1 relative flex items-center justify-center p-8 min-h-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="relative w-full max-w-[320px] aspect-square max-h-full"
            >
            {/* Viewfinder corners */}
            <div className="absolute -inset-6 border-2 border-transparent pointer-events-none">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-white/90 rounded-tl-[32px]" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-white/90 rounded-tr-[32px]" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-white/90 rounded-bl-[32px]" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-white/90 rounded-br-[32px]" />
            </div>
            
            {/* QR Code */}
            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative shadow-2xl">
              <div ref={qrRef} className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto" />
              
              {/* Overlay Pill */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1f1f1f]/80 backdrop-blur-md rounded-full px-4 py-2.5 flex items-center space-x-2 shadow-xl border border-white/10">
                <Globe className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                  {getTruncatedText(data)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating Translate Button */}
          <button className="absolute bottom-6 right-4 w-12 h-12 bg-[#1f1f1f] rounded-full flex items-center justify-center shadow-lg border border-white/10 hover:bg-[#2d2d2d] transition-colors z-10">
            <Languages className="w-5 h-5 text-white" />
          </button>
          </div>
        </div>

        {/* Bottom Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0, height: isExpanded ? '85vh' : 'auto' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (info.offset.y < -30) setIsExpanded(true);
            else if (info.offset.y > 30) setIsExpanded(false);
          }}
          className="absolute bottom-0 left-0 right-0 bg-[#1f1f1f] rounded-t-3xl flex flex-col z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] touch-none max-h-[85vh]"
        >
          {/* Drag Handle */}
          <div 
            className="w-full pt-4 pb-2 cursor-pointer flex-shrink-0 flex justify-center items-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-10 h-1.5 bg-white/30 rounded-full" />
          </div>
          
          {/* Search Bar */}
          <div className="px-4 py-2 flex-shrink-0 pointer-events-auto">
            <form 
              action="https://www.google.com/search" 
              method="GET" 
              target="_blank"
              className="bg-[#2d2d2d] rounded-full p-1.5 flex items-center focus-within:ring-1 focus-within:ring-white/20 transition-all"
            >
              <div className="w-8 h-8 flex items-center justify-center ml-2 flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center ml-2 overflow-hidden flex-shrink-0">
                 <div ref={qrThumbRef} className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto" />
              </div>
              <input 
                type="text" 
                name="q"
                placeholder="Ask about this image or search..."
                className="flex-1 ml-3 bg-transparent text-white text-[15px] placeholder-white/60 focus:outline-none min-w-0"
                autoComplete="off"
              />
              <button type="submit" className="p-2 mr-1 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
                <Mic className="w-5 h-5 text-[#4285F4]" />
              </button>
            </form>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar px-4 pt-4 pb-0 border-b border-white/10 flex-shrink-0 pointer-events-auto">
            <div className="flex space-x-6 text-[15px] font-medium whitespace-nowrap">
              <span className="text-white/60 pb-3">AI Mode</span>
              <span className="text-white pb-3 border-b-2 border-white">All</span>
              <span className="text-white/60 pb-3">Exact matches</span>
              <span className="text-white/60 pb-3">Visual matches</span>
              <span className="text-white/60 pb-3">About this</span>
            </div>
          </div>

          {/* Content Area */}
          <div 
            className="p-4 overflow-y-auto custom-scrollbar pb-12 flex-1 min-h-0 pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-white text-base font-medium break-all leading-tight">
                  {state.content.type === 'wifi' ? state.content.wifi.ssid :
                   state.content.type === 'vcard' ? `${state.content.vcard.firstName} ${state.content.vcard.lastName}` :
                   state.content.type === 'vevent' ? state.content.vevent.title :
                   data}
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  {isUrl ? 'URL from QR code' : 
                   state.content.type === 'wifi' ? 'Wi-Fi from QR code' : 
                   state.content.type === 'vcard' ? 'Contact from QR code' :
                   state.content.type === 'vevent' ? 'Event from QR code' :
                   'Text from QR code'}
                </p>
              </div>

              {/* Extra Details for Specific Types */}
              {state.content.type === 'wifi' && (
                <div className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Password</span>
                    <span className="text-white text-sm font-medium">{state.content.wifi.password || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Encryption</span>
                    <span className="text-white text-sm font-medium">{state.content.wifi.encryption}</span>
                  </div>
                </div>
              )}

              {state.content.type === 'vcard' && (
                <div className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Phone</span>
                    <span className="text-white text-sm font-medium">{state.content.vcard.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Email</span>
                    <span className="text-white text-sm font-medium">{state.content.vcard.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Company</span>
                    <span className="text-white text-sm font-medium">{state.content.vcard.company}</span>
                  </div>
                </div>
              )}

              {state.content.type === 'vevent' && (
                <div className="bg-white/5 rounded-xl p-3 space-y-2 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Location</span>
                    <span className="text-white text-sm font-medium">{state.content.vevent.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">Start</span>
                    <span className="text-white text-sm font-medium">{new Date(state.content.vevent.startTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-sm">End</span>
                    <span className="text-white text-sm font-medium">{new Date(state.content.vevent.endTime).toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 pt-2">
                {isUrl ? (
                  <a
                    href={data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#8ab4f8]" />
                    <span className="text-sm font-medium text-[#8ab4f8]">Website</span>
                  </a>
                ) : state.content.type === 'wifi' ? (
                  <button
                    className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                  >
                    <Wifi className="w-4 h-4 text-[#8ab4f8]" />
                    <span className="text-sm font-medium text-[#8ab4f8]">Connect</span>
                  </button>
                ) : state.content.type === 'vcard' ? (
                  <button
                    className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#8ab4f8]" />
                    <span className="text-sm font-medium text-[#8ab4f8]">Save Contact</span>
                  </button>
                ) : state.content.type === 'vevent' ? (
                  <button
                    className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#8ab4f8]" />
                    <span className="text-sm font-medium text-[#8ab4f8]">Add to Calendar</span>
                  </button>
                ) : null}
                
                <button
                  onClick={() => navigator.clipboard.writeText(data)}
                  className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Copy {isUrl ? 'URL' : 'Text'}</span>
                </button>
                
                <button
                  className="px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2 hover:bg-white/10 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Share</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
