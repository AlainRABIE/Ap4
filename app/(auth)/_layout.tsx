import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="donnee" />
      <Stack.Screen name="ActivityLevel" />
      <Stack.Screen name="ProfileData" />
    </Stack>
  );
}