import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(protected)/(tabs)/index';
import * as imageStore from '@/stores/imageStore';
import { useSaveImage } from '@/hooks/useSaveImage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/hooks/useAuth';

// Mock the hooks and modules
jest.mock('@/hooks/useSaveImage');

// Mock imageStore with proper type casting
const mockUseGeneratedImages = jest.fn().mockReturnValue({
  addImage: jest.fn(),
  images: []
});

jest.mock('@/stores/imageStore', () => ({
  useGeneratedImages: mockUseGeneratedImages
}));

// Mock config
jest.mock('@/config', () => ({
  CONFIG: {
    OPENAI_API_KEY: 'test-key'
  }
}));

// Mock OpenAI
jest.mock('openai', () => {
  const mockGenerate = jest.fn().mockResolvedValue({
    data: [{ url: 'https://mock-image-url.com/image.jpg' }]
  });

  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      images: { generate: mockGenerate }
    }))
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SafeAreaProvider>
);

describe('HomeScreen', () => {
  const mockAddImage = jest.fn();
  const mockSaveImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGeneratedImages.mockReturnValue({ addImage: mockAddImage, images: [] });
    (useSaveImage as jest.Mock).mockReturnValue({ saveImage: mockSaveImage });
  });

  it('renders initial state correctly', () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    expect(getByText('Press the button to generate an image')).toBeTruthy();
    expect(getByText('Generate New Image')).toBeTruthy();
  });

  it('shows loading state when generating image', async () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    const generateButton = getByText('Generate New Image');
    fireEvent.press(generateButton);
    expect(getByText('Generating...')).toBeTruthy();
  });

  it('displays generated image and save button after successful generation', async () => {
    const { getByText, getByTestId } = render(<HomeScreen />, { wrapper });
    const generateButton = getByText('Generate New Image');
    fireEvent.press(generateButton);
    await waitFor(() => {
      expect(getByTestId('generated-image')).toBeTruthy();
      expect(getByText('Save to Photos')).toBeTruthy();
      expect(getByText(/Style:/)).toBeTruthy();
    });
  });

  it('calls saveImage when save button is pressed', async () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    const generateButton = getByText('Generate New Image');
    fireEvent.press(generateButton);
    await waitFor(() => {
      const saveButton = getByText('Save to Photos');
      fireEvent.press(saveButton);
      expect(mockSaveImage).toHaveBeenCalledWith('https://mock-image-url.com/image.jpg');
    });
  });

  it('adds generated image to history', async () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    const generateButton = getByText('Generate New Image');
    fireEvent.press(generateButton);
    await waitFor(() => {
      expect(mockAddImage).toHaveBeenCalledWith(
        'https://mock-image-url.com/image.jpg',
        expect.any(String)
      );
    });
  });
});
