import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TowerIndicatorProps {
  isActive: boolean;
}

export const TowerIndicator: React.FC<TowerIndicatorProps> = ({ isActive }) => {
  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      {/* Tower Base */}
      <div className={`relative z-10 transition-colors duration-500 ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 2L8 22" />
          <path d="M12 2L16 22" />
          <path d="M9 15h6" />
          <path d="M10 9h4" />
          <circle cx="12" cy="2" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Rays Animation */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 2.2], 
                  opacity: [0, 0.8, 0] 
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeOut",
                }}
                className="absolute w-4 h-4 rounded-full border border-emerald-400/40"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Static Glow when off */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-4 h-4 rounded-full bg-red-500/20 blur-sm" 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
