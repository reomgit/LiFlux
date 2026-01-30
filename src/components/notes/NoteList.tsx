import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
// import Animated from 'react-native-reanimated';
import { SwipeableNoteCard } from './SwipeableNoteCard';
import { Icon } from '../common/Icon';
import { Note, NotePreview } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface NoteListProps {
  notes: Note[];
  onNotePress: (noteId: string) => void;
  onDeleteNote?: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
  // onScroll?: (event: any) => void; // Removed Animated scroll handler type
  onScroll?: any;
  isLoading?: boolean;
  emptyMessage?: string;
  onRefresh?: () => void;
}

export function NoteList({
  notes,
  onNotePress,
  onDeleteNote,
  onTogglePin,
  onScroll,
  isLoading = false,
  emptyMessage = 'No notes yet',
  onRefresh,
}: NoteListProps) {
  const toPreview = useCallback((note: Note): NotePreview => {
    const lines = note.content.split('\n').filter((line) => line.trim());
    const title = note.title || lines[0]?.substring(0, 50) || 'Untitled';
    const snippet = note.content.substring(0, 100);

    return {
      id: note.id,
      title,
      snippet,
      thumbnailUri: note.attachments[0]?.thumbnailUri || note.attachments[0]?.uri,
      attachmentCount: note.attachments.length,
      updatedAt: note.updatedAt,
      isPinned: note.isPinned,
    };
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Note }) => {
      const preview = toPreview(item);
      return (
        <SwipeableNoteCard
          note={preview}
          onPress={() => onNotePress(item.id)}
          onDelete={() => onDeleteNote?.(item.id)}
          onTogglePin={() => onTogglePin?.(item.id)}
        />
      );
    },
    [onNotePress, onDeleteNote, onTogglePin, toPreview]
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  if (isLoading && notes.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View style={styles.centered}>
        <Icon name="FileText" size={48} color={colors.neutral[300]} />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>
          Tap the + button to create a note
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary[600]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.titleMedium,
    color: colors.neutral[500],
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.bodyMedium,
    color: colors.neutral[400],
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
