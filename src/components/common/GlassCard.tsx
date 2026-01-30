import React from 'react';
import { Pressable, StyleSheet, ViewStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';
import { GlassContainer, GlassVariant } from './GlassContainer';
import { spacing } from '../../theme/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  variant?: GlassVariant;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  hapticFeedback?: boolean;
}

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  children,
  onPress,
  onLongPress,
  variant = 'card',
  style,
  contentStyle,
  hapticFeedback = true,
}: GlassCardProps) {
  // const scale = useSharedValue(1);

  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: scale.value }],
  // }));

  const handlePressIn = () => {
    if (onPress) {
      // scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      // scale.value = withSpring(1, { damping: 15, stiffness: 400 });
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
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </GlassContainer>
  );

  if (onPress || onLongPress) {
    return (
      <Pressable
        onPress={handlePress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          // animatedStyle
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        {content}
      </Pressable>
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
