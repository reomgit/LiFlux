import { useCallback } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/layout/Screen';
import { GlassButton } from '../../src/components/common/GlassButton';
import { Icon } from '../../src/components/common/Icon';
import { NoteList } from '../../src/components/notes/NoteList';
import { SearchBar } from '../../src/components/search/SearchBar';
import { useNotes } from '../../src/hooks/useNotes';
import { useSearch } from '../../src/hooks/useSearch';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function HomeScreen() {
  const router = useRouter();
  const { notes, isLoading } = useNotes();
  const { query, setQuery, filteredNotes } = useSearch(notes);

  const handleCreateNote = useCallback(() => {
    router.push('/create');
  }, [router]);

  const handleNotePress = useCallback(
    (noteId: string) => {
      router.push(`/note/${noteId}`);
    },
    [router]
  );

  const displayNotes = query ? filteredNotes : notes;

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Notes</Text>
            <Text style={styles.subtitle}>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>
          <GlassButton
            onPress={handleCreateNote}
            icon={<Icon name="Plus" size={24} color={colors.neutral[900]} />}
            size="sm"
            style={styles.headerButton}
          />
        </View>
      </View>

      <NoteList
        notes={displayNotes}
        onNotePress={handleNotePress}
        isLoading={isLoading}
        emptyMessage={query ? 'No notes found' : 'Create your first note'}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ marginBottom: 60 + spacing.sm }}
      >
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes..."
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: spacing.xs,
    minHeight: 40,
    minWidth: 40,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.neutral[900],
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.neutral[500],
    marginTop: spacing.xs,
  },
});
