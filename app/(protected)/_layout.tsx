import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#A1CEDC" />
      <ThemedText style={{ marginTop: 10 }}>Loading...</ThemedText>
    </View>
  );
}

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
