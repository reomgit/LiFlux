import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { GlassContainer } from '../common/GlassContainer';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: 'Plus' | 'Pencil' | 'Camera' | 'Image';
  style?: ViewStyle;
  bottom?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({
  onPress,
  icon = 'Plus',
  style,
  bottom = 100,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
    rotate.value = withSpring(90, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    rotate.value = withSpring(0, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, { bottom }, animatedStyle, style]}
    >
      <GlassContainer variant="fab" style={styles.button} borderRadiusSize="full">
        <Icon name={icon} size={28} color={colors.neutral[0]} />
      </GlassContainer>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 100,
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
