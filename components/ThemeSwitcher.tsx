
import React, { useRef, useState } from 'react';
import { Theme } from '../types';
import { Monitor, Terminal, Palette, Layout, Box, Zap, Type, FileText, Square, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeConfig: Record<Theme, { icon: any; label: string; color: string; activeClass: string }> = {
  [Theme.Minimalist]: { 
    icon: Monitor, 
    label: 'Minimalist', 
    color: 'hover:bg-gray-100 text-slate-600',
    activeClass: 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
  },
  [Theme.Developer]: { 
    icon: Terminal, 
    label: 'Dev_Mode', 
    color: 'hover:bg-slate-800 hover:text-green-400 text-slate-500',
    activeClass: 'bg-[#0d1117] text-[#238636] ring-1 ring-[#30363d] shadow-inner'
  },
  [Theme.Creative]: { 
    icon: Palette, 
    label: 'Creative', 
    color: 'hover:bg-purple-50 text-purple-400',
    activeClass: 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30'
  },
  [Theme.BentoGrid]: { 
    icon: Layout, 
    label: 'Bento', 
    color: 'hover:bg-blue-50 text-blue-400',
    activeClass: 'bg-white text-blue-600 ring-1 ring-blue-100 shadow-[4px_4px_0px_0px_rgba(37,99,235,0.2)]'
  },
  [Theme.Glassmorphism]: { 
    icon: Box, 
    label: 'Glass', 
    color: 'hover:bg-pink-50 text-pink-400',
    activeClass: 'bg-gradient-to-br from-indigo-400/80 to-pink-400/80 backdrop-blur-md text-white shadow-lg'
  },
  [Theme.Cyberpunk]: { 
    icon: Zap, 
    label: 'CYBER', 
    color: 'hover:bg-black hover:text-yellow-400 text-slate-500',
    activeClass: 'bg-black text-[#00ff41] ring-1 ring-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.4)]'
  },
  [Theme.ClassicSerif]: { 
    icon: Type, 
    label: 'Serif', 
    color: 'hover:bg-stone-100 text-stone-500',
    activeClass: 'bg-[#fdfbf7] text-[#2c2c2c] ring-1 ring-stone-300 font-serif font-bold'
  },
  [Theme.ResumeFirst]: { 
    icon: FileText, 
    label: 'Resume', 
    color: 'hover:bg-slate-100 text-slate-500',
    activeClass: 'bg-white text-slate-900 border-x-2 border-slate-900 shadow-sm'
  },
  [Theme.Brutalist]: { 
    icon: Square, 
    label: 'BRUTAL', 
    color: 'hover:bg-yellow-100 text-orange-600',
    activeClass: 'bg-[#ff4800] text-white border-2 border-black shadow-[2px_2px_0px_0px_black]'
  },
  [Theme.Nature]: { 
    icon: Leaf, 
    label: 'Nature', 
    color: 'hover:bg-green-50 text-green-600',
    activeClass: 'bg-[#e9edc9] text-[#344e41] ring-1 ring-[#ccd5ae] shadow-sm'
  },
};

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative group/container">
        {/* Hide Scrollbar Style */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
        >
          {Object.entries(themeConfig).map(([themeKey, config]) => {
            const isSelected = currentTheme === themeKey;
            const Icon = config.icon;

            return (
              <motion.button
                key={themeKey}
                onClick={() => onThemeChange(themeKey as Theme)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 shrink-0
                  ${isSelected ? config.activeClass : `bg-transparent ${config.color}`}
                `}
              >
                <div className="relative z-10 flex items-center gap-1.5">
                    <Icon size={16} strokeWidth={isSelected ? 2.5 : 2} />
                    
                    <AnimatePresence mode="popLayout">
                        {isSelected && (
                            <motion.span
                                initial={{ opacity: 0, width: 0, x: -10 }}
                                animate={{ opacity: 1, width: 'auto', x: 0 }}
                                exit={{ opacity: 0, width: 0, x: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="whitespace-nowrap overflow-hidden"
                            >
                                {config.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Hover Tooltip (Only visible when NOT selected) */}
                {!isSelected && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
                            {config.label}
                        </div>
                    </div>
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Fading Edges for scroll indication on desktop */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};

export default ThemeSwitcher;
