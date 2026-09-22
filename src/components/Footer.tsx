import React from 'react';
import { Heart, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const Footer: React.FC = () => {
  const { isClean } = useTheme();
  const email = "ba4462286@gmail.com";
  const subject = encodeURIComponent("Feedback/Issue - QR Craft");
  const mailtoLink = `mailto:${email}?subject=${subject}`;

  return (
    <footer className={`mt-12 py-12 border-t relative z-10 transition-colors ${
      isClean ? 'border-slate-200' : 'border-white/10'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className={`text-sm font-medium ${isClean ? 'text-slate-600' : 'text-white/60'}`}>
            I'm <span className={`font-bold ${isClean ? 'text-slate-900' : 'text-white'}`}>Bhaskar</span>, I have created this.
          </p>
          <p className={`text-xs ${isClean ? 'text-slate-500' : 'text-white/40'}`}>
            Crafting digital experiences with precision and passion.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <a 
            href={mailtoLink}
            className={`group flex items-center space-x-3 border rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95 ${
              isClean
                ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs text-slate-900'
                : 'bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${
              isClean ? 'bg-blue-100 group-hover:bg-blue-200 text-blue-600' : 'bg-indigo-500/20 group-hover:bg-indigo-500/30'
            }`}>
              <MessageCircle className={`w-5 h-5 ${isClean ? 'text-blue-600' : 'text-indigo-400'}`} />
            </div>
            <div className="text-left">
              <p className={`font-bold text-sm ${isClean ? 'text-slate-900' : 'text-white'}`}>Chat with Bhaskar</p>
              <p className={`text-[10px] uppercase tracking-wider font-bold ${isClean ? 'text-slate-500' : 'text-white/40'}`}>Direct Feedback</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-6">
            <a href="#" className={`transition-colors ${isClean ? 'text-slate-400 hover:text-blue-600' : 'text-white/40 hover:text-indigo-400'}`}>
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className={`transition-colors ${isClean ? 'text-slate-400 hover:text-blue-600' : 'text-white/40 hover:text-indigo-400'}`}>
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className={`transition-colors ${isClean ? 'text-slate-400 hover:text-blue-600' : 'text-white/40 hover:text-indigo-400'}`}>
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-4 text-center md:text-right">
          <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest ${isClean ? 'text-slate-500' : 'text-white/40'}`}>
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>in India</span>
          </div>
          <p className={`text-[10px] uppercase tracking-widest font-semibold ${isClean ? 'text-slate-400' : 'text-white/30'}`}>
            © 2026 QR CRAFT • ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};
