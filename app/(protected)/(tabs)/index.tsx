import { Image, StyleSheet, Platform, Pressable, ActivityIndicator, ScrollView, View, Alert } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaveImage } from '@/hooks/useSaveImage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIG } from '../../../config';
import { useGeneratedImages } from '@/stores/imageStore';

import Constants from 'expo-constants';

/**
 * Main screen component for generating AI images
 * Handles image generation using local server and provides saving functionality
 */
export default function HomeScreen() {
  // State management
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addImage } = useGeneratedImages();
  const insets = useSafeAreaInsets();
  const { saveImage } = useSaveImage();

  /**
   * Generates a new image using the local server
   */
  const generateImage = async () => {
    try {
      setLoading(true);
      
      // Check server liveness first
      const livenessCheck = await fetch('http://localhost:8000/');
      if (!livenessCheck.ok) {
        throw new Error('Server is not available');
      }

      // Generate image using local server
      const response = await fetch('http://localhost:8000/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      // Update state with generated image
      if (data.image_url) {
        console.log('Setting image URL:', data.image_url);
        setImageUrl(data.image_url);
        addImage(data.image_url);
      } else {
        console.log('No image_url in response data:', data);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles saving the current image to the device
   * Only attempts to save if an image is currently displayed
   */
  const handleSaveImage = () => {
    if (imageUrl) {
      saveImage(imageUrl);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
    >
      <ThemedView style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {loading ? (
            // Show loading spinner while generating
            <ActivityIndicator size="large" color="#A1CEDC" />
          ) : imageUrl ? (
            // Show generated image and save button
            <>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                testID="generated-image"
              />
              <Pressable 
                onPress={handleSaveImage}
                style={({pressed}) => [
                  styles.saveButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <ThemedText style={styles.buttonText}>Save to Photos</ThemedText>
              </Pressable>
            </>
          ) : (
            // Show placeholder when no image is generated
            <ThemedText style={styles.placeholder}>Press the button to generate an image</ThemedText>
          )}
        </View>
        
        {/* Generate button with safe area padding */}
        <View style={[styles.buttonWrapper, { marginBottom: insets.bottom + 90 }]}>
          <Pressable 
            onPress={generateImage} 
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Generating...' : 'Generate New Image'}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

/**
 * Styles for the HomeScreen component
 */
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    minHeight: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  buttonWrapper: {
    padding: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '50%',
  },
});
