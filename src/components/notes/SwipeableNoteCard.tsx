import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { NoteCard } from './NoteCard';
import { NotePreview } from '../../types';
import { colors } from '../../theme/colors';
import { Icon } from '../common/Icon';
import * as Haptics from 'expo-haptics';

interface SwipeableNoteCardProps {
  note: NotePreview;
  onPress: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function SwipeableNoteCard({
  note,
  onPress,
  onDelete,
  onTogglePin,
}: SwipeableNoteCardProps) {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={onDelete} style={styles.deleteAction}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Icon name="Trash2" size={24} color={colors.white} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Note Options',
      'Choose an action',
      [
        {
          text: note.isPinned ? 'Unpin Note' : 'Pin Note',
          onPress: onTogglePin,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
    >
      <NoteCard note={note} onPress={onPress} onLongPress={handleLongPress} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightActions: {
    width: 80,
    marginVertical: 4,
    marginRight: 16,
  },
  deleteAction: {
    flex: 1,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
