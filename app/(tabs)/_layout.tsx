import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

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

function MyTabs() {
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

  return (
    <Tabs screenOptions={screenOptions}>
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
    </Tabs>
  );
}

export default function TabsLayout() {
  return <MyTabs />;
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