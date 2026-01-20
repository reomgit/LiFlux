import React, { useCallback, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/layout/Screen';
import { Header } from '../components/layout/Header';
import { MediaGrid } from '../components/notes/MediaGrid';
import { GlassButton } from '../components/common/GlassButton';
import { Icon } from '../components/common/Icon';
import { useNotes } from '../hooks/useNotes';
import { useMediaPicker } from '../hooks/useMediaPicker';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { Attachment } from '../types';

export function CreateNoteScreen() {
  const navigation = useNavigation();
  const { createNote } = useNotes();
  const { pickImage, pickVideo } = useMediaPicker();

  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!content.trim() && attachments.length === 0) {
      navigation.goBack();
      return;
    }

    setIsSaving(true);
    try {
      await createNote({
        content: content.trim(),
        attachments,
        isTrashed: false,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsSaving(false);
    }
  }, [content, attachments, createNote, navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddImage = useCallback(async () => {
    const result = await pickImage();
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  }, [pickImage]);

  const handleAddVideo = useCallback(async () => {
    const result = await pickVideo();
    if (result) {
      setAttachments((prev) => [...prev, result]);
    }
  }, [pickVideo]);

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, []);

  const hasContent = content.trim().length > 0 || attachments.length > 0;

  return (
    <Screen edges={['top', 'bottom']}>
      <Header
        title="New Note"
        leftAction={{ icon: 'X', onPress: handleCancel }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={setContent}
          placeholder="Start writing..."
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
      </ScrollView>

      <View style={styles.toolbar}>
        <View style={styles.mediaButtons}>
          <GlassButton
            onPress={handleAddImage}
            icon={<Icon name="Image" size={20} />}
            size="sm"
          />
          <GlassButton
            onPress={handleAddVideo}
            icon={<Icon name="Video" size={20} />}
            size="sm"
          />
        </View>

        <GlassButton
          onPress={handleSave}
          label={isSaving ? 'Saving...' : 'Save'}
          size="md"
          disabled={!hasContent || isSaving}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  input: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    minHeight: 200,
    textAlignVertical: 'top',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
