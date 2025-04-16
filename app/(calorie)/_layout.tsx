import { Stack } from 'expo-router';

export default function CalorieLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Add" />
      <Stack.Screen name="AddMidi" />
      <Stack.Screen name="AddSoir" />
    </Stack>
  );
}