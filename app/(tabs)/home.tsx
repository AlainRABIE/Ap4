import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pedometer } from "expo-sensors";
import { useRouter } from "expo-router";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const NutritionScreen = () => {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [streak, setStreak] = useState(3);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  // États pour les calories
  const [caloriesTotales, setCaloriesTotales] = useState(0);
  const [caloriesRestantes, setCaloriesRestantes] = useState(0);
  const [caloriesBrulees, setCaloriesBrulees] = useState(0);

  // État pour les calories du Petit-déjeuner
  const [breakfastCalories, setBreakfastCalories] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const startPedometer = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(available);

      if (available) {
        const subscription = Pedometer.watchStepCount((result) => {
          setSteps(result.steps);
        });

        return () => subscription && subscription.remove();
      }
    };

    startPedometer();
  }, []);

  // Appeler le service pour calculer les calories
  useEffect(() => {
    const fetchCalories = async () => {
      try {
        // Exemple de données utilisateur (remplacez-les par les vraies données)
        const poids = 70; // Poids en kg
        const taille = 175; // Taille en cm
        const age = 25; // Âge en années
        const sexe = "homme"; // Sexe : "homme" ou "femme"
        const niveauActivite = "moderee"; // Niveau d'activité

        // Exemple de calcul des calories (remplacez par votre logique réelle)
        const calories = 2000; // Exemple : 2000 kcal
        setCaloriesTotales(calories);
        setCaloriesRestantes(calories - 400); // Exemple : 400 kcal consommées
        setCaloriesBrulees(300); // Exemple : 300 kcal brûlées
      } catch (error) {
        console.error("Erreur lors du calcul des calories :", error);
      }
    };

    fetchCalories();
  }, []);

  // Récupérer les calories du Petit-déjeuner depuis Firebase
  useEffect(() => {
    const fetchBreakfastCalories = async () => {
      try {
        const db = getFirestore();
        const userId = "1nH8cRhzzQYWIi3LTDD6Bx3SYLi2"; // Remplacez par l'ID utilisateur connecté
        const q = query(
          collection(db, "aliments"),
          where("utilisateurId", "==", userId),
          where("Repas", "==", "Petit-déjeuner") // Filtrer par type de repas
        );

        const querySnapshot = await getDocs(q);
        let totalCalories = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalCalories += parseInt(data.calories || 0); // Ajouter les calories
        });

        setBreakfastCalories(totalCalories); // Mettre à jour l'état avec les calories totales
      } catch (error) {
        console.error("Erreur lors de la récupération des calories :", error);
      }
    };

    fetchBreakfastCalories();
  }, []);

  const handleAddGlass = () => {
    if (waterGlasses < 8) setWaterGlasses(waterGlasses + 1);
  };

  const handleRemoveGlass = () => {
    if (waterGlasses > 0) setWaterGlasses(waterGlasses - 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dayNavigationBar}>
          <TouchableOpacity
            onPress={() =>
              setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() - 1)))
            }
          >
            <Ionicons name="chevron-back-outline" size={28} color="#4FC3F7" />
          </TouchableOpacity>
          <Text style={styles.dayNavigationText}>
            {currentDay.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setCurrentDay(new Date(currentDay.setDate(currentDay.getDate() + 1)))
            }
          >
            <Ionicons name="chevron-forward-outline" size={28} color="#4FC3F7" />
          </TouchableOpacity>
          {streak > 0 && (
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={24} color="#FF6A88" />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>

        {/* Rectangle pour le Petit-déjeuner */}
        <View style={styles.breakfastContainer}>
          <Text style={styles.breakfastTitle}>Petit-déjeuner</Text>
          <Text style={styles.breakfastCalories}>{breakfastCalories} kcal</Text>
        </View>

        <View style={[styles.section, styles.circlesContainer]}>
          <LinearGradient colors={["#FF9A8B", "#FF6A88"]} style={styles.circleProgress}>
            <Text style={styles.circleBigNumber}>{caloriesTotales}</Text>
            <Text style={styles.circleLabel}>Calories</Text>
          </LinearGradient>
          <LinearGradient colors={["#A18CD1", "#FBC2EB"]} style={styles.circleProgress}>
            <Text style={styles.circleBigNumber}>{caloriesRestantes}</Text>
            <Text style={styles.circleLabel}>Restantes</Text>
          </LinearGradient>
          <LinearGradient colors={["#84FAB0", "#8FD3F4"]} style={styles.circleProgress}>
            <Text style={styles.circleBigNumber}>{caloriesBrulees}</Text>
            <Text style={styles.circleLabel}>Brûlées</Text>
          </LinearGradient>
        </View>

        <View style={[styles.section, styles.waterContainer]}>
          <Text style={styles.waterTitle}>Verres d'eau</Text>
          <View style={styles.waterGlasses}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < waterGlasses ? "water" : "water-outline"}
                size={40}
                color={index < waterGlasses ? "#4FC3F7" : "#B0BEC5"}
                style={styles.waterGlassIcon}
              />
            ))}
          </View>
          <View style={styles.waterButtons}>
            <TouchableOpacity onPress={handleRemoveGlass} style={styles.waterButton}>
              <Ionicons name="remove-circle-outline" size={40} color="#FF6A88" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddGlass} style={styles.waterButton}>
              <Ionicons name="add-circle-outline" size={40} color="#4FC3F7" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  breakfastContainer: {
    backgroundColor: "#FF6A88",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  section: {
    marginVertical: 20,
  },
  breakfastTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  breakfastCalories: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  dayNavigationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
  },
  dayNavigationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6A88",
    marginLeft: 5,
  },
  circlesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  circleProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  circleBigNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  circleLabel: {
    fontSize: 14,
    color: "#fff",
  },
  waterContainer: {
    paddingHorizontal: 16,
  },
  waterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  waterGlasses: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  waterGlassIcon: {
    marginHorizontal: 5,
  },
  waterButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  waterButton: {
    marginHorizontal: 10,
  },
});

export default NutritionScreen;