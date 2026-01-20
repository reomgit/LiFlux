import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export function Screen({
  children,
  style,
  edges = ['top'],
  backgroundColor = colors.neutral[50],
}: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor }, style]}
    >
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
