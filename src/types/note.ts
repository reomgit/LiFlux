export type MediaType = 'image' | 'video' | 'livePhoto';

export interface Attachment {
  id: string;
  type: MediaType;
  uri: string;
  thumbnailUri?: string;
  width: number;
  height: number;
  duration?: number;
  mimeType?: string;
  fileSize?: number;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  isTrashed: boolean;
  trashedAt?: string;
}

export interface NotePreview {
  id: string;
  title: string;
  snippet: string;
  thumbnailUri?: string;
  attachmentCount: number;
  updatedAt: string;
}

export interface SearchResult {
  note: NotePreview;
  matchedText: string;
  matchIndex: number;
}
