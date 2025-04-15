import { Stack } from 'expo-router';
import { UserProvider } from '../services/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(client)" options={{ headerShown: false }} />
        <Stack.Screen name="(reglage)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
