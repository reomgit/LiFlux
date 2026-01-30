import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
  Home,
  Settings,
  Plus,
  Search,
  ArrowLeft,
  X,
  Menu,
  MoreHorizontal,
  Pencil,
  Camera,
  Image,
  Video,
  FileText,
  Paperclip,
  Clock,
  Play,
  Cloud,
  Circle,
  Type,
  Bold,
  Italic,
  Heading,
  List,
  Pin,
  Trash2,
  LucideIcon,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';

const iconMap: Record<string, LucideIcon> = {
  Home,
  Settings,
  Plus,
  Search,
  ArrowLeft,
  X,
  Menu,
  MoreHorizontal,
  Pencil,
  Camera,
  Image,
  Video,
  FileText,
  Paperclip,
  Clock,
  Play,
  Cloud,
  Circle,
  Type,
  Bold,
  Italic,
  Heading,
  List,
  Pin,
  Trash2,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
}

export function Icon({
  name,
  size = 24,
  color = colors.neutral[900],
  strokeWidth = 2,
  style,
}: IconProps) {
  const LucideIconComponent = iconMap[name];

  if (!LucideIconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <LucideIconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { iconMap as icons };
