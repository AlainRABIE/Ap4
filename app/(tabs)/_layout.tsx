import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../../services/auth';
import app from '../../firebase/firebaseConfig';

function TabBarIcon({ name, color, size, focused }: { 
  name: keyof typeof Ionicons.glyphMap; 
  color: string; 
  size: number;
  focused: boolean;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons 
        name={name} 
        size={size}
        color={color} 
      />
      {focused && <View style={styles.indicatorBar} />}
    </View>
  );
}

function MyTabs({ userRole }: { userRole: string | null }) {
  console.log("Rôle utilisateur actuel:", userRole); // Vérifiez cette valeur dans la console
  
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      position: "absolute" as const,
      left: 24,
      right: 24,
      bottom: 16,
      elevation: 0,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 0,
      borderRadius: 30,
      height: 60,
    },
    tabBarActiveTintColor: "#FF6A88",
    tabBarInactiveTintColor: "#B0BEC5",
  };

  // Si l'utilisateur est admin, afficher UNIQUEMENT planning et client
  if (userRole === 'admin') {
    console.log("Interface admin activée"); // Debug log
    return (
      <Tabs screenOptions={screenOptions} initialRouteName="planning">
        <Tabs.Screen
          name="planning"
          options={{
            title: "Planning",
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => 
              <TabBarIcon name="calendar" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="client"
          options={{
            title: "Client",
            headerShown: false,
            tabBarIcon: ({ size, color, focused }) => 
              <TabBarIcon name="people" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="home"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="Exercice"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="coach"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="chrono"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="recette"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="profil"
          options={{ href: null }}
        />
      </Tabs>
    );
  }

  // Interface utilisateur standard (par défaut)
  return (
    <Tabs screenOptions={screenOptions} initialRouteName="home">
      <Tabs.Screen
        name="Exercice"
        options={{
          title: "Exercice",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="barbell" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="body-outline" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="home" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chrono"
        options={{
          title: "Chrono",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="timer-outline" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recette"
        options={{
          title: "Recette",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="book" size={size} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="person" size={size} color={color} focused={focused} />,
        }}
      />
      {/* Ces écrans existent mais ne sont pas visibles dans la tab bar */}
      <Tabs.Screen
        name="planning"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="client"
        options={{ href: null }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log("Utilisateur connecté:", user.uid);
          const userData = await getUserData(user.uid);
          console.log("Données utilisateur:", userData);
          // Ajouter une log explicite pour le rôle
          console.log("Rôle détecté:", userData.role);
          setUserRole(userData.role);
        } else {
          console.log("Aucun utilisateur connecté");
          setUserRole(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle utilisateur:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return <MyTabs userRole={userRole} />;
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    position: "relative",
  },
  indicatorBar: {
    position: "absolute",
    bottom: -10,
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF6A88",
  }
});