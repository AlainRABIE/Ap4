import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase/firebaseConfig';

// Initialisation de Firebase Auth
const auth = getAuth(app);

/**
 * Inscription d'un nouvel utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe de l'utilisateur
 * @returns Les informations de l'utilisateur inscrit
 */
export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Utilisateur inscrit avec succès :', userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription :', error.message);
    throw new Error(error.message);
  }
};

/**
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
