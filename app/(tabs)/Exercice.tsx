import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importer le hook de navigation

const exercises = [
  { id: "1", name: "Abdos", image: require("../../img/abdo.png"), route: "/(tabs)/abdoexo" },
  { id: "2", name: "Dorsaux", image: require("../../img/dos.png"), route: "/(tabs)/dosexo" }, // Pas encore défini
  { id: "3", name: "Biceps", image: require("../../img/biceps.png"), route: "/(tabs)/biceps" }, // Pas encore défini
  { id: "4", name: "Jambe", image: require("../../img/jambe.png"), route: "/(tabs)/jambeexo" },
  { id: "5", name: "Pectoraux", image: require("../../img/peck.png"), route: "/(tabs)peckexo" }, // Pas encore défini
];

export default function ExercisesScreen() {
  const router = useRouter(); // Initialiser le hook de navigation

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercises</Text>
        <View style={styles.upgradeBox}>
          <Ionicons name="barbell" size={24} color="white" />
          <Text style={styles.upgradeText}>Fitness & Musculation PRO</Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>MISE À NIVEAU MAINTENANT</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des exercices */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              if (item.route) {
              } else {
                alert("Cette section n'est pas encore disponible.");
              }
            }}
          >
            <Image source={item.image} style={styles.icon} />
            <Text style={styles.itemText}>{item.name}</Text>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        )}
      />

      <View style={styles.navBar}></View>
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
    backgroundColor: "#E64A19",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  upgradeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  upgradeText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  upgradeButton: {
    backgroundColor: "#D84315",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  upgradeButtonText: {
    color: "white",
    fontWeight: "bold",
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
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E64A19",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
  },
});