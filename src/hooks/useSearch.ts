import { useState, useMemo, useCallback, useEffect } from 'react';
import { Note } from '../types';

export function useSearch(notes: Note[]) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredNotes = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return notes;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();

    const MAX_RESULTS = 50;

    return notes
      .filter((note) => {
        if (note.isTrashed) return false;
        const content = note.content.toLowerCase();
        return content.includes(normalizedQuery);
      })
      .slice(0, MAX_RESULTS);
  }, [notes, debouncedQuery]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    filteredNotes,
    isSearching: query.length > 0,
    clearSearch,
  };
}
