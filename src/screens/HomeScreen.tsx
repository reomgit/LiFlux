import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Screen } from '../components/layout/Screen';
import { FloatingActionButton } from '../components/layout/FloatingActionButton';
import { NoteList } from '../components/notes/NoteList';
import { SearchBar } from '../components/search/SearchBar';
import { useNotes } from '../hooks/useNotes';
import { useSearch } from '../hooks/useSearch';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import type { HomeStackScreenProps } from '../navigation/types';

type NavigationProp = HomeStackScreenProps<'Home'>['navigation'];

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { notes, isLoading } = useNotes();
  const { query, setQuery, filteredNotes } = useSearch(notes);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleCreateNote = useCallback(() => {
    navigation.getParent()?.navigate('CreateNote');
  }, [navigation]);

  const handleNotePress = useCallback(
    (noteId: string) => {
      navigation.navigate('NoteDetail', { noteId });
    },
    [navigation]
  );

  const displayNotes = query ? filteredNotes : notes;

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <Text style={styles.subtitle}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      <NoteList
        notes={displayNotes}
        onNotePress={handleNotePress}
        onScroll={scrollHandler}
        isLoading={isLoading}
        emptyMessage={query ? 'No notes found' : 'Create your first note'}
      />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search notes..."
      />

      <FloatingActionButton onPress={handleCreateNote} icon="Plus" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
