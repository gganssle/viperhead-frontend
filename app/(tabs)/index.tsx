import { Image, StyleSheet, Platform, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import OpenAI from 'openai';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CONFIG } from '../../config';

export default function HomeScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: CONFIG.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for Expo web
  });

  const generateImage = async () => {
    try {
      setLoading(true);
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Generate a beautiful, high-quality image of my black lab, Maverick, except replace his head with the head of a viper snake.",
        n: 1,
        size: "1024x1024",
      });
      
      if (response.data[0].url) {
        setImageUrl(response.data[0].url);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#A1CEDC" />
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
        />
      ) : (
        <ThemedText style={styles.placeholder}>Press the button to generate an image</ThemedText>
      )}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 8,
    width: '80%',
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
});
