import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const peckExercises = [
  {
    id: "1",
    name: "Développé Couché Haltère",
    sets: 3,
    reps: "6-8",
    notes: "3 séries de 6-8 répétitions avec 2min30 de repos",
  },
  {
    id: "2",
    name: "Écartés Poulie Basse (hauteur hanche)",
    sets: 4,
    reps: "8-12",
    notes: "4 séries de 8-12 répétitions",
  },
  {
    id: "3",
    name: "Écartés Poulie Haute (au-dessus de la tête)",
    sets: 4,
    reps: "8-12",
    notes: "4 séries de 8-12 répétitions",
  },
];

export default function PeckExercises() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Programme Pectoraux</Text>
      <FlatList
        data={peckExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Ionicons name="barbell" size={24} color="#007AFF" />
            </View>
            <Text style={styles.exerciseDetails}>
              {item.sets} séries de {item.reps} répétitions
            </Text>
            <Text style={styles.exerciseNotes}>{item.notes}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Commencer l'entraînement</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  exerciseItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  exerciseDetails: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  exerciseNotes: {
    fontSize: 14,
    color: "#888",
  },
  startButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});