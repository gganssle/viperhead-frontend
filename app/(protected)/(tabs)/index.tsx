import { Image, StyleSheet, Platform, Pressable, ActivityIndicator, ScrollView, View, Alert } from 'react-native';
import { useState } from 'react';
import OpenAI from 'openai';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaveImage } from '@/hooks/useSaveImage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIG } from '../../../config';
import { useGeneratedImages } from '@/stores/imageStore';

import Constants from 'expo-constants';


/**
 * List of artistic styles that can be randomly applied to generated images
 */
const artStyles = [
  "in the style of Van Gogh's Starry Night",
  "as a Renaissance oil painting",
  "in cyberpunk neon style",
  "as a watercolor illustration",
  "in art deco style",
  "as a comic book illustration",
  "in minimalist Japanese ink style",
  "as a Pop Art piece",
  "in the style of Studio Ghibli",
  "as a surrealist Salvador Dali painting",
  "in pixel art style",
  "as a medieval tapestry",
  "in vaporwave aesthetic",
  "as a chalk pastel drawing",
  "in steampunk style"
];

/**
 * Main screen component for generating AI images
 * Handles image generation using DALL-E and provides saving functionality
 */
export default function HomeScreen() {
  // State management
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<string>("");
  const { addImage } = useGeneratedImages();
  const insets = useSafeAreaInsets();
  const { saveImage } = useSaveImage();

  // Initialize OpenAI client
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey;

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for Expo web
  });

  /**
   * Generates a new image using DALL-E 3
   * Applies a random artistic style from the artStyles list
   */
  const generateImage = async () => {
    try {
      setLoading(true);
      // Select random art style
      const randomStyle = artStyles[Math.floor(Math.random() * artStyles.length)];
      setCurrentStyle(randomStyle);
      
      // Generate image using DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Generate an image of my black lab, except instead of his head, replace it with the head of a viper, ${randomStyle}`,
        n: 1,
        size: "1024x1024",
      });
      
      // Update state with generated image
      if (response.data[0].url) {
        const url = response.data[0].url;
        setImageUrl(url);
        addImage(url, randomStyle);
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
              <ThemedText style={styles.styleText}>Style: {currentStyle}</ThemedText>
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
  styleText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
