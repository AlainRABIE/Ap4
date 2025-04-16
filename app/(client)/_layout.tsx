import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-client" />
      <Stack.Screen name="rendezvous" />
    </Stack>
  );
}