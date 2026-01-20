import { Note, Attachment, SearchResult } from './note';

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

  sync?(): Promise<SyncResult>;
  getSyncStatus?(): Promise<SyncStatus>;
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

export const STORAGE_KEYS = {
  NOTES_INDEX: '@liflux/notes/index',
  NOTE_PREFIX: '@liflux/notes/item/',
  ATTACHMENTS_PREFIX: '@liflux/attachments/',
  SETTINGS: '@liflux/settings',
  SYNC_STATE: '@liflux/sync',
} as const;

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  iCloudEnabled: boolean;
  autoSaveInterval: number;
}
