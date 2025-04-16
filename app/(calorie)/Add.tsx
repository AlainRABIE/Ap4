import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { TextInput } from "react-native-paper";

export default function AddMeal() {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mealType, setMealType] = useState("Petit-déjeuner");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const paramsProcessedRef = useRef(false);

  const router = useRouter();
  const params = useLocalSearchParams();
  const db = getFirestore();
  const auth = getAuth();

  // Récupère le type de repas et la date depuis les paramètres de navigation
  useEffect(() => {
    if (paramsProcessedRef.current) return;
    
    if (params.mealType && typeof params.mealType === "string") {
      setMealType(params.mealType);
    }

    // Récupérer la date sélectionnée depuis les paramètres
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
      Alert.alert(
        "Attention",
        "Veuillez entrer un aliment et le nombre de calories."
      );
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert(
          "Erreur",
          "Vous devez être connecté pour ajouter un repas."
        );
        setLoading(false);
        return;
      }

      // Utiliser la date sélectionnée plutôt que la date actuelle
      const newMeal = {
        nom: mealName,
        calories: parseInt(calories),
        Repas: mealType,
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
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la caméra."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la galerie."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* En-tête avec bouton retour */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ajouter un aliment</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Type de repas et date */}
          <View style={styles.mealInfoContainer}>
            <View style={styles.mealTypeWrapper}>
              <Ionicons
                name={
                  mealType === "Petit-déjeuner"
                    ? "sunny"
                    : mealType === "Déjeuner"
                    ? "restaurant"
                    : mealType === "Dîner"
                    ? "moon"
                    : "ice-cream"
                }
                size={20}
                color="#fff"
                style={styles.mealTypeIcon}
              />
              <Text style={styles.mealTypeName}>{mealType}</Text>
            </View>

            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={18} color="#666" />
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </View>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            <TextInput
              mode="outlined"
              label="Nom de l'aliment"
              value={mealName}
              onChangeText={setMealName}
              style={styles.textInput}
              placeholder="Ex: Pomme, Yaourt, Pain..."
              outlineColor="#dadada"
              activeOutlineColor="#FF6A88"
              left={<TextInput.Icon icon="food" />}
            />

            <TextInput
              mode="outlined"
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              style={styles.textInput}
              placeholder="Ex: 250"
              outlineColor="#dadada"
              activeOutlineColor="#FF6A88"
              left={<TextInput.Icon icon="fire" />}
              right={<TextInput.Affix text="kcal" />}
            />
          </View>

          {/* Section photo */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>Photo de l'aliment</Text>

            <View style={styles.photoButtons}>
              <TouchableOpacity
                style={[styles.photoButton, styles.cameraButton]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.photoButtonText}>Appareil photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.photoButton, styles.galleryButton]}
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color="#fff" />
                <Text style={styles.photoButtonText}>Galerie</Text>
              </TouchableOpacity>
            </View>

            {/* Aperçu de la photo */}
            {photo && (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: photo }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={removePhoto}
                >
                  <Ionicons name="close-circle" size={28} color="#FF6A88" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bouton de confirmation */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={22} color="#fff" />
                <Text style={styles.confirmButtonText}>Sauvegarder</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  mealInfoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  mealTypeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6A88",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 10,
  },
  mealTypeIcon: {
    marginRight: 8,
  },
  mealTypeName: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 50,
    paddingHorizontal: 12,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  formContainer: {
    marginBottom: 25,
  },
  textInput: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  photoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  photoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
  },
  cameraButton: {
    backgroundColor: "#FF6A88",
  },
  galleryButton: {
    backgroundColor: "#5E72E4",
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  photoPreviewContainer: {
    position: "relative",
    marginTop: 10,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  removePhotoButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});