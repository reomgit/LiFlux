import * as FileSystem from 'expo-file-system/legacy';
import { Note, Attachment, SearchResult } from '../../types';
import { IStorageService } from './StorageService';
import { generateId } from '../../utils/id';
import { getCurrentISOString } from '../../utils/date';

const ROOT_DIR = FileSystem.documentDirectory + 'LiFlux/';
const NOTES_DIR = ROOT_DIR + 'notes/';
const MEDIA_DIR = ROOT_DIR + 'media/';

// Helper to ensure directories exist
const ensureDirectories = async () => {
  const rootInfo = await FileSystem.getInfoAsync(ROOT_DIR);
  if (!rootInfo.exists) {
    await FileSystem.makeDirectoryAsync(ROOT_DIR);
  }
  const notesInfo = await FileSystem.getInfoAsync(NOTES_DIR);
  if (!notesInfo.exists) {
    await FileSystem.makeDirectoryAsync(NOTES_DIR);
  }
  const mediaInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
  if (!mediaInfo.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIR);
  }
};

// Simple Frontmatter Parser/Serializer
const serializeNote = (note: Note): string => {
  // Convert attachment absolute URIs to relative paths for storage
  const attachments = note.attachments.map(att => {
    if (att.uri.startsWith('file://')) {
      // Extract filename from the end
      const filename = att.uri.split('/').pop();
      return {
        ...att,
        uri: `media/${filename}`
      };
    }
    return att;
  });

  const frontmatter = {
    id: note.id,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    isTrashed: note.isTrashed,
    trashedAt: note.trashedAt,
    attachments: attachments,
  };

  return `---
${JSON.stringify(frontmatter, null, 2)}
---
${note.content}`;
};

const parseNote = (content: string): Partial<Note> & { content: string } => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (match) {
    try {
      const frontmatter = JSON.parse(match[1]);
      
      // Resolve relative attachment paths to absolute URIs
      if (frontmatter.attachments) {
        frontmatter.attachments = frontmatter.attachments.map((att: Attachment) => {
          if (att.uri && !att.uri.startsWith('file://') && !att.uri.startsWith('http')) {
             return {
               ...att,
               uri: ROOT_DIR + att.uri
             };
          }
          return att;
        });
      }

      const body = match[2];
      return {
        ...frontmatter,
        content: body,
      };
    } catch (e) {
      console.warn('Failed to parse frontmatter', e);
    }
  }
  
  // Fallback if no valid frontmatter
  return {
    content: content,
    attachments: [],
    createdAt: getCurrentISOString(),
    updatedAt: getCurrentISOString(),
    isTrashed: false,
  };
};

// Helper to sanitize filenames (though we use IDs, good practice)
const getNotePath = (id: string) => `${NOTES_DIR}${id}.md`;

class FileSystemStorageService implements IStorageService {
  private initialized = false;

  private async init() {
    if (!this.initialized) {
      await ensureDirectories();
      this.initialized = true;
    }
  }

  async getAllNotes(): Promise<Note[]> {
    await this.init();
    try {
      const files = await FileSystem.readDirectoryAsync(NOTES_DIR);
      const notes: Note[] = [];

      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        
        try {
          const content = await FileSystem.readAsStringAsync(NOTES_DIR + file);
          const parsed = parseNote(content);
          
          if (parsed.id) {
            notes.push(parsed as Note);
          }
        } catch (e) {
          console.warn(`Failed to read note file: ${file}`, e);
        }
      }

      // Sort by updated at desc
      return notes.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } catch (e) {
      console.error('Error getting all notes:', e);
      return [];
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    await this.init();
    try {
      const path = getNotePath(id);
      const info = await FileSystem.getInfoAsync(path);
      
      if (!info.exists) return null;
      
      const content = await FileSystem.readAsStringAsync(path);
      const parsed = parseNote(content);
      return parsed as Note;
    } catch (e) {
      console.error(`Error getting note ${id}:`, e);
      return null;
    }
  }

  async createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    await this.init();
    const now = getCurrentISOString();
    const id = generateId();
    
    const newNote: Note = {
      ...noteData,
      id,
      createdAt: now,
      updatedAt: now,
      isTrashed: noteData.isTrashed || false,
    };

    const fileContent = serializeNote(newNote);
    await FileSystem.writeAsStringAsync(getNotePath(id), fileContent);
    
    return newNote;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    await this.init();
    const currentNote = await this.getNoteById(id);
    if (!currentNote) {
      throw new Error(`Note with id ${id} not found`);
    }

    const updatedNote: Note = {
      ...currentNote,
      ...updates,
      updatedAt: getCurrentISOString(),
    };

    const fileContent = serializeNote(updatedNote);
    await FileSystem.writeAsStringAsync(getNotePath(id), fileContent);
    
    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    await this.init();
    const note = await this.getNoteById(id);
    if (note) {
      if (note.isTrashed) {
        // Permanently delete file
        await FileSystem.deleteAsync(getNotePath(id), { idempotent: true });
      } else {
        await this.updateNote(id, { isTrashed: true, trashedAt: getCurrentISOString() });
      }
    }
  }

  async saveAttachment(attachment: Omit<Attachment, 'id'>): Promise<Attachment> {
    await this.init();
    const id = generateId();
    const ext = attachment.uri.split('.').pop() || 'jpg';
    const filename = `${id}.${ext}`;
    const destination = MEDIA_DIR + filename;
    
    // Copy file to our media directory
    await FileSystem.copyAsync({
      from: attachment.uri,
      to: destination
    });

    return {
      ...attachment,
      id,
      uri: destination,
    };
  }

  async getAttachment(id: string): Promise<Attachment | null> {
    return null; 
  }

  async deleteAttachment(id: string): Promise<void> {
    await this.init();
    const files = await FileSystem.readDirectoryAsync(MEDIA_DIR);
    const file = files.find(f => f.startsWith(id));
    if (file) {
      await FileSystem.deleteAsync(MEDIA_DIR + file, { idempotent: true });
    }
  }

  async searchNotes(query: string): Promise<SearchResult[]> {
    const notes = await this.getAllNotes();
    const lowerQuery = query.toLowerCase();
    
    return notes
      .filter(note => !note.isTrashed)
      .reduce((results: SearchResult[], note) => {
        const contentMatch = note.content.toLowerCase().indexOf(lowerQuery);
        if (contentMatch !== -1) {
          results.push({
            note: {
              id: note.id,
              title: note.content.split('\n')[0].substring(0, 50),
              snippet: note.content.substring(Math.max(0, contentMatch - 20), contentMatch + 80),
              updatedAt: note.updatedAt,
              attachmentCount: note.attachments.length,
              thumbnailUri: note.attachments.find(a => a.type === 'image')?.uri
            },
            matchedText: note.content.substring(contentMatch, contentMatch + query.length),
            matchIndex: contentMatch
          });
        }
        return results;
      }, []);
  }
}

export const fileSystemStorageService = new FileSystemStorageService();