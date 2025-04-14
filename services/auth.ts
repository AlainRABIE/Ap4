import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
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
 * @returns Les informations complètes de l'utilisateur connecté (Firebase Auth + données Firestore)
 */
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Utilisateur connecté avec succès :', user);
    
    // Récupération des données utilisateur depuis Firestore, y compris le rôle
    const userDocRef = doc(db, 'utilisateurs', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("Données utilisateur introuvables");
    }
    
    const userData = userDoc.data();
    
    // Mise à jour de la date de dernière connexion
    await setDoc(userDocRef, { derniereConnexion: new Date() }, { merge: true });
    
    // Retourner l'objet utilisateur Firebase Auth et les données Firestore
    return {
      authUser: user,
      userData: userData
    };
  } catch (error: any) {
    console.error('Erreur lors de la connexion :', error.message);
    throw new Error(error.message);
  }
};

/**
 * Récupère les informations utilisateur stockées dans Firestore
 * @param userId - ID de l'utilisateur
 * @returns Les données utilisateur incluant le rôle
 */
export const getUserData = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'utilisateurs', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("Données utilisateur introuvables");
    }
    
    return userDoc.data();
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données utilisateur :', error.message);
    throw new Error(error.message);
  }
};