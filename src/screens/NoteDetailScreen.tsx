import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import type { HomeStackScreenProps } from '../navigation/types';
import type { Note, Attachment } from '../types';

type RouteProp = HomeStackScreenProps<'NoteDetail'>['route'];
type NavigationProp = HomeStackScreenProps<'NoteDetail'>['navigation'];

export function NoteDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const { noteId } = route.params;

  const { getNoteById, updateNote, deleteNote } = useNotes();
  const { pickImage, pickVideo } = useMediaPicker();

  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const fetchedNote = await getNoteById(noteId);
      if (fetchedNote) {
        setNote(fetchedNote);
        setContent(fetchedNote.content);
        setAttachments(fetchedNote.attachments);
      }
    };
    fetchNote();
  }, [noteId, getNoteById]);

  const handleSave = useCallback(async () => {
    if (note && hasChanges) {
      await updateNote(note.id, { content, attachments });
      setHasChanges(false);
    }
  }, [note, content, attachments, hasChanges, updateNote]);

  const handleContentChange = useCallback((text: string) => {
    setContent(text);
    setHasChanges(true);
  }, []);

  const handleAddImage = useCallback(async () => {
    const result = await pickImage();
    if (result) {
      setAttachments((prev) => [...prev, result]);
      setHasChanges(true);
    }
  }, [pickImage]);

  const handleAddVideo = useCallback(async () => {
    const result = await pickVideo();
    if (result) {
      setAttachments((prev) => [...prev, result]);
      setHasChanges(true);
    }
  }, [pickVideo]);

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    setHasChanges(true);
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(noteId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [noteId, deleteNote, navigation]);

  const handleBack = useCallback(() => {
    if (hasChanges) {
      handleSave();
    }
    navigation.goBack();
  }, [hasChanges, handleSave, navigation]);

  if (!note) {
    return (
      <Screen>
        <Header title="Loading..." leftAction={{ icon: 'ArrowLeft', onPress: () => navigation.goBack() }} />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <Header
        title="Note"
        leftAction={{ icon: 'ArrowLeft', onPress: handleBack }}
        rightAction={{ icon: 'MoreHorizontal', onPress: handleDelete }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={handleContentChange}
          placeholder="Start writing..."
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
        {hasChanges && (
          <GlassButton
            onPress={handleSave}
            label="Save"
            size="sm"
          />
        )}
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
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.neutral[50],
  },
});
