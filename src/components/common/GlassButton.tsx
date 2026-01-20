import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassContainer, GlassVariant } from './GlassContainer';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface GlassButtonProps {
  onPress: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: GlassVariant;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassButton({
  onPress,
  label,
  icon,
  variant = 'button',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  hapticFeedback = true,
}: GlassButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeStyles = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, disabled && styles.disabled]}
    >
      <GlassContainer
        variant={variant}
        style={[styles.button, sizeStyles[size], style]}
        borderRadiusSize="lg"
      >
        {icon}
        {label && (
          <Text
            style={[
              styles.text,
              textSizeStyles[size],
              icon ? styles.textWithIcon : undefined,
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </GlassContainer>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 32,
  },
  sizeMd: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  sizeLg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  text: {
    ...typography.labelLarge,
    color: colors.neutral[900],
  },
  textSm: {
    ...typography.labelSmall,
  },
  textMd: {
    ...typography.labelMedium,
  },
  textLg: {
    ...typography.labelLarge,
  },
  textWithIcon: {
    marginLeft: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});
