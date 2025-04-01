import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface LegExercise {
  id: string;
  name: string;
  description: string;
  sets: string; // Séries
  reps: string; // Répétitions
}

const legExercises: LegExercise[] = [
  {
    id: "1",
    name: "Hack Squat",
    description: "Exercice pour renforcer les quadriceps avec une série dégressive.",
    sets: "3 séries",
    reps: "6-8 répétitions",
  },
  {
    id: "2",
    name: "Leg Curl",
    description: "Exercice pour travailler les ischio-jambiers.",
    sets: "6 séries",
    reps: "6-8 répétitions",
  },
  {
    id: "3",
    name: "Leg Extension",
    description: "Exercice pour isoler les quadriceps.",
    sets: "6 séries",
    reps: "6-8 répétitions",
  },
];

const LegExoPage: React.FC = () => {
  const renderExercise = ({ item }: { item: LegExercise }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <View style={styles.exerciseDetailsContainer}>
        <Text style={styles.exerciseDetail}>Séries : {item.sets}</Text>
        <Text style={styles.exerciseDetail}>Répétitions : {item.reps}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercices Jambes</Text>
      <FlatList
        data={legExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseCard: {
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6A88",
    marginBottom: 10,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  exerciseDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseDetail: {
    fontSize: 14,
    color: "#333",
  },
});

export default LegExoPage;