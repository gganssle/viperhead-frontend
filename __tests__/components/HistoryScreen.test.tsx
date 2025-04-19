import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from '@/app/(protected)/(tabs)/history';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/hooks/useAuth';
import * as imageStore from '@/stores/imageStore';

// Mock imageStore with proper type casting
const mockUseGeneratedImages = jest.fn().mockReturnValue({
  images: [
    { url: 'https://example.com/image1.jpg', style: 'Van Gogh' },
    { url: 'https://example.com/image2.jpg', style: 'Pixel Art' }
  ]
});

jest.mock('@/stores/imageStore', () => ({
  useGeneratedImages: mockUseGeneratedImages
}));

// Mock useSaveImage
jest.mock('@/hooks/useSaveImage', () => ({
  useSaveImage: () => ({
    saveImage: jest.fn()
  })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SafeAreaProvider>
);

describe('HistoryScreen', () => {
  const mockImages = [
    { url: 'https://example.com/image1.jpg', style: 'Van Gogh' },
    { url: 'https://example.com/image2.jpg', style: 'Pixel Art' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGeneratedImages.mockReturnValue({
      images: mockImages
    });
  });

  it('renders the list of generated images', () => {
    const { getByText } = render(<HistoryScreen />, { wrapper });
    expect(getByText('Generated Images')).toBeTruthy();
  });

  it('displays image styles correctly', () => {
    const { getByText } = render(<HistoryScreen />, { wrapper });
    expect(getByText('Van Gogh')).toBeTruthy();
    expect(getByText('Pixel Art')).toBeTruthy();
  });

  it('displays placeholder when no images exist', () => {
    mockUseGeneratedImages.mockReturnValue({ images: [] });
    const { getByText } = render(<HistoryScreen />, { wrapper });
    expect(getByText('No images generated yet. Go to the Generate tab to create some!')).toBeTruthy();
  });
});
