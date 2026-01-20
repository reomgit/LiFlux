import { Note, SearchResult, NotePreview } from '../../types';

export class SearchService {
  search(query: string, notes: Note[]): SearchResult[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return [];
    }

    const results: SearchResult[] = [];

    for (const note of notes) {
      if (note.isTrashed) continue;

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

let searchServiceInstance: SearchService | null = null;

export function getSearchService(): SearchService {
  if (!searchServiceInstance) {
    searchServiceInstance = new SearchService();
  }
  return searchServiceInstance;
}
