import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageService } from './StorageService';
import { Note, Attachment, SearchResult, NotePreview } from '../../types';
import { generateId } from '../../utils/id';
import { getCurrentISOString } from '../../utils/date';
import { STORAGE_KEYS } from '../../constants/storage';

export class AsyncStorageService implements IStorageService {
  private async getNoteIds(): Promise<string[]> {
    const ids = await AsyncStorage.getItem(STORAGE_KEYS.NOTES_INDEX);
    return ids ? JSON.parse(ids) : [];
  }

  private async saveNoteIds(ids: string[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTES_INDEX, JSON.stringify(ids));
  }

  async getAllNotes(): Promise<Note[]> {
    const ids = await this.getNoteIds();
    const notes: Note[] = [];

    for (const id of ids) {
      const note = await this.getNoteById(id);
      if (note && !note.isTrashed) {
        notes.push(note);
      }
    }

    return notes.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNoteById(id: string): Promise<Note | null> {
    const key = `${STORAGE_KEYS.NOTE_PREFIX}${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async createNote(
    noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Note> {
    const now = getCurrentISOString();
    const note: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const key = `${STORAGE_KEYS.NOTE_PREFIX}${note.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(note));

    const ids = await this.getNoteIds();
    ids.unshift(note.id);
    await this.saveNoteIds(ids);

    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const existing = await this.getNoteById(id);
    if (!existing) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updated: Note = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: getCurrentISOString(),
    };

    const key = `${STORAGE_KEYS.NOTE_PREFIX}${id}`;
    await AsyncStorage.setItem(key, JSON.stringify(updated));

    return updated;
  }

  async deleteNote(id: string): Promise<void> {
    const key = `${STORAGE_KEYS.NOTE_PREFIX}${id}`;
    await AsyncStorage.removeItem(key);

    const ids = await this.getNoteIds();
    const filtered = ids.filter((noteId) => noteId !== id);
    await this.saveNoteIds(filtered);
  }

  async saveAttachment(
    attachmentData: Omit<Attachment, 'id'>
  ): Promise<Attachment> {
    const attachment: Attachment = {
      ...attachmentData,
      id: generateId(),
    };

    const key = `${STORAGE_KEYS.ATTACHMENTS_PREFIX}${attachment.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(attachment));

    return attachment;
  }

  async getAttachment(id: string): Promise<Attachment | null> {
    const key = `${STORAGE_KEYS.ATTACHMENTS_PREFIX}${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteAttachment(id: string): Promise<void> {
    const key = `${STORAGE_KEYS.ATTACHMENTS_PREFIX}${id}`;
    await AsyncStorage.removeItem(key);
  }

  async searchNotes(query: string): Promise<SearchResult[]> {
    const notes = await this.getAllNotes();
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const note of notes) {
      const content = note.content.toLowerCase();
      const matchIndex = content.indexOf(normalizedQuery);

      if (matchIndex !== -1) {
        const preview = this.toPreview(note);
        const matchedText = this.extractContext(
          note.content,
          matchIndex,
          normalizedQuery.length
        );

        results.push({
          note: preview,
          matchedText,
          matchIndex,
        });
      }
    }

    return results.sort((a, b) => a.matchIndex - b.matchIndex);
  }

  private toPreview(note: Note): NotePreview {
    const lines = note.content.split('\n').filter((line) => line.trim());
    const title = lines[0]?.substring(0, 50) || 'Untitled';
    const snippet = note.content.substring(0, 100);

    return {
      id: note.id,
      title,
      snippet,
      thumbnailUri: note.attachments[0]?.thumbnailUri || note.attachments[0]?.uri,
      attachmentCount: note.attachments.length,
      updatedAt: note.updatedAt,
    };
  }

  private extractContext(
    content: string,
    index: number,
    queryLength: number
  ): string {
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + queryLength + 30);
    let text = content.slice(start, end);

    if (start > 0) {
      text = '...' + text;
    }
    if (end < content.length) {
      text = text + '...';
    }

    return text;
  }
}
