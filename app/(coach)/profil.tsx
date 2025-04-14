"use client"

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { useRouter, useSearchParams } from 'next/navigation';

// Coach data (in a real app, this would be imported from a shared source)
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

// Using the same data as coach.tsx
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
  // More coaches data would be here
];

export default function CoachProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coachId = searchParams.get('id');
  
  // Find the coach with the matching ID
  const coach = coachesData.find(c => c.id.toString() === coachId);
  
  // If no coach is found, show a message
  if (!coach) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil du Coach</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Coach non trouvé</Text>
        </View>
      </View>
    );
  }

  // Render stars based on rating
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil du Coach</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coach.image }}
            style={styles.coachImage}
            resizeMode="cover"
          />
          <View style={[
            styles.availabilityBadge,
            coach.availability ? styles.availableIndicator : styles.unavailableIndicator
          ]}>
            <Text style={styles.availabilityText}>
              {coach.availability ? 'Disponible' : 'Indisponible'}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.coachName}>{coach.name}</Text>
          
          <View style={styles.specialityContainer}>
            <Text style={styles.specialityText}>{coach.speciality}</Text>
          </View>
          
          {renderStars(coach.rating)}
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Expérience</Text>
            <Text style={styles.sectionText}>
              {coach.experience} {coach.experience > 1 ? 'ans' : 'an'} d'expérience professionnelle
            </Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.sectionText}>{coach.description}</Text>
          </View>
          
          {coach.availability && (
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Prendre rendez-vous</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6A88',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  coachImage: {
    width: '100%',
    height: 300,
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
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
  detailsContainer: {
    padding: 20,
  },
  coachName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  specialityContainer: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  specialityText: {
    color: '#2196F3',
    fontSize: 14,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#FF6A88',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  contactButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#757575',
  },
});