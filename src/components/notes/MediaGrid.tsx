import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { MediaAttachment } from './MediaAttachment';
import { Attachment } from '../../types';
import { spacing } from '../../theme/spacing';

interface MediaGridProps {
  attachments: Attachment[];
  onPress?: (attachment: Attachment) => void;
  onRemove?: (attachmentId: string) => void;
  editable?: boolean;
  maxVisible?: number;
}

export function MediaGrid({
  attachments,
  onPress,
  onRemove,
  editable = false,
  maxVisible = 6,
}: MediaGridProps) {
  if (attachments.length === 0) {
    return null;
  }

  const visibleAttachments = attachments.slice(0, maxVisible);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleAttachments.map((attachment) => (
          <MediaAttachment
            key={attachment.id}
            attachment={attachment}
            onPress={() => onPress?.(attachment)}
            onRemove={editable ? () => onRemove?.(attachment.id) : undefined}
            editable={editable}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
  },
});
