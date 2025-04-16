import { Stack } from 'expo-router';

export default function ExerciseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="abdoexo" />
      <Stack.Screen name="bicepsexo" />
      <Stack.Screen name="jambexo" />
      <Stack.Screen name="jambe/HackSquat" />
    </Stack>
  );
}