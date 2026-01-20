export * from './colors';
export * from './typography';
export * from './spacing';
export * from './glass';

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { glassConfig, glassConfigDark } from './glass';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  glass: glassConfig,
  glassDark: glassConfigDark,
} as const;

export type Theme = typeof theme;
