import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase/firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

const calculateBMR = (poids: number, taille: number, age: number, sexe: string): number => {
  if (sexe === 'homme') {
    return 10 * poids + 6.25 * taille - 5 * age + 5;
  } else {
    return 10 * poids + 6.25 * taille - 5 * age - 161;
  }
};

const getActivityMultiplier = (niveauActivite: string): number => {
  switch (niveauActivite) {
    case 'sedentaire': return 1.2;
    case 'legere': return 1.375;
    case 'moderee': return 1.55;
    case 'intense': return 1.725;
    default: return 1.2;  
  }
};

export const saveUserProfile = async (
  nomComplet: string,
  poids: string,
  taille: string,
  age: string,
  sexe: string,
  niveauActivite: string
) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Utilisateur non trouvé.');

  const poidsNum = parseFloat(poids);
  const tailleNum = parseFloat(taille);
  const ageNum = parseInt(age);

  const bmr = calculateBMR(poidsNum, tailleNum, ageNum, sexe);
  const caloriesNecessaires = bmr * getActivityMultiplier(niveauActivite);

  try {
    await setDoc(doc(db, 'utilisateurs', user.uid), {
      nomComplet,
      poids: poidsNum,
      taille: tailleNum,
      age: ageNum,
      sexe,
      niveauActivite,
      caloriesNecessaires,
      dateModification: new Date(),
    }, { merge: true });

    return caloriesNecessaires;
  } catch (error) {
    throw new Error((error as any).message || 'Erreur lors de l\'enregistrement.');
  }
};

export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Utilisateur non trouvé.');

  try {
    const docRef = doc(db, 'utilisateurs', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Aucune donnée trouvée pour cet utilisateur.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Erreur lors de la récupération des données.');
    } else {
      throw new Error('Erreur lors de la récupération des données.');
    }
  }
};

export const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0]; 
};

export interface Aliment {
  id: string;
  nom: string;
  calories: number;
  urlPhoto: string;
}

export interface MealCaloriesResult {
  meals: Aliment[];
  totalCalories: number;
}

export const fetchMealByDate = async (
  date: Date,
  mealType: "Petit-déjeuner" | "Déjeuner" | "Dîner" | "Collation"
): Promise<MealCaloriesResult> => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    const dateString = formatDateForQuery(date);
    
    const q = query(
      collection(db, "aliments"),
      where("utilisateurId", "==", currentUser.uid),
      where("Repas", "==", mealType)
    );

    const querySnapshot = await getDocs(q);
    const meals: Aliment[] = [];
    let totalCalories = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const alimDate = data.date ? new Date(data.date).toISOString().split('T')[0] : null;
      
      if (alimDate === dateString) {
        const calories = parseInt(data.calories || 0);
        totalCalories += calories;
        
        meals.push({
          id: doc.id,
          nom: data.nom || "Aliment sans nom",
          calories: calories,
          urlPhoto: data.urlPhoto || ""
        });
      }
    });

    return { meals, totalCalories };
  } catch (error) {
    console.error(`Erreur pour ${mealType}:`, error);
    throw error;
  }
};

export const fetchAllMealsByDate = async (date: Date) => {
  try {
    const breakfast = await fetchMealByDate(date, "Petit-déjeuner");
    const lunch = await fetchMealByDate(date, "Déjeuner");
    const dinner = await fetchMealByDate(date, "Dîner");
    const snack = await fetchMealByDate(date, "Collation");

    return {
      "Petit-déjeuner": breakfast,
      "Déjeuner": lunch,
      "Dîner": dinner,
      "Collation": snack
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des repas:", error);
    throw error;
  }
};

export const calculateCaloriesForDay = async (date: Date) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Aucun utilisateur connecté");
    }

    const userDoc = doc(db, "utilisateurs", currentUser.uid);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      throw new Error("Profil utilisateur non trouvé");
    }

    const userData = userSnap.data();
    const caloriesNecessaires = userData.caloriesNecessaires || 0;

    const meals = await fetchAllMealsByDate(date);
    
    const breakfastCalories = meals["Petit-déjeuner"].totalCalories;
    const lunchCalories = meals["Déjeuner"].totalCalories;
    const dinnerCalories = meals["Dîner"].totalCalories;
    const snackCalories = meals["Collation"].totalCalories;

    const totalConsumed = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;
    const caloriesRestantes = caloriesNecessaires - totalConsumed;

    return {
      caloriesTotales: caloriesNecessaires,
      caloriesRestantes,
      breakfastCalories,
      lunchCalories,
      dinnerCalories,
      snackCalories
    };
  } catch (error) {
    console.error("Erreur lors du calcul des calories :", error);
    throw error;
  }
};

export const calculateBurnedCalories = (steps: number): number => {
  const caloriesBruleesParPas = 0.05;
  return Math.round(steps * caloriesBruleesParPas);
};
