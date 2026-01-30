import { IStorageService } from './StorageService';
import { fileSystemStorageService } from './FileSystemStorageService';

export * from './StorageService';
export * from './AsyncStorageService';
export * from './FileSystemStorageService';

export const storageService = fileSystemStorageService;

export function getStorageService(): IStorageService {
  return fileSystemStorageService;
}