import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassContainer } from '../common/GlassContainer';
import { GlassButton } from '../common/GlassButton';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: 'ArrowLeft' | 'X' | 'Menu';
    onPress: () => void;
  };
  rightAction?: {
    icon: 'Plus' | 'Settings' | 'Search' | 'MoreHorizontal';
    onPress: () => void;
  };
  style?: ViewStyle;
  transparent?: boolean;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
  transparent = false,
}: HeaderProps) {
  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {leftAction && (
          <GlassButton
            onPress={leftAction.onPress}
            icon={<Icon name={leftAction.icon} size={20} />}
            size="sm"
            style={styles.actionButton}
          />
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction && (
          <GlassButton
            onPress={rightAction.onPress}
            icon={<Icon name={rightAction.icon} size={20} />}
            size="sm"
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );

  if (transparent) {
    return content;
  }

  return (
    <GlassContainer variant="navigation" style={styles.glassWrapper}>
      {content}
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  glassWrapper: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  title: {
    ...typography.titleMedium,
    color: colors.neutral[900],
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    marginTop: 2,
  },
  actionButton: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
});
