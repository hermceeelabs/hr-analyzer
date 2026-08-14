'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Preset accent palettes ──────────────────────────────────────────────────
export const ACCENT_PRESETS = [
  { name: 'Ocean Blue',    hex: '#0062d6' },
  { name: 'Indigo',        hex: '#4f46e5' },
  { name: 'Violet',        hex: '#7c3aed' },
  { name: 'Rose',          hex: '#e11d48' },
  { name: 'Amber',         hex: '#d97706' },
  { name: 'Emerald',       hex: '#059669' },
  { name: 'Teal',          hex: '#0d9488' },
  { name: 'Sky',           hex: '#0284c7' },
  { name: 'Fuchsia',       hex: '#c026d3' },
  { name: 'Slate',         hex: '#475569' },
];

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
  accentHex: string;
  setAccentHex: (hex: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Compute a lightened version for backgrounds */
function hexToLightVariant(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.88);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}
function hexToDarkVariant(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const darken = (c: number) => Math.round(c * 0.72);
  return `rgb(${darken(r)},${darken(g)},${darken(b)})`;
}

function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty('--accent',       hex);
  root.style.setProperty('--accent-light', hexToLightVariant(hex));
  root.style.setProperty('--accent-dark',  hexToDarkVariant(hex));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark]       = useState(false);
  const [accentHex, setAccentHexState] = useState(ACCENT_PRESETS[0].hex);

  // ── Bootstrap from localStorage ────────────────────────────────
  useEffect(() => {
    const savedDark   = localStorage.getItem('hr-dark') === 'true';
    const savedAccent = localStorage.getItem('hr-accent') ?? ACCENT_PRESETS[0].hex;
    setIsDark(savedDark);
    setAccentHexState(savedAccent);
    document.documentElement.classList.toggle('dark', savedDark);
    applyAccent(savedAccent);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('hr-dark', String(next));
      return next;
    });
  }, []);

  const setAccentHex = useCallback((hex: string) => {
    setAccentHexState(hex);
    applyAccent(hex);
    localStorage.setItem('hr-accent', hex);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark, accentHex, setAccentHex }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
