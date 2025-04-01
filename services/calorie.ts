import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase/firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

// Fonction pour calculer le BMR selon la formule de Mifflin-St Jeor
const calculateBMR = (poids: number, taille: number, age: number, sexe: string): number => {
  if (sexe === 'homme') {
    return 10 * poids + 6.25 * taille - 5 * age + 5;
  } else {
    return 10 * poids + 6.25 * taille - 5 * age - 161;
  }
};

// Fonction pour récupérer le multiplicateur d'activité
const getActivityMultiplier = (niveauActivite: string): number => {
  switch (niveauActivite) {
    case 'sedentaire': return 1.2;
    case 'legere': return 1.375;
    case 'moderee': return 1.55;
    case 'intense': return 1.725;
    default: return 1.2;  // Sédentaire par défaut
  }
};

// Fonction pour enregistrer ou mettre à jour les données de l'utilisateur dans Firestore
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

  // Calcul du BMR
  const bmr = calculateBMR(poidsNum, tailleNum, ageNum, sexe);
  // Calcul des calories nécessaires
  const caloriesNecessaires = bmr * getActivityMultiplier(niveauActivite);

  try {
    // Enregistrement des données dans Firestore
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

// Fonction pour récupérer les informations de l'utilisateur depuis Firestore
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
