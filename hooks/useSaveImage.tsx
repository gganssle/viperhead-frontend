import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export function useSaveImage() {
  const saveImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;

      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save images');
        return;
      }

      // Download the image
      const fileUri = `${FileSystem.cacheDirectory}temp_image.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      Alert.alert('Success', 'Image saved to your photos!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return { saveImage };
}
