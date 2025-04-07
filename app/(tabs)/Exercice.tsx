import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Animated, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importer le hook de navigation
import PremiumOverlay from "../../components/PremiumOverlay";

const exercises = [
  { id: "1", name: "Abdos", image: require("../../img/abdo.png"), route: "/(exo)/abdoexo" },
  { id: "2", name: "Dorsaux", image: require("../../img/dos.png"), route: "/(exo)/abdoexo" }, 
  { id: "3", name: "Biceps", image: require("../../img/biceps.png"), route: "/(tabs)/biceps" }, 
  { id: "4", name: "Jambe", image: require("../../img/jambe.png"), route: "/(tabs)/jambeexo" },
  { id: "5", name: "Pectoraux", image: require("../../img/peck.png"), route: "/(tabs)peckexo" }, 
];

const subscriptions = [
  { id: "1", name: "Abonnement Mensuel", price: "9,99€ / mois" },
  { id: "2", name: "Abonnement Trimestriel", price: "24,99€ / 3 mois" },
  { id: "3", name: "Abonnement Annuel", price: "89,99€ / an" },
];

export default function ExercisesScreen() {
  const router = useRouter(); // Initialiser le hook de navigation
  const [showSubscriptions, setShowSubscriptions] = useState(false); // État pour afficher ou masquer les abonnements
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  useEffect(() => {
    // Simuler la vérification d'abonnement - à remplacer par votre logique réelle
    const hasPremiumAccess = false; // Intégrer votre logique de vérification ici
    if (!hasPremiumAccess) {
      setShowPremiumOverlay(true);
    }
  }, []);

  const toggleSubscriptions = () => {
    setShowSubscriptions(!showSubscriptions);
  };

  const handleExercisePress = (item: any) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercises</Text>
        <View style={styles.upgradeBox}>
          <Ionicons name="barbell" size={24} color="white" />
          <Text style={styles.upgradeText}>Fitness & Musculation PRO</Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton} onPress={toggleSubscriptions}>
          <Text style={styles.upgradeButtonText}>MISE À NIVEAU MAINTENANT</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleExercisePress(item)}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.itemText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        )}
      />

      <PremiumOverlay 
        isVisible={showPremiumOverlay} 
        onClose={() => setShowPremiumOverlay(false)}
      />

      {/* Modal pour les abonnements */}
      <Modal
        visible={showSubscriptions}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleSubscriptions}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.subscriptionContainer}>
            <Text style={styles.modalTitle}>Choisissez un abonnement</Text>
            {subscriptions.map((sub) => (
              <View key={sub.id} style={styles.subscriptionItem}>
                <Text style={styles.subscriptionName}>{sub.name}</Text>
                <Text style={styles.subscriptionPrice}>{sub.price}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.closeButton} onPress={toggleSubscriptions}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  header: {
    backgroundColor: "transparent",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  upgradeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  upgradeText: {
    color: "#333",
    marginLeft: 10,
    fontSize: 16,
  },
  upgradeButton: {
    borderWidth: 2,
    borderColor: "#FF6A88",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  upgradeButtonText: {
    color: "#FF6A88",
    fontWeight: "bold",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    justifyContent: "center",
    alignItems: "center",
  },
  subscriptionContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  subscriptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subscriptionPrice: {
    fontSize: 16,
    color: "#FF6A88",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF6A88",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});