import React from 'react';
import { Heart, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const email = "ba4462286@gmail.com";
  const subject = encodeURIComponent("Feedback/Issue - QR Craft");
  const mailtoLink = `mailto:${email}?subject=${subject}`;

  return (
    <footer className="mt-12 py-12 border-t border-white/10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className="text-white/60 text-sm font-medium">
            I'm <span className="text-white font-bold">Bhaskar</span>, I have created this.
          </p>
          <p className="text-white/40 text-xs">
            Crafting digital experiences with precision and passion.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <a 
            href={mailtoLink}
            className="group flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="bg-indigo-500/20 p-2 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Chat with Bhaskar</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Direct Feedback</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-white/40 hover:text-indigo-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-indigo-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/40 hover:text-indigo-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex items-center space-x-2 text-white/40 text-xs font-bold uppercase tracking-widest">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
            <span>in India</span>
          </div>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">
            © 2026 QR CRAFT • ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};
