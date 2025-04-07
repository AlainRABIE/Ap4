import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../services/UserContext";
import { getAuth } from "firebase/auth";
import { useRouter, Link } from "expo-router";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const ViewProfilePage: React.FC = () => {
  const { user, setUser } = useUser();
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();

  const [modalVisible, setModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<
    "nomComplet" | "departement" | "poids" | "age" | "taille" | "sexe" | "niveauActivite"
  >("nomComplet");
  const [newValue, setNewValue] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("../(auth)/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  const handleEdit = (field: "nomComplet" | "departement" | "poids" | "age" | "taille" | "sexe" | "niveauActivite") => {
    setFieldToEdit(field);
    setNewValue(String(user?.[field] || ""));
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "utilisateurs", user.uid);
      await updateDoc(userRef, { [fieldToEdit]: newValue });

      setUser({ ...user, [fieldToEdit]: newValue });

      setModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Aucun utilisateur connecté.</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
        <Link href="/(reglage)/setting" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        {/* Informations personnelles */}
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nom complet</Text>
          <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("nomComplet")}>
            <Text style={styles.value}>{user.nomComplet || "Non renseigné"}</Text>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.editableField}>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>

        {/* Mensurations */}
        <Text style={styles.sectionTitle}>Mensurations</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Poids (kg)</Text>
          <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("poids")}>
            <Text style={styles.value}>{user.poids || "Non renseigné"}</Text>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Taille (cm)</Text>
          <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("taille")}>
            <Text style={styles.value}>{user.taille || "Non renseigné"}</Text>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Âge</Text>
          <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("age")}>
            <Text style={styles.value}>{user.age || "Non renseigné"}</Text>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Paramètres */}
        <Text style={styles.sectionTitle}>Paramètres</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Niveau d'activité</Text>
          <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("niveauActivite")}>
            <Text style={styles.value}>{user.niveauActivite || "Non renseigné"}</Text>
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Calories nécessaires</Text>
          <View style={styles.editableField}>
            <Text style={styles.value}>{user.caloriesNecessaires || "Non calculé"}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FFF" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Modifier {
                fieldToEdit === "nomComplet" ? "le nom" : 
                fieldToEdit === "departement" ? "le département" :
                fieldToEdit === "poids" ? "le poids" :
                fieldToEdit === "taille" ? "la taille" :
                fieldToEdit === "niveauActivite" ? "le niveau d'activité" :
                "l'âge"
              }
            </Text>
            <TextInput
              style={styles.input}
              value={newValue}
              onChangeText={setNewValue}
              placeholder={`Entrez ${
                fieldToEdit === "poids" ? "votre poids en kg" :
                fieldToEdit === "age" ? "votre âge" :
                fieldToEdit === "taille" ? "votre taille en cm" :
                fieldToEdit === "niveauActivite" ? "votre niveau d'activité" :
                `un nouveau ${fieldToEdit}`
              }`}
              keyboardType={fieldToEdit === "poids" || fieldToEdit === "age" || fieldToEdit === "taille" ? "numeric" : "default"}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F8FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  settingsButton: {
    padding: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 20,
    marginBottom: 15,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  editableField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
  },
  value: {
    fontSize: 16,
    color: "#1A1A1A",
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    color: "#FF6A88",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F1F1",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default ViewProfilePage;