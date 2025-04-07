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
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

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

  // États pour les calories par repas
  const [breakfastCalories, setBreakfastCalories] = useState(0);
  const [lunchCalories, setLunchCalories] = useState(0);
  const [dinnerCalories, setDinnerCalories] = useState(0);
  const [snackCalories, setSnackCalories] = useState(0);

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

  useEffect(() => {
    const fetchCalories = async () => {
      try {
        const db = getFirestore();
        const userId = "1V35C7tRzUceRsXh3WqEv2qOCTJ3"; // Votre ID utilisateur
        const userDoc = doc(db, "utilisateurs", userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const caloriesNecessaires = userData.caloriesNecessaires || 0;
          
          // Calcul des calories totales consommées
          const totalConsumed = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
          
          setCaloriesTotales(caloriesNecessaires);
          setCaloriesRestantes(caloriesNecessaires - totalConsumed);
          const caloriesBruleesParPas = 0.04; // Estimation moyenne des calories brûlées par pas
          const caloriesBrulees = Math.round(steps * caloriesBruleesParPas);
          setCaloriesBrulees(caloriesBrulees);
        }
      } catch (error) {
        console.error("Erreur lors du calcul des calories :", error);
      }
    };

    fetchCalories();
  }, [steps, breakfastCalories, lunchCalories, dinnerCalories, snackCalories, currentDay]);

  const formatDate = (date: Date) => {
    try {
      const d = new Date(date);
      return d.toISOString(); // Format complet pour correspondre à new Date().toISOString()
    } catch (error) {
      console.error('Erreur format date:', error);
      return '';
    }
  };

  const fetchMealCalories = async (mealType: unknown, setMealCalories: { (value: React.SetStateAction<number>): void }) => {
    try {
      const db = getFirestore();
      const userId = "1nH8cRhzzQYWIi3LTDD6Bx3SYLi2";
      
      const startOfDay = new Date(currentDay);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Requête simplifiée en attendant la création de l'index
      const q = query(
        collection(db, "aliments"),
        where("utilisateurId", "==", userId),
        where("Repas", "==", mealType)
      );

      const querySnapshot = await getDocs(q);
      let totalCalories = 0;

      // Filtrage manuel des dates
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const mealDate = new Date(data.date);
        if (mealDate.toDateString() === startOfDay.toDateString()) {
          totalCalories += parseInt(data.calories || 0);
        }
      });

      console.log(`Total calories pour ${mealType}:`, totalCalories);
      setMealCalories(totalCalories);
    } catch (error) {
      console.error(`Erreur récupération calories pour ${mealType}:`, error);
    }
  };

  const handleDateChange = async (newDate: Date) => {
    try {
      // S'assurer que la date est correctement initialisée
      const date = new Date(newDate);
      date.setHours(0, 0, 0, 0);
      console.log('Nouvelle date sélectionnée:', formatDate(date));
      
      setCurrentDay(date);
      
      // Réinitialiser les calories
      setBreakfastCalories(0);
      setLunchCalories(0);
      setDinnerCalories(0);
      setSnackCalories(0);

      // Récupérer immédiatement les nouvelles données
      await Promise.all([
        fetchMealCalories("Petit-déjeuner", setBreakfastCalories),
        fetchMealCalories("Déjeuner", setLunchCalories),
        fetchMealCalories("Dîner", setDinnerCalories),
        fetchMealCalories("Collation", setSnackCalories)
      ]);
    } catch (error) {
      console.error('Erreur lors du changement de date:', error);
    }
  };

  // Récupérer les calories pour tous les repas
  useEffect(() => {
    fetchMealCalories("Petit-déjeuner", setBreakfastCalories);
    fetchMealCalories("Déjeuner", setLunchCalories);
    fetchMealCalories("Dîner", setDinnerCalories);
    fetchMealCalories("Collation", setSnackCalories);
  }, [currentDay]);

  const handleAddGlass = () => {
    if (waterGlasses < 8) setWaterGlasses(waterGlasses + 1);
  };

  const handleRemoveGlass = () => {
    if (waterGlasses > 0) setWaterGlasses(waterGlasses - 1);
  };
  
  const navigateToAddMeal = (mealType: string) => {
    switch (mealType) {
      case "Déjeuner":
        router.push("/(calorie)/AddMidi");
        break;
      case "Dîner":
        router.push("/(calorie)/AddSoir");
        break;
      default:
        router.push({
          pathname: "/(calorie)/Add",
          params: { mealType }
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.dayNavigationBar}>
          <TouchableOpacity
            onPress={() => {
              const newDate = new Date(currentDay);
              newDate.setDate(currentDay.getDate() - 1);
              handleDateChange(newDate);
            }}
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
            onPress={() => {
              const newDate = new Date(currentDay);
              newDate.setDate(currentDay.getDate() + 1);
              handleDateChange(newDate);
            }}
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

        <View style={styles.mealsSection}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealsSectionTitle}>Repas</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push("/Add")}
            >
              <Ionicons name="add-circle" size={30} color="#FF6A88" />
            </TouchableOpacity>
          </View>
          
          {/* Petit-déjeuner */}
          <TouchableOpacity 
            style={[styles.mealContainer, styles.breakfastContainer]}
            onPress={() => navigateToAddMeal("Petit-déjeuner")}
          >
            <View style={styles.mealIconContainer}>
              <Ionicons name="sunny-outline" size={30} color="#fff" />
            </View>
            <View style={styles.mealContent}>
              <Text style={styles.mealTitle}>Petit-déjeuner</Text>
              <Text style={styles.mealCalories}>{breakfastCalories} kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Déjeuner */}
          <TouchableOpacity 
            style={[styles.mealContainer, styles.lunchContainer]}
            onPress={() => navigateToAddMeal("Déjeuner")}
          >
            <View style={styles.mealIconContainer}>
              <Ionicons name="restaurant-outline" size={30} color="#fff" />
            </View>
            <View style={styles.mealContent}>
              <Text style={styles.mealTitle}>Déjeuner</Text>
              <Text style={styles.mealCalories}>{lunchCalories} kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Dîner */}
          <TouchableOpacity 
            style={[styles.mealContainer, styles.dinnerContainer]}
            onPress={() => navigateToAddMeal("Dîner")}
          >
            <View style={styles.mealIconContainer}>
              <Ionicons name="moon-outline" size={30} color="#fff" />
            </View>
            <View style={styles.mealContent}>
              <Text style={styles.mealTitle}>Dîner</Text>
              <Text style={styles.mealCalories}>{dinnerCalories} kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Collation */}
          <TouchableOpacity 
            style={[styles.mealContainer, styles.snackContainer]}
            onPress={() => navigateToAddMeal("Collation")}
          >
            <View style={styles.mealIconContainer}>
              <Ionicons name="ice-cream-outline" size={30} color="#fff" />
            </View>
            <View style={styles.mealContent}>
              <Text style={styles.mealTitle}>Collation</Text>
              <Text style={styles.mealCalories}>{snackCalories} kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
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
  section: {
    marginVertical: 20,
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
  mealsSection: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  mealContainer: {
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealIconContainer: {
    marginRight: 15,
  },
  mealContent: {
    flex: 1,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  mealCalories: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  breakfastContainer: {
    backgroundColor: "#FF6A88",
  },
  lunchContainer: {
    backgroundColor: "#4FC3F7",
  },
  dinnerContainer: {
    backgroundColor: "#673AB7",
  },
  snackContainer: {
    backgroundColor: "#8BC34A",
  },
});

export default NutritionScreen;