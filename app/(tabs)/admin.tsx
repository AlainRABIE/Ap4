import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tableau de bord Admin</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>35</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Coachs</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>86</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity style={styles.quickAccessButton}>
            <Ionicons name="people" size={24} color="#FF6A88" />
            <Text style={styles.quickAccessText}>Gestion des utilisateurs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessButton}>
            <Ionicons name="school" size={24} color="#FF6A88" />
            <Text style={styles.quickAccessText}>Liste des coachs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAccessButton}>
            <Ionicons name="settings" size={24} color="#FF6A88" />
            <Text style={styles.quickAccessText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Activité récente</Text>
        
        <View style={styles.activityFeed}>
          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View>
              <Text style={styles.activityText}>Nouveau coach ajouté</Text>
              <Text style={styles.activityTime}>Il y a 2 heures</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View>
              <Text style={styles.activityText}>5 nouveaux utilisateurs inscrits</Text>
              <Text style={styles.activityTime}>Il y a 3 heures</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View>
              <Text style={styles.activityText}>Mise à jour du système</Text>
              <Text style={styles.activityTime}>Il y a 1 jour</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FF6A88',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6A88',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  quickAccessContainer: {
    marginBottom: 24,
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickAccessText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  activityFeed: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6A88',
    marginRight: 12,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});