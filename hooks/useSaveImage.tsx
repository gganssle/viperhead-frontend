import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

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
    if (!imageUrl) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission denied to save photos');
        return;
      }

      const localUri = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.documentDirectory + 'temp_image.jpg'
      );

      await MediaLibrary.saveToLibraryAsync(localUri.uri);
      Alert.alert('Success', 'Image saved to photos!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image');
    }
  };

  return { saveImage };
}
