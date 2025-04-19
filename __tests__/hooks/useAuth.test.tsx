import { renderHook, act } from '@testing-library/react-native';
import { useAuth, AuthProvider } from '@/hooks/useAuth';

// Mock the Google auth provider
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: () => [
    null,
    { type: 'success', authentication: { accessToken: 'mock-token' } },
    jest.fn(),
  ],
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock config
jest.mock('@/config', () => ({
  CONFIG: {
    GOOGLE_CLIENT_ID: 'mock-client-id',
    ALLOWED_EMAILS: ['test@example.com']
  }
}));

// Mock WebBrowser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial authentication state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.userEmail).toBe(null);
  });

  it('updates authentication state on sign in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.signIn();
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.userEmail).toBe('test@example.com');
  });

  it('updates authentication state on sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.signIn();
      await result.current.signOut();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.userEmail).toBe(null);
  });

  it('throws error when used outside of AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
