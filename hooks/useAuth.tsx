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
  signIn: () => Promise<void>;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: CONFIG.GOOGLE_CLIENT_ID,
    iosClientId: CONFIG.GOOGLE_CLIENT_ID,
    clientId: CONFIG.GOOGLE_CLIENT_ID, // Web client ID
    scopes: ['email', 'profile']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      fetchUserInfo(access_token);
    } else if (response?.type === 'error') {
      setError('Authentication failed');
      setIsLoading(false);
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();
      
      if (CONFIG.ALLOWED_EMAILS.includes(userInfo.email)) {
        setUserEmail(userInfo.email);
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('You are not authorized to use this application.');
        setIsAuthenticated(false);
      }
    } catch (error) {
      setError('Failed to fetch user information.');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    setError(null);
    setIsLoading(true);

    // Temporary bypass of auth TODO: remove this
    setIsAuthenticated(true);
    setUserEmail('test@example.com');
    setIsLoading(false);
    /////////////////////////////////////////////
    
    // try {
    //   const result = await promptAsync();
    //   if (result.type !== 'success') {
    //     setError('Sign in was cancelled or failed');
    //     setIsLoading(false);
    //   }
    // } catch (error) {
    //   setError('Failed to sign in.');
    //   setIsLoading(false);
    // }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
