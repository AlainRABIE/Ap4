import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Platform,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../services/UserContext";
import { getAuth } from "firebase/auth";
import { useRouter, Link } from "expo-router";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
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

  // Calculer l'IMC
  const calculateBMI = () => {
    if (user.poids && user.taille) {
      const weight = parseFloat(String(user.poids));
      const height = parseFloat(String(user.taille)) / 100; // Convertir cm en m
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();
  let bmiCategory = "";
  let bmiColor = "";

  if (bmi) {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) {
      bmiCategory = "Insuffisance pondérale";
      bmiColor = "#2D9CDB";
    } else if (bmiNum < 25) {
      bmiCategory = "Poids normal";
      bmiColor = "#27AE60";
    } else if (bmiNum < 30) {
      bmiCategory = "Surpoids";
      bmiColor = "#F2994A";
    } else {
      bmiCategory = "Obésité";
      bmiColor = "#EB5757";
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Animated.View 
          style={[
            styles.container, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['#0575E6', '#021B79']}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.headerName}>{user.nomComplet || "Utilisateur"}</Text>
              <Text style={styles.headerEmail}>{user.email}</Text>
              
              {/* Bouton déconnexion déplacé ici */}
              <TouchableOpacity style={styles.headerLogoutButton} onPress={handleLogout}>
                <Text style={styles.headerLogoutText}>Déconnexion</Text>
                <Ionicons name="log-out-outline" size={18} color="#FFF" />
              </TouchableOpacity>
              
              <Link href="/(reglage)/setting" asChild>
                <TouchableOpacity style={styles.settingsButton}>
                  <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </Link>
            </View>
          </LinearGradient>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.poids || "--"}</Text>
              <Text style={styles.statLabel}>kg</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.taille || "--"}</Text>
              <Text style={styles.statLabel}>cm</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.age || "--"}</Text>
              <Text style={styles.statLabel}>ans</Text>
            </View>
          </View>

          {bmi && (
            <View style={styles.bmiCard}>
              <View style={styles.bmiHeader}>
                <Text style={styles.bmiTitle}>Indice de Masse Corporelle</Text>
                <Text style={[styles.bmiValue, {color: bmiColor}]}>{bmi}</Text>
              </View>
              <Text style={[styles.bmiCategory, {color: bmiColor}]}>{bmiCategory}</Text>
              <View style={styles.bmiScale}>
                <View style={[styles.bmiIndicator, {left: `${Math.min(Math.max(parseFloat(bmi) * 2.5, 0), 100)}%`}]} />
                <View style={styles.bmiRanges}>
                  <View style={[styles.bmiRange, {backgroundColor: '#2D9CDB'}]} />
                  <View style={[styles.bmiRange, {backgroundColor: '#27AE60'}]} />
                  <View style={[styles.bmiRange, {backgroundColor: '#F2994A'}]} />
                  <View style={[styles.bmiRange, {backgroundColor: '#EB5757'}]} />
                </View>
                <View style={styles.bmiLabels}>
                  <Text style={styles.bmiLabel}>18.5</Text>
                  <Text style={styles.bmiLabel}>25</Text>
                  <Text style={styles.bmiLabel}>30</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            
            <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("nomComplet")}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="person" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Nom complet</Text>
                <Text style={styles.fieldValue}>{user.nomComplet || "Non renseigné"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <View style={styles.editableField}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="mail" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{user.email}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("poids")}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="fitness" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Poids</Text>
                <Text style={styles.fieldValue}>{user.poids ? `${user.poids} kg` : "Non renseigné"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("taille")}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="resize" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Taille</Text>
                <Text style={styles.fieldValue}>{user.taille ? `${user.taille} cm` : "Non renseigné"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("age")}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="calendar" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Âge</Text>
                <Text style={styles.fieldValue}>{user.age ? `${user.age} ans` : "Non renseigné"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Objectif nutritionnel</Text>
            
            <TouchableOpacity style={styles.editableField} onPress={() => handleEdit("niveauActivite")}>
              <View style={styles.fieldIconContainer}>
                <Ionicons name="flame" size={20} color="#0575E6" />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Niveau d'activité</Text>
                <Text style={styles.fieldValue}>{user.niveauActivite || "Non renseigné"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <View style={styles.caloriesCard}>
              <View style={styles.caloriesContent}>
                <Text style={styles.caloriesTitle}>Besoins caloriques journaliers</Text>
                <Text style={styles.caloriesValue}>{user.caloriesNecessaires || "--"}</Text>
                <Text style={styles.caloriesUnit}>calories/jour</Text>
              </View>
              <View style={styles.caloriesIcon}>
                <Ionicons name="nutrition" size={40} color="#0575E6" />
              </View>
            </View>
          </View>

          {/* Espace supplémentaire pour éviter le chevauchement avec la menubar */}
          <View style={styles.bottomSpacer} />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="dark" />
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
                    <Text style={styles.cancelText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveText}>Enregistrer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 80,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 50,
    padding: 3,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  headerName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  headerEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginBottom: 16,
  },
  headerLogoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 5,
  },
  headerLogoutText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  settingsButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 20,
    marginTop: -50,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "28%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0575E6",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  bmiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bmiCategory: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 15,
  },
  bmiScale: {
    position: "relative",
    marginTop: 10,
    height: 40,
  },
  bmiRanges: {
    height: 8,
    borderRadius: 4,
    flexDirection: "row",
  },
  bmiRange: {
    flex: 1,
  },
  bmiIndicator: {
    position: "absolute",
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#0575E6",
    marginLeft: -8,
    zIndex: 1,
  },
  bmiLabels: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginHorizontal: 10,
  },
  bmiLabel: {
    color: "#666",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  editableField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fieldIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(5, 117, 230, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  caloriesCard: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    alignItems: "center",
  },
  caloriesContent: {
    flex: 1,
  },
  caloriesTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  caloriesValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  caloriesUnit: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  caloriesIcon: {
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 80, // Ajustez cette valeur en fonction de la hauteur de votre menubar
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF6A88",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F1F1",
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#0575E6",
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ViewProfilePage;