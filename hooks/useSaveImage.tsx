import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

/**
 * Custom hook for saving images to the device's media library
 * Handles permissions, downloading, and saving of images
 * 
 * @returns Object containing the saveImage function
 */
export function useSaveImage() {
  /**
   * Saves an image from a URL to the device's media library
   * 
   * @param imageUrl - URL of the image to save
   * @throws Will show an alert if permissions are denied or saving fails
   */
  const saveImage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;

      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save images');
        return;
      }

      // Download image to temporary location
      const fileUri = `${FileSystem.cacheDirectory}temp_image.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);

      // Save downloaded image to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      // Show success message
      Alert.alert('Success', 'Image saved to your photos!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return { saveImage };
}
