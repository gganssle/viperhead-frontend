import { Image, StyleSheet, Platform, Pressable, ActivityIndicator, ScrollView, View, Alert } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaveImage } from '@/hooks/useSaveImage';
import { useAuth } from '@/hooks/useAuth';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIG } from '../../../config';
import { useGeneratedImages } from '@/stores/imageStore';

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
  const { accessToken, userEmail, signOut, signIn } = useAuth();
  const [showGoogleRequired, setShowGoogleRequired] = useState(false);

  /**
   * Generates a new image using the server
   */
  const generateImage = async () => {
    // Require Google sign-in if Apple sign-in is detected
    if (accessToken && userEmail === null) {
      setShowGoogleRequired(true);
      Alert.alert(
        'Google Sign-In Required',
        'You must sign in with Google to use the Google image generation service.',
        [
          { text: 'Sign Out', onPress: () => { signOut(); setShowGoogleRequired(false); } },
          { text: 'OK', onPress: () => setShowGoogleRequired(false) }
        ]
      );
      return;
    }

    try {
      if (!accessToken) {
        throw new Error('Not authenticated. Please sign in again.');
      }

      setLoading(true);
      
      // Check server liveness first
      console.log('Checking server health at:', `${CONFIG.SERVER.BASE_URL}${CONFIG.SERVER.ENDPOINTS.HEALTH_CHECK}`);
      const livenessCheck = await fetch(`${CONFIG.SERVER.BASE_URL}${CONFIG.SERVER.ENDPOINTS.HEALTH_CHECK}`);
      console.log('Health check status:', livenessCheck.status);
      if (!livenessCheck.ok) {
        throw new Error('Server is not available');
      }

      // Generate image using server
      // console.log('Using access token:', accessToken);
      console.log('Requesting image generation from:', `${CONFIG.SERVER.BASE_URL}${CONFIG.SERVER.ENDPOINTS.GENERATE_IMAGE}`);
      const response = await fetch(`${CONFIG.SERVER.BASE_URL}${CONFIG.SERVER.ENDPOINTS.GENERATE_IMAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      // console.log('Request headers:', {
      //   'Content-Type': 'application/json',
      //   'Authorization': `Bearer ${accessToken}`
      // });
      console.log('Image generation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Failed to generate image: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response data:', data);
      
      // Update state with generated image
      if (data.image_url) {
        console.log('Setting image URL:', data.image_url);
        setImageUrl(data.image_url);
        addImage(data.image_url);
      } else {
        console.log('No image_url in response data:', data);
      }
    } catch (error: unknown) {
      console.error('Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to generate image: ${errorMessage}`);
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
