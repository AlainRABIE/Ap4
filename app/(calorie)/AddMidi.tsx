import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";

export default function AddMidi() {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();
  const db = getFirestore();

  const handleConfirm = async () => {
    if (!mealName || !calories) {
      Alert.alert("Erreur", "Veuillez entrer un aliment et le nombre de calories.");
      return;
    }

    try {
      const userId = "1nH8cRhzzQYWIi3LTDD6Bx3SYLi2";
      const newMeal = {
        nom: mealName,
        calories: parseInt(calories),
        Repas: "Déjeuner",
        urlPhoto: photo || "",
        utilisateurId: userId,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "aliments"), newMeal);
      Alert.alert("Succès", "Repas ajouté avec succès !");
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'ajout du repas :", error);
      Alert.alert("Erreur", "Impossible d'ajouter le repas.");
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "Vous devez autoriser l'accès à la caméra.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Ajouter un repas - Déjeuner</Text>

      <TextInput
        style={styles.input}
        placeholder="Entrez un plat ou un aliment"
        value={mealName}
        onChangeText={setMealName}
      />

      <TextInput
        style={styles.input}
        placeholder="Entrez le nombre de calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.cameraContainer} onPress={takePhoto}>
        <Ionicons name="camera" size={32} color="#fff" />
        <Text style={styles.cameraText}>Prendre une photo</Text>
      </TouchableOpacity>

      {photo && (
        <Image source={{ uri: photo }} style={styles.photoPreview} />
      )}

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirmer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F4F4",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  cameraContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6A88",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  cameraText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});