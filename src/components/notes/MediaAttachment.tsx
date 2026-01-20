import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Icon } from '../common/Icon';
import { Attachment } from '../../types';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

interface MediaAttachmentProps {
  attachment: Attachment;
  size?: number;
  onPress?: () => void;
  onRemove?: () => void;
  editable?: boolean;
}

export function MediaAttachment({
  attachment,
  size = 80,
  onPress,
  onRemove,
  editable = false,
}: MediaAttachmentProps) {
  const isVideo = attachment.type === 'video';

  return (
    <Pressable onPress={onPress} style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: attachment.thumbnailUri || attachment.uri }}
        style={styles.image}
        resizeMode="cover"
      />

      {isVideo && (
        <View style={styles.videoOverlay}>
          <View style={styles.playButton}>
            <Icon name="Play" size={16} color={colors.neutral[0]} />
          </View>
          {attachment.duration && (
            <View style={styles.durationBadge}>
              <Icon name="Clock" size={10} color={colors.neutral[0]} />
            </View>
          )}
        </View>
      )}

      {editable && onRemove && (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Icon name="X" size={14} color={colors.neutral[0]} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
