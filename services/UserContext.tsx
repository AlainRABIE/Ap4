import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
  nomComplet?: string;
  departement?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Récupérer les informations utilisateur depuis Firestore
          const userDoc = doc(db, "utilisateurs", firebaseUser.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              nomComplet: userData.nomComplet || "Non renseigné",
              departement: userData.departement || "Non renseigné",
            });
          } else {
            // Si l'utilisateur n'existe pas dans Firestore, utilisez les données de Firebase Auth
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        }
      } else {
        setUser(null); // Déconnecter l'utilisateur
      }
    });

    return () => unsubscribe(); // Nettoyer l'abonnement
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};