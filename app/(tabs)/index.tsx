import { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, Keyboard, KeyboardEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = 56 + insets.bottom;
  const [bottomOffset, setBottomOffset] = useState(tabBarHeight);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      // "Teleport" to the keyboard height immediately.
      // SearchBar has internal marginBottom of spacing.sm (8).
      // If we want it strictly on top, we just set the margin to keyboard height.
      // e.endCoordinates.height includes the safe area bottom.
      setBottomOffset(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setBottomOffset(tabBarHeight);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [tabBarHeight]);

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

      <View style={{ flex: 1 }}>
        <NoteList
          notes={displayNotes}
          onNotePress={handleNotePress}
          isLoading={isLoading}
          emptyMessage={query ? 'No notes found' : 'Create your first note'}
        />
      </View>

      <View style={{ marginBottom: bottomOffset }}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes..."
        />
      </View>
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