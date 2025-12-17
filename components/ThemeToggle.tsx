'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative group p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-12"
      aria-label="تبديل الثيم"
    >
      {/* Icon Container with Smooth Transition */}
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 h-6 w-6 text-white transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-6 w-6 text-white transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
    </button>
  );
}