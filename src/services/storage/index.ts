export * from './StorageService';
export * from './AsyncStorageService';

import { IStorageService } from './StorageService';
import { AsyncStorageService } from './AsyncStorageService';

let storageInstance: IStorageService | null = null;

export function getStorageService(): IStorageService {
  if (!storageInstance) {
    storageInstance = new AsyncStorageService();
  }
  return storageInstance;
}
