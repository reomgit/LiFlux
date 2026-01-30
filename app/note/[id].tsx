import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showFormatting, setShowFormatting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    if (!id) return;
    setIsLoading(true);
    const fetchedNote = await getNoteById(id);
    if (fetchedNote) {
      console.log(`[Detail] Loaded note ${id}:`, JSON.stringify(fetchedNote));
      setNote(fetchedNote);
      setTitle(fetchedNote.title || '');
      setContent(fetchedNote.content);
      setAttachments(fetchedNote.attachments);
    }
    setIsLoading(false);
  };

  const handleSave = useCallback(async () => {
    if (!note || !hasChanges) return;
    await updateNote(note.id, { title, content, attachments });
    setHasChanges(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [note, title, content, attachments, hasChanges, updateNote]);

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

  const handleTitleChange = (text: string) => {
    setTitle(text);
    setHasChanges(true);
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const start = selection.start;
    const end = selection.end;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            placeholder="Title"
            placeholderTextColor={colors.neutral[400]}
            multiline
            maxLength={100}
          />
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={content}
              onChangeText={handleContentChange}
              onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
              onBlur={() => setIsEditing(false)}
              placeholder="Write your note..."
              placeholderTextColor={colors.neutral[400]}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          ) : (
            <Pressable onPress={() => setIsEditing(true)} style={{ minHeight: 200 }}>
              <Markdown style={markdownStyles}>
                {content || 'Write your note...'}
              </Markdown>
            </Pressable>
          )}

          {attachments.length > 0 && (
            <MediaGrid
              attachments={attachments}
              onRemove={handleRemoveAttachment}
              editable
            />
          )}
        </ScrollView>

        <View style={styles.toolbar}>
          <Pressable onPress={() => setShowFormatting(!showFormatting)} style={[styles.toolbarButton, showFormatting && styles.activeButton]}>
            <Icon name="Type" size={24} color={showFormatting ? colors.primary[600] : colors.neutral[600]} />
          </Pressable>
          <View style={styles.divider} />
          {showFormatting ? (
            <>
              <Pressable onPress={() => insertFormat('**', '**')} style={styles.toolbarButton}>
                <Icon name="Bold" size={20} color={colors.neutral[600]} />
              </Pressable>
              <Pressable onPress={() => insertFormat('_', '_')} style={styles.toolbarButton}>
                <Icon name="Italic" size={20} color={colors.neutral[600]} />
              </Pressable>
              <Pressable onPress={() => insertFormat('# ')} style={styles.toolbarButton}>
                <Icon name="Heading" size={20} color={colors.neutral[600]} />
              </Pressable>
              <Pressable onPress={() => insertFormat('- ')} style={styles.toolbarButton}>
                <Icon name="List" size={20} color={colors.neutral[600]} />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handleAddImage} style={styles.toolbarButton}>
                <Icon name="Image" size={24} color={colors.neutral[600]} />
              </Pressable>
              <Pressable onPress={handleAddVideo} style={styles.toolbarButton}>
                <Icon name="Video" size={24} color={colors.neutral[600]} />
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
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
  titleInput: {
    ...typography.headlineMedium,
    color: colors.neutral[900],
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    alignItems: 'center',
    gap: spacing.md,
  },
  toolbarButton: {
    padding: spacing.sm,
  },
  activeButton: {
    backgroundColor: colors.primary[100],
    borderRadius: 8,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.neutral[300],
    marginHorizontal: spacing.xs,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
  },
  heading1: {
    ...typography.headlineMedium,
    color: colors.neutral[900],
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heading2: {
    ...typography.titleLarge,
    color: colors.neutral[900],
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  list_item: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    marginVertical: spacing.xs,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.neutral[900],
  },
  em: {
    fontStyle: 'italic',
    color: colors.neutral[900],
  },
});
