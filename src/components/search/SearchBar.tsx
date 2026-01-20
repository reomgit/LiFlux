import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  GlassView,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { glassConfig } from '../../theme/glass';

const isNativeGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
}: SearchBarProps) {
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);

  const config = glassConfig.searchBar;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    scale.value = withSpring(1.02, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handleClear = useCallback(() => {
    onChangeText('');
    Keyboard.dismiss();
  }, [onChangeText]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderBackground = () => {
    if (isNativeGlassAvailable) {
      return (
        <GlassView
          glassEffectStyle={config.glassEffectStyle}
          isInteractive={config.isInteractive}
          style={StyleSheet.absoluteFill}
        />
      );
    }

    return (
      <>
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
      </>
    );
  };

  // Position above tab bar (56px) + some padding
  const bottomPosition = 56 + insets.bottom + spacing.sm;

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: bottomPosition },
        animatedStyle,
      ]}
    >
      <View style={styles.wrapper}>
        {renderBackground()}
        <View style={styles.content}>
          <Icon
            name="Search"
            size={18}
            color={isFocused ? colors.primary[600] : colors.neutral[400]}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.neutral[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {value.length > 0 && (
            <AnimatedPressable onPress={handleClear} style={styles.clearButton}>
              <Icon name="X" size={16} color={colors.neutral[500]} />
            </AnimatedPressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 50,
  },
  wrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[900],
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
