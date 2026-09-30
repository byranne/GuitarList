// Placeholder dark palette. Change values here and in tokens.css (Tailwind reads
// the CSS; this file serves non-CSS consumers like the PWA manifest), not in components.
export const colors = {
  background: '#0B0B0F',
  surface: '#16161D',
  border: '#26262F',
  text: '#F5F5F7',
  muted: '#8E8E9A',
  accent: '#FF5A36',
  'on-accent': '#FFFFFF',
  danger: '#FF4D5E',
} as const;

export type ColorToken = keyof typeof colors;
