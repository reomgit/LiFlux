import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Note, Attachment } from '../types';
import { getStorageService } from '../services/storage';

interface NotesContextValue {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note | null>;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storage = getStorageService();

  const refreshNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await storage.getAllNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [storage]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const getNoteById = useCallback(
    async (id: string) => {
      return storage.getNoteById(id);
    },
    [storage]
  );

  const createNote = useCallback(
    async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newNote = await storage.createNote(noteData);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    [storage]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Note>) => {
      const updated = await storage.updateNote(id, updates);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updated : note))
      );
      return updated;
    },
    [storage]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await storage.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [storage]
  );

  const value: NotesContextValue = {
    notes,
    isLoading,
    error,
    refreshNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotesContext(): NotesContextValue {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
}
