import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { CONFIG } from '../config';

// Initialize WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  accessToken: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_IOS_CLIENT_ID,
    clientId: CONFIG.GOOGLE_WEB_CLIENT_ID,
    scopes: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    extraParams: {
      access_type: 'offline'
    }
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setIsLoading(true); // Set loading when starting auth process
      console.log('Full auth response:', response);
      const { authentication } = response;
      if (authentication?.accessToken) {
        console.log('Got access token, fetching user info...');
        // First fetch user info to verify email
        fetchUserInfo(authentication.accessToken).then(() => {
          // After email is verified, set the ID token for API calls
          if (authentication.idToken) {
            console.log('Setting ID token for API calls');
            console.log('ID token audience:', JSON.parse(atob(authentication.idToken.split('.')[1])).aud);
            setAccessToken(authentication.idToken);
            setIsLoading(false); // Clear loading after successful auth
          } else {
            console.error('No ID token in authentication response');
            setError('Failed to get ID token');
            setIsLoading(false);
          }
        }).catch(error => {
          console.error('Error in auth flow:', error);
          setError('Authentication failed');
          setIsLoading(false);
        });
      } else {
        console.error('No access token for user info');
        setError('Failed to get user info token');
        setIsLoading(false);
      }
    } else if (response?.type === 'error') {
      console.error('Auth response error:', response);
      setError('Authentication failed');
      setIsLoading(false);
    } else if (response?.type === 'dismiss') {
      console.log('Auth dismissed by user');
      setError(null);
      setIsLoading(false);
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      console.log('Fetching user info...');
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('User info error:', errorText);
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      console.log('User info response:', userInfo);
      
      if (CONFIG.ALLOWED_EMAILS.includes(userInfo.email)) {
        console.log('User authorized:', userInfo.email);
        setUserEmail(userInfo.email);
        setIsAuthenticated(true);
        setError(null);
      } else {
        console.error('User not authorized:', userInfo.email);
        setError('You are not authorized to use this application.');
        setIsAuthenticated(false);
        setAccessToken(null);
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to fetch user information.');
      setIsAuthenticated(false);
      setAccessToken(null);
      throw error; // Re-throw to handle in the auth flow
    }
  };

  const signIn = async () => {
    try {
      console.log('Starting sign in...');
      setIsLoading(true);
      setError(null);
      console.log('Using proxy mode for auth...');
      const result = await promptAsync({ useProxy: true });
      console.log('Sign in result:', result);
      if (result.type !== 'success') {
        setError('Sign in was cancelled');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to start sign in process');
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setAccessToken(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        accessToken,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * @throws {Error} If used outside of AuthProvider
 * @returns Authentication context data
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
