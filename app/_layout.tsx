import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { UserProvider } from "../services/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <RootLayoutContent />
    </UserProvider>
  );
}

function RootLayoutContent() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          contentStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(modals)/AddSoir" 
          options={{
            presentation: 'modal',
            headerShown: false
          }} 
        />
      </Stack>
    </SafeAreaView>
  );
}