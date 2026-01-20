import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import {
  GlassView,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, icons } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { glassConfig } from '../../theme/glass';

const isNativeGlassAvailable = Platform.OS === 'ios' && isLiquidGlassAvailable();

// Simplified interface removing Reanimated SharedValue
interface TabBarProps extends BottomTabBarProps {
  // scrollY?: SharedValue<number>; // Removed
}

const TAB_ICONS: Record<string, keyof typeof icons> = {
  index: 'Home',
  settings: 'Settings',
};

// Removed scrollY from destructuring
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const config = glassConfig.navigation;

  const renderBackground = () => {
    if (isNativeGlassAvailable) {
      return (
        <GlassView
          glassEffectStyle={config.glassEffectStyle}
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

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, height: 56 + insets.bottom },
      ]}
    >
      {renderBackground()}
      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;
          const iconName = TAB_ICONS[route.name] || 'Circle';

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <Icon
                name={iconName}
                size={24}
                color={isFocused ? colors.primary[600] : colors.neutral[400]}
              />
              <View style={{ opacity: 1, height: 16 }}>
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.primary[600] : colors.neutral[400] },
                  ]}
                  numberOfLines={1}
                >
                  {typeof label === 'string' ? label : route.name}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    ...typography.labelSmall,
    marginTop: 2,
  },
});
