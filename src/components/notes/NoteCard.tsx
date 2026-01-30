import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { GlassCard } from '../common/GlassCard';
import { Icon } from '../common/Icon';
import { NotePreview } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatNoteDate } from '../../utils/date';

interface NoteCardProps {
  note: NotePreview;
  onPress: () => void;
  onLongPress?: () => void;
}

export function NoteCard({ note, onPress, onLongPress }: NoteCardProps) {
  const hasAttachments = note.attachmentCount > 0;

  return (
    <GlassCard onPress={onPress} onLongPress={onLongPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {note.title}
            </Text>
            {note.isPinned && (
              <Icon name="Pin" size={14} color={colors.primary[500]} style={styles.pinIcon} />
            )}
          </View>
          <Text style={styles.snippet} numberOfLines={2}>
            {note.snippet}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.date}>{formatNoteDate(note.updatedAt)}</Text>
            {hasAttachments && (
              <View style={styles.attachmentIndicator}>
                <Icon name="Paperclip" size={12} color={colors.neutral[400]} />
                <Text style={styles.attachmentCount}>{note.attachmentCount}</Text>
              </View>
            )}
          </View>
        </View>

        {note.thumbnailUri && (
          <Image
            source={{ uri: note.thumbnailUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  content: {
    flexDirection: 'row',
  },
  textContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.titleMedium,
    color: colors.neutral[900],
    flex: 1,
  },
  pinIcon: {
    marginLeft: spacing.xs,
  },
  snippet: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    ...typography.labelSmall,
    color: colors.neutral[400],
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  attachmentCount: {
    ...typography.labelSmall,
    color: colors.neutral[400],
    marginLeft: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral[200],
  },
});
