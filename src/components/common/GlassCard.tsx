import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassContainer, GlassVariant } from './GlassContainer';
import { spacing } from '../../theme/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: GlassVariant;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  hapticFeedback?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  onPress,
  variant = 'card',
  style,
  contentStyle,
  hapticFeedback = true,
}: GlassCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const content = (
    <GlassContainer variant={variant} style={[styles.card, style]}>
      <Animated.View style={[styles.content, contentStyle]}>
        {children}
      </Animated.View>
    </GlassContainer>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={animatedStyle}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  content: {
    padding: spacing.md,
  },
});
