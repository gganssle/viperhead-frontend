import { renderHook } from '@testing-library/react-native';
import { useSaveImage } from '@/hooks/useSaveImage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

jest.mock('expo-media-library');
jest.mock('expo-file-system');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('useSaveImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({ uri: 'downloaded-image.jpg' });
    (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValue('saved-asset');
  });

  it('successfully saves an image when permissions are granted', async () => {
    const { result } = renderHook(() => useSaveImage());
    await result.current.saveImage('https://example.com/image.jpg');

    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      expect.any(String)
    );
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('downloaded-image.jpg');
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Image saved to photos!');
  });

  it('shows error alert when permissions are denied', async () => {
    (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    const { result } = renderHook(() => useSaveImage());
    await result.current.saveImage('https://example.com/image.jpg');

    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
    expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Permission denied to save photos');
  });

  it('shows error alert when saving fails', async () => {
    (MediaLibrary.saveToLibraryAsync as jest.Mock).mockRejectedValue(new Error('Failed to save'));
    const { result } = renderHook(() => useSaveImage());
    await result.current.saveImage('https://example.com/image.jpg');

    expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalled();
    expect(FileSystem.downloadAsync).toHaveBeenCalled();
    expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to save image');
  });

  it('does nothing when imageUrl is empty', async () => {
    const { result } = renderHook(() => useSaveImage());
    await result.current.saveImage('');

    expect(MediaLibrary.requestPermissionsAsync).not.toHaveBeenCalled();
    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
    expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled();
  });
});
