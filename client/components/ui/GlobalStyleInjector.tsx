
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { THEMES } from '../../utils/themeDefinitions';

export const GlobalStyleInjector: React.FC = () => {
  const { currentTheme, isDarkMode } = useTheme();
  
  const activeTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  // Determine which palette to use
  // 1. If the theme is inherently dark (isDark: true), use its base colors (or dark if defined).
  // 2. If it's a dynamic theme (like Default), check isDarkMode from context.
  //    If dark mode is ON and colorsDark exists, use colorsDark.
  //    Otherwise use base colors.
  const useDarkPalette = activeTheme.isDark || (isDarkMode && !!activeTheme.colorsDark);
  
  const colors = useDarkPalette && activeTheme.colorsDark 
    ? activeTheme.colorsDark 
    : activeTheme.colors;

  // Animation CSS
  const transitionCSS = activeTheme.animation?.type === 'smooth' 
    ? `transition: background-color 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);`
    : `transition: background-color 0.3s ease, color 0.3s ease;`;

  const styles = `
    :root {
      --theme-primary: ${colors.primary};
      --theme-secondary: ${colors.secondary};
      --theme-bg: ${colors.background};
      --theme-surface: ${colors.surface};
      --theme-text: ${colors.text};
      --theme-muted: ${colors.muted};
      --theme-border: ${colors.border};
    }

    /* --- BASE FORCE OVERRIDES --- */
    body {
      background-color: var(--theme-bg) !important;
      color: var(--theme-text) !important;
      ${transitionCSS}
      ${activeTheme.assets?.overlayPattern && activeTheme.assets.overlayPattern.startsWith('linear') 
        ? `background-image: ${activeTheme.assets.overlayPattern} !important; background-attachment: fixed;` 
        : ''}
    }

    /* --- COLOR UTILITY INTERCEPTION --- */
    
    /* Backgrounds - Intercept common white/black classes to force theme surface */
    .bg-white, .bg-gray-50, .bg-gray-100, .dark .bg-black, .dark .bg-gray-900, .dark .bg-[#121212], .dark .bg-[#0a0a0a] { 
        background-color: var(--theme-surface) !important; 
        color: var(--theme-text) !important;
        border-color: var(--theme-border) !important;
    }
    
    /* Brand Colors */
    .bg-purple-600, .bg-blue-600, .bg-indigo-600, .bg-red-600, .bg-green-600, .bg-amber-600 {
        background-color: var(--theme-primary) !important;
        color: ${useDarkPalette ? '#000' : '#fff'} !important;
    }

    /* Text Colors */
    .text-gray-900, .text-gray-800, .dark .text-white, .text-black { color: var(--theme-text) !important; }
    .text-gray-500, .text-gray-600, .text-gray-400, .dark .text-gray-300, .dark .text-gray-400 { color: var(--theme-muted) !important; }
    .text-purple-600, .text-blue-600, .text-indigo-600, .text-pink-600 { color: var(--theme-primary) !important; }

    /* Borders */
    .border-gray-200, .border-gray-100, .border-gray-300, .dark .border-white\\/5, .dark .border-white\\/10, .dark .border-white\\/20 { 
        border-color: var(--theme-border) !important; 
    }

    /* --- SPECIAL THEME: NEW YEAR (Party Vibes) --- */
    ${activeTheme.id === 'newyear' ? `
       h1, h2, h3 { 
         text-shadow: 2px 2px 0px rgba(0,0,0,0.1); 
         letter-spacing: 0.02em;
       }
       /* Glassy Cards for New Year */
       .bg-white, .bg-gray-50, .dark .bg-black {
          background-color: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
       }
       input, select, textarea {
          background-color: rgba(255,255,255,0.2) !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.4) !important;
          placeholder-color: rgba(255,255,255,0.7) !important;
       }
    ` : ''}

    /* --- SPECIAL THEME: FRAMER DARK (Ultra Premium) --- */
    ${activeTheme.id === 'framer-dark' ? `
       * { letter-spacing: -0.015em; }
       .bg-white, .bg-gray-50 {
          background-color: #111111 !important;
          border: 1px solid #222 !important;
       }
       input, select, textarea {
          background-color: #0a0a0a !important;
          border-color: #333 !important;
          color: #fff !important;
       }
       button.bg-gradient-to-r {
          box-shadow: 0 0 20px -5px var(--theme-secondary) !important;
       }
    ` : ''}

    /* --- ASSET OVERLAYS --- */
    ${activeTheme.assets?.overlayPattern && !activeTheme.assets.overlayPattern.startsWith('linear') ? `
       body::before {
         content: "";
         position: fixed;
         top: 0; left: 0; width: 100%; height: 100%;
         background-image: url('${activeTheme.assets.overlayPattern}');
         opacity: 0.05;
         pointer-events: none;
         z-index: 9999;
         mix-blend-mode: overlay;
       }
    ` : ''}

    /* --- ANIMATION CURVES --- */
    ${activeTheme.animation?.type === 'bouncy' ? `
       * { transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
    ` : ''}
    ${activeTheme.animation?.type === 'smooth' ? `
       * { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important; }
    ` : ''}
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: styles }} />
  );
};
