import { StyleSheet, View, ActivityIndicator, Image, SafeAreaView, StatusBar } from 'react-native';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export default function LoginScreen() {
  const { signIn, signInWithApple, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.error('Sign in error:', e);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.error('Apple sign-in error:', e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ height: 60 }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} hidden={false} />
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>Welcome</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
          
          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
          )}

          {isLoading ? (
            <ActivityIndicator size="large" color="#A1CEDC" />
          ) : (
            <>
              <Pressable 
                onPress={handleSignIn}
                style={({pressed}) => [
                  styles.button,
                  pressed && styles.buttonPressed
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={require('../assets/images/google-logo.png')}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    resizeMode="contain"
                  />
                  <ThemedText style={styles.buttonText}>
                    Sign in with Google
                  </ThemedText>
                </View>
              </Pressable>
              {Platform.OS === 'ios' && (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={5}
                  style={{ width: '100%', height: 44, marginTop: 16 }}
                  onPress={handleAppleSignIn}
                />
              )}
            </>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A1CEDC',
    padding: 15,
    borderRadius: 8,
    width: '100%',
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
  error: {
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
});
