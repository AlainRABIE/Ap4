import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '../../services/auth';
import app from '../../firebase/firebaseConfig';

function TabBarIcon({ name, color, size, focused, iconType = "ionicon" }: { 
  name: string; 
  color: string; 
  size: number;
  focused: boolean;
  iconType?: "ionicon" | "material";
}) {
  return (
    <View style={styles.iconContainer}>
      {iconType === "ionicon" ? (
        <Ionicons 
          name={name as any} 
          size={size}
          color={color} 
        />
      ) : (
        <MaterialIcons 
          name={name as any} 
          size={size}
          color={color} 
        />
      )}
      {focused && <View style={styles.indicatorBar} />}
    </View>
  );
}

function MyTabs({ userRole }: { userRole: string | null }) {
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

  if (userRole === "admin") {
    return (
      <Tabs screenOptions={screenOptions} initialRouteName="admin">
        <Tabs.Screen
          name="admin"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="home" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="Listutilisateur"
          options={{
            title: "Utilisateurs",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="people" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="Listcoach"
          options={{
            title: "Coachs",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="school" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profilcoach"
          options={{
            title: "Profil",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="person" size={size} color={color} focused={focused} />,
          }}
        />
        
        {/* Hidden screens */}
        <Tabs.Screen name="Exercice" options={{ href: null }} />
        <Tabs.Screen name="coach" options={{ href: null }} />
        <Tabs.Screen name="home" options={{ href: null }} />
        <Tabs.Screen name="chrono" options={{ href: null }} />
        <Tabs.Screen name="recette" options={{ href: null }} />
        <Tabs.Screen name="profil" options={{ href: null }} />
        <Tabs.Screen name="planning" options={{ href: null }} />
        <Tabs.Screen name="client" options={{ href: null }} />
        <Tabs.Screen name="coachlist" options={{ href: null }} />
      </Tabs>
    );
  }
  
  else if (userRole === "coach") {
    return (
      <Tabs screenOptions={screenOptions} initialRouteName="profilcoach">
        <Tabs.Screen
          name="profilcoach"
          options={{
            title: "Profil",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="person" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="programmeclient"
          options={{
            title: "Programmes",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="list-outline" size={size} color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="seance"
          options={{
            title: "Séances",
            tabBarIcon: ({ size, color, focused }) => <TabBarIcon name="calendar-outline" size={size} color={color} focused={focused} />,
          }}
        />
        
        {/* Hidden screens */}
        <Tabs.Screen name="Exercice" options={{ href: null }} />
        <Tabs.Screen name="coach" options={{ href: null }} />
        <Tabs.Screen name="home" options={{ href: null }} />
        <Tabs.Screen name="chrono" options={{ href: null }} />
        <Tabs.Screen name="recette" options={{ href: null }} />
        <Tabs.Screen name="profil" options={{ href: null }} />
        <Tabs.Screen name="planning" options={{ href: null }} />
        <Tabs.Screen name="client" options={{ href: null }} />
        <Tabs.Screen name="admin" options={{ href: null }} />
        <Tabs.Screen name="coachlist" options={{ href: null }} />
      </Tabs>
    );
  }

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

      {/* Hidden screens */}
      <Tabs.Screen name="planning" options={{ href: null }} />
      <Tabs.Screen name="client" options={{ href: null }} />
      <Tabs.Screen name="profilcoach" options={{ href: null }} />
      <Tabs.Screen name="programmeclient" options={{ href: null }} />
      <Tabs.Screen name="seance" options={{ href: null }} />
      <Tabs.Screen name="admin" options={{ href: null }} />
      <Tabs.Screen name="coachlist" options={{ href: null }} />
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
          setUserRole(userData.role); 
        } else {
          console.log("Aucun utilisateur connecté");
          setUserRole(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
});