import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importer le hook de navigation
import * as ImagePicker from "expo-image-picker"; // Importer ImagePicker pour la prise de photo

interface Meal {
  id: string;
  name: string;
  calories: number;
}

export default function AddMidi() {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [photo, setPhoto] = useState<string | null>(null); // État pour stocker la photo

  const router = useRouter(); // Initialiser le hook de navigation

  const addMeal = () => {
    if (!mealName || !calories) {
      Alert.alert("Erreur", "Veuillez entrer un aliment et le nombre de calories.");
      return;
    }

    const newMeal: Meal = {
      id: Math.random().toString(),
      name: mealName,
      calories: parseInt(calories),
    };

    setMeals([...meals, newMeal]);
    setMealName("");
    setCalories("");
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
      setPhoto(result.assets[0].uri); // Stocker l'URI de la photo
    }
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <Text style={styles.mealName}>{item.name}</Text>
      <Text style={styles.mealCalories}>{item.calories} kcal</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
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

      <TouchableOpacity style={styles.addButton} onPress={addMeal}>
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>

      {/* Rectangle avec le logo de l'appareil photo */}
      <TouchableOpacity style={styles.cameraContainer} onPress={takePhoto}>
        <Ionicons name="camera" size={32} color="#fff" />
        <Text style={styles.cameraText}>Prendre une photo</Text>
      </TouchableOpacity>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={renderMeal}
        contentContainerStyle={styles.listContainer}
      />
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
  addButton: {
    backgroundColor: "#FF6A88",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  listContainer: {
    paddingBottom: 20,
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mealCalories: {
    fontSize: 16,
    color: "#FF6A88",
  },
});