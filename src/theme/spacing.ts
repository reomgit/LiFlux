export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
