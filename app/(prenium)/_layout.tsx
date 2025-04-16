import { Stack } from 'expo-router';

export default function PremiumLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Abo" />
      <Stack.Screen name="CheckoutScreen" />
      <Stack.Screen name="PaymentScreen" />
    </Stack>
  );
}