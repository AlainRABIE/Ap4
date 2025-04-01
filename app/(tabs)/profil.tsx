import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../../firebase/firebaseConfig";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
}

const ProfileModificationPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore(app); // Initialiser Firestore
  const auth = getAuth(app); // Initialiser Firebase Authentication

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser; // Récupérer l'utilisateur connecté
        if (!user) {
          setError("Utilisateur non connecté.");
          setIsLoading(false);
          return;
        }

        const userId = user.uid; // Récupérer l'UID de l'utilisateur
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile({ id: userId, ...docSnap.data() } as UserProfile);
        } else {
          setError("Profil non trouvé.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (name: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;

    try {
      const docRef = doc(db, "users", profile.id);
      await setDoc(docRef, {
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
      });
      Alert.alert("Succès", "Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6A88" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le profil</Text>
      {profile && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom :</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio :</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.bio}
              onChangeText={(value) => handleInputChange("bio", value)}
              multiline
            />
          </View>
          <Button title="Enregistrer" onPress={handleSubmit} color="#FF6A88" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF6A88",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileModificationPage;