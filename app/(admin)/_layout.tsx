import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="client/Editutilisateur" />
      <Stack.Screen name="client/Listutilisateur" />
      <Stack.Screen name="coach/Listcoach" />
    </Stack>
  );
}