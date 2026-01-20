import { Note, Attachment, SearchResult } from '../../types';

export interface IStorageService {
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note>;
  deleteNote(id: string): Promise<void>;

  saveAttachment(attachment: Omit<Attachment, 'id'>): Promise<Attachment>;
  getAttachment(id: string): Promise<Attachment | null>;
  deleteAttachment(id: string): Promise<void>;

  searchNotes(query: string): Promise<SearchResult[]>;
}

export interface SyncResult {
  success: boolean;
  syncedAt: string;
  changesUploaded: number;
  changesDownloaded: number;
  errors?: string[];
}

export interface SyncStatus {
  lastSyncAt?: string;
  pendingChanges: number;
  isSyncing: boolean;
  error?: string;
}
