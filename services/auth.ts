import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../firebase/firebaseConfig';

// Initialisation de Firebase Auth et Firestore
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Inscription d'un nouvel utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @param nomComplet - Nom complet de l'utilisateur
 * @param departement - Département de l'utilisateur
 * @returns Les informations de l'utilisateur inscrit
 */
export const register = async (email: string, password: string, nomComplet: string, departement: string) => {
  try {
    // 1️⃣ Création de l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Utilisateur inscrit avec succès :', user);

    // 2️⃣ Ajout des informations de l'utilisateur dans Firestore
    await setDoc(doc(db, 'utilisateurs', user.uid), {
      id: user.uid,
      email: user.email,
      nomComplet: nomComplet,
      departement: departement,
      role: 'utilisateur', // Rôle par défaut
      dateCreation: new Date(),
      derniereConnexion: new Date(),
      urlAvatar: '', // Optionnel, l'utilisateur pourra ajouter une photo plus tard
    });

    return user;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription :', error.message);
    throw new Error(error.message);
  }
};

/**
 * Connexion d'un utilisateur existant
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Les informations de l'utilisateur connecté
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Utilisateur connecté avec succès :', userCredential.user);

    return userCredential.user;
  } catch (error: any) {
    console.error('Erreur lors de la connexion :', error.message);
    throw new Error(error.message);
  }
};
