"use client"

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'; // Assurez-vous que ce chemin est correct

// Interface pour définir la structure d'un coach
interface Coach {
  id: string; // ID Firestore
  name: string;
  speciality: string;
  experience: number;
  rating: number;
  image: string;
  description: string;
  availability: boolean;
  email?: string; // Optionnel, si disponible dans vos données
}

export default function CoachScreen() {
  const [specialityFilter, setSpecialityFilter] = useState<string>('');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Récupération des coachs depuis Firestore
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        
        // Créer une requête pour obtenir les utilisateurs avec le rôle "coach"
        const utilisateursRef = collection(db, "utilisateurs");
        const q = query(utilisateursRef, where("role", "==", "coach"));
        const querySnapshot = await getDocs(q);
        
        const coachesData: Coach[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Adapter les champs selon votre structure de données
          coachesData.push({
            id: doc.id,
            name: data.nomComplet || data.name || "Coach sans nom",
            speciality: data.specialite || "Général",
            experience: data.experience || 1,
            rating: data.rating || 5,
            image: data.urlAvatar || data.image || "https://via.placeholder.com/150",
            description: data.description || "Aucune description disponible",
            availability: data.disponibilite !== undefined ? data.disponibilite : true,
            email: data.email
          });
        });
        
        setCoaches(coachesData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des coachs:", err);
        setError('Impossible de charger les coachs');
        setLoading(false);
      }
    };
    
    fetchCoaches();
  }, []);
  
  // Liste des spécialités uniques pour le filtre
  const specialities = [...new Set(coaches.map(coach => coach.speciality))];

  // Filtrer les coachs par spécialité
  const filteredCoaches = specialityFilter
    ? coaches.filter(coach => coach.speciality === specialityFilter)
    : coaches;

  // Afficher les étoiles selon la notation
  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text key={star} style={star <= rating ? styles.starFilled : styles.starEmpty}>
            ★
          </Text>
        ))}
        <Text style={styles.ratingText}>({rating})</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF6A88" />
        <Text style={styles.loadingText}>Chargement des coachs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            setCoaches([]);
          }}
        >
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nos Coachs Professionnels</Text>
      </View>
      
      {/* Filtres de spécialité */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterBtn,
            specialityFilter === '' && styles.activeFilterBtn
          ]}
          onPress={() => setSpecialityFilter('')}
        >
          <Text style={[
            styles.filterText,
            specialityFilter === '' && styles.activeFilterText
          ]}>Tous</Text>
        </TouchableOpacity>
        
        {specialities.map(speciality => (
          <TouchableOpacity
            key={speciality}
            style={[
              styles.filterBtn,
              specialityFilter === speciality && styles.activeFilterBtn
            ]}
            onPress={() => setSpecialityFilter(speciality)}
          >
            <Text style={[
              styles.filterText,
              specialityFilter === speciality && styles.activeFilterText
            ]}>{speciality}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Liste des coachs */}
      <FlatList
        data={filteredCoaches}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.coachesContent}
        renderItem={({ item }) => (
          <View style={styles.coachCard}>
            <View style={styles.cardHeader}>
              <Image
                source={{ uri: item.image }}
                style={styles.coachImage}
                defaultSource={require('../../assets/images/default-avatar.png')} // Assurez-vous que ce fichier existe
              />
              <View style={[
                styles.availabilityBadge,
                item.availability ? styles.availableIndicator : styles.unavailableIndicator
              ]}>
                <Text style={styles.availabilityText}>
                  {item.availability ? 'Disponible' : 'Indisponible'}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.coachName}>{item.name}</Text>
              <View style={styles.specialityContainer}>
                <Text style={styles.specialityText}>{item.speciality}</Text>
              </View>
              
              {renderStars(item.rating)}
              
              <Text style={styles.coachDescription}>{item.description}</Text>
              
              <View style={styles.experienceRow}>
                <Text style={styles.experienceText}>
                  {item.experience} ans d'expérience
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.profileButton,
                  !item.availability && styles.profileButtonDisabled
                ]}
                disabled={!item.availability}
              >
                <Text style={styles.profileButtonText}>
                  {item.availability ? 'Voir le profil' : 'Non disponible'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucun coach trouvé pour cette spécialité.
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterBtn: {
    backgroundColor: '#FF6A88',
  },
  filterText: {
    color: '#555',
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '600',
  },
  coachesContent: {
    padding: 20,
  },
  coachCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    position: 'relative',
  },
  coachImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  availabilityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availableIndicator: {
    backgroundColor: 'rgba(76, 217, 100, 0.85)',
  },
  unavailableIndicator: {
    backgroundColor: 'rgba(255, 59, 48, 0.85)',
  },
  availabilityText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  coachName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  specialityContainer: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  specialityText: {
    color: '#2196F3',
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starFilled: {
    color: '#FFC107',
    fontSize: 18,
  },
  starEmpty: {
    color: '#E0E0E0',
    fontSize: 18,
  },
  ratingText: {
    color: '#757575',
    marginLeft: 4,
  },
  coachDescription: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  experienceRow: {
    marginBottom: 16,
  },
  experienceText: {
    color: '#757575',
    fontSize: 14,
  },
  profileButton: {
    backgroundColor: '#FF6A88',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  profileButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
    textAlign: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF6A88',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});