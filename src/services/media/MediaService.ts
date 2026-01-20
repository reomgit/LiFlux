import { Paths, Directory, File } from 'expo-file-system';
import { Attachment } from '../../types';

const MEDIA_DIRECTORY_NAME = 'media';

export class MediaService {
  private getMediaDirectory(): Directory {
    return new Directory(Paths.document, MEDIA_DIRECTORY_NAME);
  }

  private async ensureDirectoryExists(): Promise<void> {
    const mediaDir = this.getMediaDirectory();
    if (!mediaDir.exists) {
      await mediaDir.create();
    }
  }

  async saveMedia(uri: string, filename: string): Promise<string> {
    await this.ensureDirectoryExists();
    const sourceFile = new File(uri);
    const destFile = new File(this.getMediaDirectory(), filename);
    await sourceFile.copy(destFile);
    return destFile.uri;
  }

  async deleteMedia(uri: string): Promise<void> {
    const file = new File(uri);
    if (file.exists) {
      await file.delete();
    }
  }

  async getMediaExists(uri: string): Promise<boolean> {
    const file = new File(uri);
    return file.exists;
  }
}

let mediaServiceInstance: MediaService | null = null;

export function getMediaService(): MediaService {
  if (!mediaServiceInstance) {
    mediaServiceInstance = new MediaService();
  }
  return mediaServiceInstance;
}
