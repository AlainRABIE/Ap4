import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { UserProvider } from "../services/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <SafeAreaView style={styles.container}>
        <Stack>
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
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
});