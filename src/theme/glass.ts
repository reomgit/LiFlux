import { Platform } from 'react-native';

export type GlassStyle = 'clear' | 'regular';
export type GlassTint = 'light' | 'dark' | 'default';

export interface GlassConfig {
  // For expo-glass-effect (iOS 26+)
  glassEffectStyle: GlassStyle;
  isInteractive: boolean;
  // For expo-blur fallback
  intensity: number;
  tint: GlassTint;
  // Shared styling
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

export const glassConfig = {
  // Card backgrounds (note cards, list items)
  card: {
    glassEffectStyle: 'regular',
    isInteractive: false,
    intensity: 60,
    tint: 'light',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  } as GlassConfig,

  // Navigation elements (tab bar, headers)
  navigation: {
    glassEffectStyle: 'regular',
    isInteractive: false,
    intensity: 80,
    tint: 'default',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 0.5,
  } as GlassConfig,

  // Buttons
  button: {
    glassEffectStyle: 'clear',
    isInteractive: true,
    intensity: 40,
    tint: 'light',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
  } as GlassConfig,

  // Search bar
  searchBar: {
    glassEffectStyle: 'regular',
    isInteractive: true,
    intensity: 70,
    tint: 'light',
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  } as GlassConfig,

  // Floating action button
  fab: {
    glassEffectStyle: 'regular',
    isInteractive: true,
    intensity: 50,
    tint: 'light',
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  } as GlassConfig,

  // Modal/sheet backgrounds
  modal: {
    glassEffectStyle: 'regular',
    isInteractive: false,
    intensity: 90,
    tint: 'light',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 0,
  } as GlassConfig,
} as const;

// Dark mode variants
export const glassConfigDark = {
  card: {
    ...glassConfig.card,
    tint: 'dark',
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as GlassConfig,

  navigation: {
    ...glassConfig.navigation,
    tint: 'dark',
    backgroundColor: 'rgba(20, 20, 20, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as GlassConfig,

  button: {
    ...glassConfig.button,
    tint: 'dark',
    backgroundColor: 'rgba(50, 50, 50, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  } as GlassConfig,

  searchBar: {
    ...glassConfig.searchBar,
    tint: 'dark',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as GlassConfig,

  fab: {
    ...glassConfig.fab,
    backgroundColor: 'rgba(99, 102, 241, 0.9)',
  } as GlassConfig,

  modal: {
    ...glassConfig.modal,
    tint: 'dark',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  } as GlassConfig,
} as const;

export type GlassConfigType = typeof glassConfig;
