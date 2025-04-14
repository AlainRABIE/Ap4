"use client"

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  FlatList 
} from 'react-native';

// Interface pour définir la structure d'un coach
interface Coach {
  id: number;
  name: string;
  speciality: string;
  experience: number;
  rating: number;
  image: string;
  description: string;
  availability: boolean;
}

// Données fictives de coachs
const coachesData: Coach[] = [
  {
    id: 1,
    name: "Thomas Dubois",
    speciality: "Musculation",
    experience: 8,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Spécialiste en musculation et remise en forme avec 8 ans d'expérience.",
    availability: true
  },
  {
    id: 2,
    name: "Sophie Martin",
    speciality: "Yoga",
    experience: 10,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Instructrice de yoga certifiée avec une approche holistique du bien-être.",
    availability: true
  },
  {
    id: 3,
    name: "Karim Benzema",
    speciality: "Cardio",
    experience: 6,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Expert en entraînement cardiovasculaire et préparation physique.",
    availability: false
  },
  {
    id: 4,
    name: "Julie Dupont",
    speciality: "Nutrition sportive",
    experience: 12,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Nutritionniste spécialisée dans l'accompagnement des sportifs.",
    availability: true
  },
  {
    id: 5,
    name: "Marc Richard",
    speciality: "CrossFit",
    experience: 7,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Coach CrossFit certifié, passionné par le dépassement de soi.",
    availability: true
  },
  {
    id: 6,
    name: "Nadia Comaneci",
    speciality: "Pilates",
    experience: 15,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1506777549229-d918df45b010?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    description: "Experte en Pilates avec une approche thérapeutique et préventive.",
    availability: false
  }
];

export default function CoachScreen() {
  const [specialityFilter, setSpecialityFilter] = useState<string>('');
  
  // Liste des spécialités uniques pour le filtre
  const specialities = [...new Set(coachesData.map(coach => coach.speciality))];

  // Filtrer les coachs par spécialité
  const filteredCoaches = specialityFilter
    ? coachesData.filter(coach => coach.speciality === specialityFilter)
    : coachesData;

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
});