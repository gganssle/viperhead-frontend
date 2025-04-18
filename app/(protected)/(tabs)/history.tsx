import { ScrollView, StyleSheet, Image, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGeneratedImages } from '@/stores/imageStore';
import type { GeneratedImage } from '@/stores/imageStore';
import { useSaveImage } from '@/hooks/useSaveImage';

export default function HistoryScreen() {
  const { images } = useGeneratedImages();
  const insets = useSafeAreaInsets();
  const { saveImage } = useSaveImage();

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: Math.max(insets.bottom + 80, 100) }
      ]}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Generated Images</ThemedText>
        {images.length === 0 ? (
          <ThemedText style={styles.placeholder}>
            No images generated yet. Go to the Generate tab to create some!
          </ThemedText>
        ) : (
          <View style={styles.imageGrid}>
            {images.map((item: GeneratedImage, index: number) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: item.url }} style={styles.image} />
                <ThemedText style={styles.styleText}>{item.style}</ThemedText>
                <Pressable 
                  onPress={() => saveImage(item.url)}
                  style={({pressed}) => [
                    styles.saveButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <ThemedText style={styles.buttonText}>Save to Photos</ThemedText>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'column',
    gap: 20,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  styleText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
