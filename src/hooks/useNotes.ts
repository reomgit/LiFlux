import { useNotesContext } from '../context/NotesContext';

export function useNotes() {
  return useNotesContext();
}
