import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Screen } from '../src/components/layout/Screen';
import { GlassButton } from '../src/components/common/GlassButton';
import { Icon } from '../src/components/common/Icon';
import { MediaGrid } from '../src/components/notes/MediaGrid';
import { useNotes } from '../src/hooks/useNotes';
import { useMediaPicker } from '../src/hooks/useMediaPicker';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing } from '../src/theme/spacing';
import type { Attachment } from '../src/types';

export default function CreateNoteScreen() {
  const router = useRouter();
  const { createNote } = useNotes();
  const { pickImage, pickVideo } = useMediaPicker();

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const canSave = content.trim().length > 0 || attachments.length > 0;

  const handleSave = useCallback(async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    try {
      await createNote({
        content: content.trim(),
        attachments,
        isTrashed: false,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Failed to create note:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  }, [content, attachments, canSave, isSaving, createNote, router]);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleAddImage = async () => {
    const result = await pickImage();
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  };

  const handleAddVideo = async () => {
    const result = await pickVideo();
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  return (
    <Screen edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Icon name="X" size={24} color={colors.neutral[600]} />
          </Pressable>
          <Text style={styles.headerTitle}>New Note</Text>
          <GlassButton
            onPress={handleSave}
            variant="button"
            size="sm"
            disabled={!canSave || isSaving}
            label={isSaving ? 'Saving...' : 'Save'}
          />
        </View>

        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.neutral[400]}
            multiline
            textAlignVertical="top"
            autoFocus
          />

          {attachments.length > 0 && (
            <MediaGrid
              attachments={attachments}
              onRemove={handleRemoveAttachment}
              editable
            />
          )}
        </View>

        <View style={styles.toolbar}>
          <Pressable onPress={handleAddImage} style={styles.toolbarButton}>
            <Icon name="Image" size={24} color={colors.neutral[600]} />
            <Text style={styles.toolbarLabel}>Photo</Text>
          </Pressable>
          <Pressable onPress={handleAddVideo} style={styles.toolbarButton}>
            <Icon name="Video" size={24} color={colors.neutral[600]} />
            <Text style={styles.toolbarLabel}>Video</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.titleMedium,
    color: colors.neutral[900],
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  textInput: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    minHeight: 150,
    marginBottom: spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.xl,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  toolbarLabel: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
});
