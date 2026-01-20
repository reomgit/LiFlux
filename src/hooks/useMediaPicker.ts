import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Attachment, MediaType } from '../types';
import { generateId } from '../utils/id';
import { getCurrentISOString } from '../utils/date';

export function useMediaPicker() {
  const requestPermission = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Media library permission not granted');
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async (): Promise<Attachment | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    const attachment: Attachment = {
      id: generateId(),
      type: 'image',
      uri: asset.uri,
      thumbnailUri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      createdAt: getCurrentISOString(),
    };

    return attachment;
  }, [requestPermission]);

  const pickVideo = useCallback(async (): Promise<Attachment | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    const attachment: Attachment = {
      id: generateId(),
      type: 'video',
      uri: asset.uri,
      thumbnailUri: asset.uri,
      width: asset.width,
      height: asset.height,
      duration: asset.duration ? asset.duration / 1000 : undefined,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      createdAt: getCurrentISOString(),
    };

    return attachment;
  }, [requestPermission]);

  const pickMedia = useCallback(async (): Promise<Attachment | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];
    const isVideo = asset.type === 'video';

    const attachment: Attachment = {
      id: generateId(),
      type: isVideo ? 'video' : 'image',
      uri: asset.uri,
      thumbnailUri: asset.uri,
      width: asset.width,
      height: asset.height,
      duration: asset.duration ? asset.duration / 1000 : undefined,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      createdAt: getCurrentISOString(),
    };

    return attachment;
  }, [requestPermission]);

  return {
    pickImage,
    pickVideo,
    pickMedia,
  };
}
