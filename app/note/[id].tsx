import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../src/components/layout/Screen';
import { GlassButton } from '../../src/components/common/GlassButton';
import { Icon } from '../../src/components/common/Icon';
import { MediaGrid } from '../../src/components/notes/MediaGrid';
import { useNotes } from '../../src/hooks/useNotes';
import { useMediaPicker } from '../../src/hooks/useMediaPicker';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';
import type { Note, Attachment } from '../../src/types';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getNoteById, updateNote, deleteNote } = useNotes();
  const { pickImage, pickVideo } = useMediaPicker();

  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    if (!id) return;
    setIsLoading(true);
    const fetchedNote = await getNoteById(id);
    if (fetchedNote) {
      setNote(fetchedNote);
      setContent(fetchedNote.content);
      setAttachments(fetchedNote.attachments);
    }
    setIsLoading(false);
  };

  const handleSave = useCallback(async () => {
    if (!note || !hasChanges) return;
    await updateNote(note.id, { content, attachments });
    setHasChanges(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [note, content, attachments, hasChanges, updateNote]);

  const handleDelete = useCallback(() => {
    if (!note) return;
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
      },
    ]);
  }, [note, deleteNote, router]);

  const handleContentChange = (text: string) => {
    setContent(text);
    setHasChanges(true);
  };

  const handleAddImage = async () => {
    const result = await pickImage();
    if (result) {
      setAttachments((prev) => [...prev, result]);
      setHasChanges(true);
    }
  };

  const handleAddVideo = async () => {
    const result = await pickVideo();
    if (result) {
      setAttachments((prev) => [...prev, result]);
      setHasChanges(true);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    setHasChanges(true);
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert('Unsaved Changes', 'Do you want to save your changes?', [
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.back(),
        },
        {
          text: 'Save',
          onPress: async () => {
            await handleSave();
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  };

  if (isLoading || !note) {
    return (
      <Screen edges={['top']}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Icon name="ArrowLeft" size={24} color={colors.neutral[900]} />
        </Pressable>
        <View style={styles.headerActions}>
          {hasChanges && (
            <GlassButton
              onPress={handleSave}
              variant="button"
              size="sm"
              style={styles.saveButton}
              label="Save"
            />
          )}
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="X" size={20} color={colors.error} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        <TextInput
          style={styles.textInput}
          value={content}
          onChangeText={handleContentChange}
          placeholder="Write your note..."
          placeholderTextColor={colors.neutral[400]}
          multiline
          textAlignVertical="top"
          autoFocus={false}
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
        <Pressable onPress={handleAddImage} style={styles.toolbarButton}>
          <Icon name="Image" size={24} color={colors.neutral[600]} />
        </Pressable>
        <Pressable onPress={handleAddVideo} style={styles.toolbarButton}>
          <Icon name="Video" size={24} color={colors.neutral[600]} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  saveButton: {
    minWidth: 60,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.neutral[500],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  textInput: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    minHeight: 200,
    marginBottom: spacing.lg,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing.lg,
  },
  toolbarButton: {
    padding: spacing.sm,
  },
});
