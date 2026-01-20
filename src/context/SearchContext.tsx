import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Note, NotePreview } from '../types';

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('');

  const isSearching = query.length > 0;

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const value: SearchContextValue = {
    query,
    setQuery,
    isSearching,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
