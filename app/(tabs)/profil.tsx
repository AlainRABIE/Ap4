import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../services/UserContext";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const ViewProfilePage: React.FC = () => {
  const { user, setUser } = useUser(); // Récupérer et mettre à jour l'utilisateur
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();

  const [modalVisible, setModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<"nomComplet" | "departement">(
    "nomComplet"
  );
  const [newValue, setNewValue] = useState("");

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("../(auth)/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  const handleEdit = (field: "nomComplet" | "departement") => {
    setFieldToEdit(field);
    setNewValue(user?.[field] || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "utilisateurs", user.uid);
      await updateDoc(userRef, { [fieldToEdit]: newValue });

      // Mettre à jour le contexte utilisateur
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
    <View style={styles.container}>
      <Text style={styles.title}>Profil de l'utilisateur</Text>

      {/* Nom complet */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom :</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{user.nomComplet || "Non renseigné"}</Text>
          <TouchableOpacity onPress={() => handleEdit("nomComplet")}>
            <Ionicons name="pencil" size={20} color="#4FC3F7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Email */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      {/* Département */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Département :</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{user.departement || "Non renseigné"}</Text>
          <TouchableOpacity onPress={() => handleEdit("departement")}>
            <Ionicons name="pencil" size={20} color="#4FC3F7" />
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Déconnexion" onPress={handleLogout} color="#FF6A88" />

      {/* Modal pour modifier un champ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Modifier {fieldToEdit}</Text>
            <TextInput
              style={styles.input}
              value={newValue}
              onChangeText={setNewValue}
              placeholder={`Entrez un nouveau ${fieldToEdit}`}
            />
            <View style={styles.modalButtons}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Enregistrer" onPress={handleSave} color="#4CAF50" />
            </View>
          </View>
        </View>
      </Modal>
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
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default ViewProfilePage;