import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AddSoir() {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const paramsProcessedRef = useRef(false);

  const router = useRouter();
  const params = useLocalSearchParams();
  const db = getFirestore();
  const auth = getAuth();

  // Récupère la date depuis les paramètres de navigation
  useEffect(() => {
    if (paramsProcessedRef.current) return;

    if (params.date && typeof params.date === "string") {
      try {
        const dateFromParam = new Date(params.date);
        if (!isNaN(dateFromParam.getTime())) {
          setSelectedDate(dateFromParam);
        }
      } catch (error) {
        console.error("Erreur lors du parsing de la date:", error);
      }
    }

    paramsProcessedRef.current = true;
  }, [params]);

  // Formater la date pour l'affichage
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const handleConfirm = async () => {
    if (!mealName || !calories) {
      Alert.alert("Erreur", "Veuillez entrer un aliment et le nombre de calories.");
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Erreur", "Vous devez être connecté pour ajouter un repas.");
        setLoading(false);
        return;
      }

      const newMeal = {
        nom: mealName,
        calories: parseInt(calories),
        Repas: "Dîner",
        urlPhoto: photo || "",
        utilisateurId: currentUser.uid,
        date: selectedDate.toISOString(),
      };

      await addDoc(collection(db, "aliments"), newMeal);
      Alert.alert("Succès", "Repas ajouté avec succès !");
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'ajout du repas :", error);
      Alert.alert("Erreur", "Impossible d'ajouter le repas.");
    } finally {
      setLoading(false);
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Ajouter un repas - Dîner</Text>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={18} color="#666" />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>

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

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    alignSelf: "center",
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
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
    backgroundColor: "#FF6A88",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});