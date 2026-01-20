import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  GlassView,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import { GlassConfig, glassConfig } from '../../theme/glass';
import { borderRadius } from '../../theme/spacing';

export type GlassVariant = keyof typeof glassConfig;

interface GlassContainerProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  config?: Partial<GlassConfig>;
  style?: StyleProp<ViewStyle>;
  borderRadiusSize?: keyof typeof borderRadius;
}

const isNativeGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

export function GlassContainer({
  children,
  variant = 'card',
  config: customConfig,
  style,
  borderRadiusSize = 'lg',
}: GlassContainerProps) {
  const config = useMemo(
    () => ({ ...glassConfig[variant], ...customConfig }),
    [variant, customConfig]
  );

  const containerStyle = useMemo<ViewStyle>(
    () => StyleSheet.flatten([
      styles.container,
      {
        borderRadius: borderRadius[borderRadiusSize],
        borderColor: config.borderColor,
        borderWidth: config.borderWidth,
        overflow: 'hidden' as const,
      },
      style,
    ]),
    [config.borderColor, config.borderWidth, borderRadiusSize, style]
  );

  // Use native Liquid Glass on iOS 26+
  if (isNativeGlassAvailable) {
    return (
      <GlassView
        glassEffectStyle={config.glassEffectStyle}
        isInteractive={config.isInteractive}
        style={containerStyle}
      >
        {children}
      </GlassView>
    );
  }

  // Fallback to BlurView for Android and older iOS
  return (
    <View style={containerStyle}>
      <BlurView
        intensity={config.intensity}
        tint={config.tint}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: config.backgroundColor },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
