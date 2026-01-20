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
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const hasAttachments = note.attachmentCount > 0;

  return (
    <GlassCard onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
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
  title: {
    ...typography.titleMedium,
    color: colors.neutral[900],
    marginBottom: spacing.xs,
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
