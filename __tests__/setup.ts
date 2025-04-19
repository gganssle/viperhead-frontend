import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';
import { Alert } from 'react-native';
import type { PermissionResponse } from 'expo-modules-core';
import type { FileSystemDownloadResult } from 'expo-file-system';

// Mock Expo modules
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ 
    status: 'granted',
    granted: true,
    canAskAgain: true
  } satisfies PermissionResponse),
  saveToLibraryAsync: jest.fn().mockResolvedValue('asset-id'),
}));

jest.mock('expo-file-system', () => ({
  downloadAsync: jest.fn().mockResolvedValue({ 
    uri: 'downloaded-image.jpg',
    status: 200,
    headers: {},
    mimeType: 'image/jpeg',
    md5: 'mock-md5'
  } satisfies FileSystemDownloadResult),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Google Auth
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [
    null,
    { type: 'success', authentication: { accessToken: 'mock-token' } },
    jest.fn(),
  ],
}));

jest.mock('expo-auth-session', () => ({
  exchangeCodeAsync: jest.fn(),
  loadAsync: jest.fn(),
  makeRedirectUri: jest.fn(),
  refreshAsync: jest.fn(),
  revokeAsync: jest.fn(),
  AuthSession: {
    getDefaultReturnUrl: jest.fn(),
  },
}));

// Mock Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native') as typeof import('react-native');
  return {
    ...RN,
    Alert: {
      ...RN.Alert,
      alert: jest.fn(),
    },
  };
});

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock ThemedText component
jest.mock('@/components/ThemedText', () => ({
  ThemedText: ({ children, style }: { children: React.ReactNode, style?: object }) => children,
}));

// Mock ThemedView component
jest.mock('@/components/ThemedView', () => ({
  ThemedView: ({ children, style }: { children: React.ReactNode, style?: object }) => children,
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
