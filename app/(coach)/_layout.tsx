import { Stack } from 'expo-router';

export default function CoachLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Forfait" />
      <Stack.Screen name="programmeclient" />
      <Stack.Screen name="seance" />
      <Stack.Screen name="setting" />
    </Stack>
  );
}