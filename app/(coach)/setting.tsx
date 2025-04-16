import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CoachSettings() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres Coach</Text>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="person" size={24} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Mon profil coach</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Informations professionnelles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Disponibilités</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Tarifs et services</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="people" size={24} color="#22c55e" />
          <Text style={styles.sectionTitle}>Gestion des clients</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Liste des clients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Demandes en attente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Notifications clients</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="fitness-center" size={24} color="#ef4444" />
          <Text style={styles.sectionTitle}>Programmes d'entraînement</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Mes programmes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Modèles d'exercices</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="restaurant" size={24} color="#eab308" />
          <Text style={styles.sectionTitle}>Plans nutritionnels</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Mes plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Bibliothèque d'aliments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Créer un plan</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="settings" size={24} color="#6b7280" />
          <Text style={styles.sectionTitle}>Préférences</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Facturation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Confidentialité</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    marginVertical: 4,
  },
});