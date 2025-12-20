
export type ThemeId = 
  | 'default' 
  | 'newyear' | 'pongal' | 'christmas' | 'ramzan' | 'diwali' | 'independence' | 'republic' | 'krishna' | 'vinayagar' | 'dhasara'
  | 'gradient-ocean' | 'gradient-sunset' | 'gradient-forest' | 'gradient-berry'
  | 'framer-dark' | 'framer-glass';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  category: 'Default' | 'Festival' | 'Abstract' | 'Modern';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
  // New: Optional specific dark mode override for this theme
  colorsDark?: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
  assets?: {
    overlayPattern?: string; 
    cursor?: string;
  };
  animation?: {
    type: 'standard' | 'bouncy' | 'smooth'; 
  };
  isDark?: boolean; // Forces dark mode variables (Legacy for single-mode themes)
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'default',
    name: 'Divine Default',
    category: 'Default',
    colors: { 
      primary: '#9333ea', 
      secondary: '#db2777', 
      background: '#f8f9fa', 
      surface: '#ffffff', 
      text: '#111827',
      muted: '#6b7280',
      border: '#e5e7eb'
    },
    // Added: Premium Dark Mode Palette
    colorsDark: {
      primary: '#a855f7', // Lighter purple for dark bg
      secondary: '#f472b6', 
      background: '#020617', // Deep Slate/Black
      surface: '#0f172a', // Slate 900
      text: '#f8fafc', // Slate 50
      muted: '#94a3b8', // Slate 400
      border: '#1e293b' // Slate 800
    }
  },
  // --- MODERN FRAMER STYLES ---
  {
    id: 'framer-dark',
    name: 'Framer Midnight',
    category: 'Modern',
    isDark: true,
    colors: { 
      primary: '#ffffff', 
      secondary: '#7c3aed', 
      background: '#050505', 
      surface: '#111111', 
      text: '#ffffff', 
      muted: '#a1a1aa',
      border: '#27272a'
    },
    animation: { type: 'smooth' }
  },
  {
    id: 'framer-glass',
    name: 'Framer Glass',
    category: 'Modern',
    isDark: false,
    colors: { 
      primary: '#2563eb', 
      secondary: '#f472b6', 
      background: '#e0e7ff', 
      surface: 'rgba(255, 255, 255, 0.65)', 
      text: '#1e1b4b',
      muted: '#64748b',
      border: 'rgba(255, 255, 255, 0.5)'
    },
    assets: { 
      overlayPattern: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)' 
    },
    animation: { type: 'bouncy' }
  },
  // --- FESTIVALS ---
  {
    id: 'newyear',
    name: 'New Year Party',
    category: 'Festival',
    isDark: true,
    colors: { 
       primary: '#FBBF24', 
       secondary: '#F472B6', 
       background: '#BE185D', 
       surface: 'rgba(255, 255, 255, 0.1)', 
       text: '#ffffff', 
       muted: '#FCE7F3', 
       border: 'rgba(255, 255, 255, 0.2)' 
    },
    assets: {
       overlayPattern: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)' 
    },
    animation: { type: 'bouncy' }
  },
  {
    id: 'christmas',
    name: 'Merry Christmas',
    category: 'Festival',
    colors: { primary: '#dc2626', secondary: '#15803d', background: '#fef2f2', surface: '#ffffff', text: '#0f172a', muted: '#64748b', border: '#fee2e2' },
    assets: { overlayPattern: 'https://www.transparenttextures.com/patterns/snow.png' }
  },
  {
    id: 'pongal',
    name: 'Pongal Harvest',
    category: 'Festival',
    colors: { primary: '#d97706', secondary: '#16a34a', background: '#fffbeb', surface: '#ffffff', text: '#451a03', muted: '#92400e', border: '#fcd34d' },
    assets: { overlayPattern: 'https://www.transparenttextures.com/patterns/cubes.png' }
  },
  {
    id: 'ramzan',
    name: 'Ramzan Eid',
    category: 'Festival',
    colors: { primary: '#059669', secondary: '#f59e0b', background: '#ecfdf5', surface: '#ffffff', text: '#064e3b', muted: '#047857', border: '#6ee7b7' },
    assets: { overlayPattern: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent)' }
  },
  {
    id: 'diwali',
    name: 'Deepavali',
    category: 'Festival',
    isDark: true,
    colors: { primary: '#f59e0b', secondary: '#b91c1c', background: '#2a0a0a', surface: '#1a1a1a', text: '#fef3c7', muted: '#b45309', border: '#78350f' },
    assets: { overlayPattern: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 1px, transparent 1px)' } 
  },
  {
    id: 'vinayagar',
    name: 'Vinayagar Chaturthi',
    category: 'Festival',
    colors: { primary: '#ea580c', secondary: '#fbbf24', background: '#fff7ed', surface: '#ffffff', text: '#431407', muted: '#9a3412', border: '#fdba74' }
  },
  {
    id: 'krishna',
    name: 'Krishna Jayanthi',
    category: 'Festival',
    colors: { primary: '#0ea5e9', secondary: '#facc15', background: '#f0f9ff', surface: '#ffffff', text: '#0c4a6e', muted: '#0369a1', border: '#7dd3fc' }
  },
  {
    id: 'dhasara',
    name: 'Dhasara Gold',
    category: 'Festival',
    colors: { primary: '#ca8a04', secondary: '#be123c', background: '#fafaf9', surface: '#ffffff', text: '#44403c', muted: '#a16207', border: '#fde047' }
  },
  {
    id: 'independence',
    name: 'Independence Day',
    category: 'Festival',
    colors: { primary: '#0ea5e9', secondary: '#f97316', background: '#f8fafc', surface: '#ffffff', text: '#1e293b', muted: '#64748b', border: '#e2e8f0' }
  },
  {
    id: 'republic',
    name: 'Republic Day',
    category: 'Festival',
    colors: { primary: '#e11d48', secondary: '#0284c7', background: '#fff1f2', surface: '#ffffff', text: '#1e293b', muted: '#881337', border: '#fecdd3' }
  },
  // --- ABSTRACT ---
  {
    id: 'gradient-ocean',
    name: 'Oceanic Depth',
    category: 'Abstract',
    colors: { primary: '#0891b2', secondary: '#3b82f6', background: '#ecfeff', surface: '#ffffff', text: '#164e63', muted: '#155e75', border: '#a5f3fc' }
  },
  {
    id: 'gradient-berry',
    name: 'Berry Blast',
    category: 'Abstract',
    colors: { primary: '#c026d3', secondary: '#db2777', background: '#fdf4ff', surface: '#ffffff', text: '#4a044e', muted: '#86198f', border: '#f0abfc' }
  },
  {
    id: 'gradient-forest',
    name: 'Deep Forest',
    category: 'Abstract',
    colors: { primary: '#15803d', secondary: '#a3e635', background: '#f0fdf4', surface: '#ffffff', text: '#14532d', muted: '#166534', border: '#bbf7d0' }
  },
];
