import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { login } from '../../services/auth'; 


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Utilisation du hook useRouter

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("../(tabs)/home"); // Redirection vers la page d'accueil après connexion réussie
    } catch (err) {
      setError(
        "Login failed: " + (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const navigateToRegister = () => {
    router.push("./Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={navigateToRegister} style={styles.registerLink}>
        <Text style={styles.registerText}>Pas de compte ? Inscrivez-vous ici</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});