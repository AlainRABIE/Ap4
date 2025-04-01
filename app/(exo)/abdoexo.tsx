import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface AbdoExercise {
  id: string;
  name: string;
  description: string;
  sets: string; // Séries
  repsOrTime: string; // Répétitions ou temps
}

const abdoExercises: AbdoExercise[] = [
  {
    id: "1",
    name: "Crunch à la poulie",
    description: "Exercice pour renforcer les abdominaux supérieurs avec une poulie.",
    sets: "4 séries",
    repsOrTime: "8-10 répétitions",
  },
  {
    id: "2",
    name: "Planche maximale",
    description: "Maintenez la position de planche aussi longtemps que possible.",
    sets: "4 séries",
    repsOrTime: "Maximum de temps",
  },
  {
    id: "3",
    name: "Levée de jambes à la barre de traction",
    description: "Exercice pour travailler les abdominaux inférieurs.",
    sets: "4 séries",
    repsOrTime: "Maximum de répétitions",
  },
];

const AbdoExoPage: React.FC = () => {
  const renderExercise = ({ item }: { item: AbdoExercise }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <View style={styles.exerciseDetailsContainer}>
        <Text style={styles.exerciseDetail}>Séries : {item.sets}</Text>
        <Text style={styles.exerciseDetail}>
          Répétitions/Temps : {item.repsOrTime}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercices Abdominaux</Text>
      <FlatList
        data={abdoExercises}
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

export default AbdoExoPage;