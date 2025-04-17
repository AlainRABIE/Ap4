"use client";

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/firebaseConfig'; // Assurez-vous que ce chemin est correct

export default function PlanningScreen() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Statuts possibles: 0 = non défini, 1 = disponible, 2 = occupé
  const STATUS = {
    UNDEFINED: 0,
    AVAILABLE: 1,
    BUSY: 2
  };

  const getDatesForSelectedWeek = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const startDate = new Date(today);
    
    startDate.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); 
    startDate.setDate(startDate.getDate() + (currentWeekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Générer des créneaux horaires de 8h à 20h
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  };

  const dates = getDatesForSelectedWeek();
  const timeSlots = getTimeSlots();
  
  // Initialiser l'état des disponibilités (0 = non défini, 1 = disponible, 2 = occupé)
  const [availability, setAvailability] = useState(() => {
    return timeSlots.map(() => Array(7).fill(STATUS.UNDEFINED));
  });

  // Gérer le cycle des statuts pour un créneau
  const toggleStatus = (timeIndex: number, dateIndex: number) => {
    const newAvailability = [...availability];
    // Faire tourner le statut: non défini -> disponible -> occupé -> non défini
    const currentStatus = newAvailability[timeIndex][dateIndex];
    const nextStatus = (currentStatus + 1) % 3;
    newAvailability[timeIndex][dateIndex] = nextStatus;
    setAvailability(newAvailability);
  };

  // Naviguer vers la semaine précédente
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  // Naviguer vers la semaine suivante
  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  // Retourner à la semaine actuelle
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  // Formatage de date pour l'affichage
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Charger les disponibilités depuis Firebase
  const loadAvailabilities = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour accéder à vos disponibilités');
        return;
      }

      // Initialiser un tableau vide pour les disponibilités
      const newAvailability = timeSlots.map(() => Array(7).fill(STATUS.UNDEFINED));

      // Récupérer toutes les disponibilités pour cette semaine
      const disponibiliteCollection = collection(db, 'disponibilite');
      
      // Pour chaque date de la semaine actuelle
      for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
        const currentDate = dates[dateIndex];
        
        // Pour chaque créneau horaire
        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
          const timeSlot = timeSlots[timeIndex];
          
          // Construire une date précise pour ce créneau (date + heure)
          const slotDateTime = new Date(currentDate);
          const [hours, minutes] = timeSlot.split(':');
          slotDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10) || 0, 0, 0);
          
          // Créer une requête pour trouver la disponibilité pour cette date et heure précises
          const q = query(
            disponibiliteCollection,
            where('dates', '==', Timestamp.fromDate(slotDateTime))
          );
          
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // Si on trouve une entrée, on prend son statut de disponibilité
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              newAvailability[timeIndex][dateIndex] = data.dispo === 0 ? STATUS.BUSY : STATUS.AVAILABLE;
            });
          }
        }
      }
      
      setAvailability(newAvailability);
      
    } catch (error) {
      console.error('Erreur lors du chargement des disponibilités:', error);
      Alert.alert('Erreur', 'Impossible de charger les disponibilités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
  }, [currentWeekOffset]);
  const saveAvailability = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour enregistrer vos disponibilités');
        return;
      }

      for (let dateIndex = 0; dateIndex < dates.length; dateIndex++) {
        const currentDate = dates[dateIndex];
        const cleanDate = new Date(currentDate);
        cleanDate.setHours(0, 0, 0, 0);
        
        const availableHours = [];
        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
          if (availability[timeIndex][dateIndex] === STATUS.AVAILABLE) {
            availableHours.push(timeSlots[timeIndex]);
          }
        }

        // Créer un ID pour ce document basé sur la date et l'ID utilisateur
        const docId = `${user.uid}_${cleanDate.toISOString().split('T')[0]}`;
        
        // Si des heures sont disponibles pour cette date, les enregistrer
        if (availableHours.length > 0) {
          await setDoc(doc(db, 'disponibilite', docId), {
            coach: doc(db, 'utilisateurs', user.uid), // Référence à l'utilisateur coach
            dates: Timestamp.fromDate(cleanDate),
            dispo: availableHours // Tableau des heures disponibles
          });
        } else {
          // Si aucune heure n'est disponible pour cette date, définir dispo à 0
          await setDoc(doc(db, 'disponibilite', docId), {
            coach: doc(db, 'utilisateurs', user.uid), // Référence à l'utilisateur coach
            dates: Timestamp.fromDate(cleanDate),
            dispo: [] // Tableau vide pour indiquer qu'aucune heure n'est disponible
          });
        }
      }
      
      Alert.alert('Succès', 'Vos disponibilités ont été enregistrées !');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des disponibilités:', error);
      Alert.alert('Erreur', 'Un problème est survenu lors de l\'enregistrement des disponibilités');
    } finally {
      setLoading(false);
    }
  };

  const getCellStyle = (status: any) => {
    switch(status) {
      case STATUS.AVAILABLE:
        return styles.availableCell;
      case STATUS.BUSY:
        return styles.busyCell;
      default:
        return {};
    }
  };

  // Texte à afficher selon le statut
  const getCellText = (status: any) => {
    switch(status) {
      case STATUS.AVAILABLE:
        return '✓';
      case STATUS.BUSY:
        return '✗';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planning de Disponibilités</Text>
      
      {/* Navigation entre les semaines */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>◀ Semaine précédente</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToCurrentWeek} style={styles.currentWeekButton}>
          <Text style={styles.navButtonText}>Aujourd'hui</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Text style={styles.navButtonText}>Semaine suivante ▶</Text>
        </TouchableOpacity>
      </View>
      
      {/* Affichage de la période */}
      <Text style={styles.periodText}>
        {formatMonthYear(dates[0])}
        {dates[0].getMonth() !== dates[6].getMonth() ? 
          ` - ${formatMonthYear(dates[6])}` : 
          ''
        }
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Chargement des disponibilités...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {/* En-tête du tableau */}
            <View style={styles.headerRow}>
              <View style={styles.headerCell}>
                <Text style={styles.headerText}>Horaire</Text>
              </View>
              {dates.map((date, index) => (
                <View key={index} style={[
                  styles.headerCell,
                  new Date().toDateString() === date.toDateString() ? styles.todayColumn : {}
                ]}>
                  <Text style={styles.headerText}>{formatDate(date)}</Text>
                </View>
              ))}
            </View>
            
            {/* Lignes du tableau */}
            {timeSlots.map((time, timeIndex) => (
              <View key={timeIndex} style={styles.row}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
                {dates.map((date, dateIndex) => (
                  <TouchableOpacity 
                    key={dateIndex}
                    style={[
                      styles.cell,
                      new Date().toDateString() === date.toDateString() ? styles.todayColumn : {},
                      getCellStyle(availability[timeIndex][dateIndex])
                    ]}
                    onPress={() => toggleStatus(timeIndex, dateIndex)}
                  >
                    <Text style={availability[timeIndex][dateIndex] === STATUS.BUSY ? styles.busyText : {}}>
                      {getCellText(availability[timeIndex][dateIndex])}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.undefinedLegend}></View>
          <Text style={styles.legendText}>Non défini</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.availableLegend}></View>
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.busyLegend}></View>
          <Text style={styles.legendText}>Occupé</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]}
        onPress={saveAvailability}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enregistrement..." : "Enregistrer les disponibilités"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  currentWeekButton: {
    backgroundColor: '#e5e7eb',
    padding: 8,
    borderRadius: 4,
  },
  periodText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    width: 90,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  timeCell: {
    width: 90,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 90,
    height: 40,
    padding: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayColumn: {
    backgroundColor: '#f0f9ff',  // Légère teinte bleue pour aujourd'hui
  },
  availableCell: {
    backgroundColor: '#d1fae5', // Vert clair
  },
  busyCell: {
    backgroundColor: '#fee2e2', // Rouge clair
  },
  busyText: {
    color: '#b91c1c', // Rouge foncé pour le X
  },
  timeText: {
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  undefinedLegend: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  availableLegend: {
    width: 16,
    height: 16,
    backgroundColor: '#d1fae5', // Vert clair
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  busyLegend: {
    width: 16,
    height: 16,
    backgroundColor: '#fee2e2', // Rouge clair
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3b82f6',
  },
});