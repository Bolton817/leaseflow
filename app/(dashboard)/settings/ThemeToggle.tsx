'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return <div className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0B101A] ${
        isDark ? 'bg-amber-500' : 'bg-slate-300'
      }`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-amber-500" />
        ) : (
          <Sun className="h-3 w-3 text-slate-400" />
        )}
      </span>
    </button>
  );
}
