import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import * as Notifications from 'expo-notifications'; // Désactivation des notifications
import { Pedometer } from 'expo-sensors';
import { auth } from '../../firebase/firebaseConfig'; // Assurez-vous que ce chemin est correct

// Configuration des notifications commentée pour éviter les avertissements
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

export default function Settings() {
  const [units, setUnits] = useState('metric');
  const [dailyReminder, setDailyReminder] = useState(false);
  const [mealReminder, setMealReminder] = useState(false);
  const [weightReminder, setWeightReminder] = useState(false);
  const [waterReminder, setWaterReminder] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [achievementNotif, setAchievementNotif] = useState(false);
  const [premiumEnabled, setPremiumEnabled] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);

  useEffect(() => {
    checkPedometerPermission();
  }, []);

  // Fonction pour envoyer un email de demande pour devenir coach
  const sendCoachRequest = async () => {
    try {
      // Récupération des informations de l'utilisateur connecté
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Erreur", "Vous devez être connecté pour faire cette demande");
        return;
      }
      
      // Préparation du contenu de l'email
      const subject = encodeURIComponent("Demande pour devenir coach");
      const body = encodeURIComponent(
        `Bonjour,\n\n` +
        `Je souhaite devenir coach sur l'application.\n\n` +
        `Informations de l'utilisateur :\n` +
        `- Email: ${user.email}\n` +
        `- ID Utilisateur: ${user.uid}\n\n` +
        `Merci de me contacter pour plus d'informations sur mes compétences et expériences.\n\n` +
        `Cordialement,\n${user.displayName || user.email}`
      );
      
      // Construction de l'URL mailto
      const mailtoUrl = `mailto:rabie.alain001@gmail.com?subject=${subject}&body=${body}`;
      
      // Vérification que le lien peut être ouvert
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      
      if (!canOpen) {
        throw new Error("Impossible d'ouvrir l'application de messagerie");
      }
      
      // Ouverture de l'application de messagerie par défaut
      await Linking.openURL(mailtoUrl);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      Alert.alert(
        "Erreur", 
        "Impossible d'ouvrir l'application de messagerie. Veuillez envoyer un email manuellement à rabie.alain001@gmail.com"
      );
    }
  };

  const checkPedometerPermission = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        setStepCount(steps);

        Pedometer.watchStepCount(result => {
          setStepCount(result.steps);
        });
      }
    } catch (error) {
      console.log('Erreur podomètre:', error);
    }
  };

  // Fonction pour demander les permissions
  async function requestPermissions() {
    // Fonction désactivée pour éviter les avertissements de notification
    Alert.alert('Fonctionnalité désactivée', 'Les notifications ont été désactivées dans cette version de l\'application.');
    return false;
  }

  // Fonction pour planifier les notifications de repas
  async function scheduleMealReminders(enabled: boolean) {
    if (enabled) {
      Alert.alert('Fonctionnalité désactivée', 'Les rappels de repas ont été désactivés dans cette version de l\'application.');
      // Nous gardons l'état du switch mais la fonctionnalité est désactivée
    }
  }

  // Fonction pour planifier les rappels d'eau
  async function scheduleWaterReminders(enabled: boolean) {
    if (enabled) {
      Alert.alert('Fonctionnalité désactivée', 'Les rappels d\'hydratation ont été désactivés dans cette version de l\'application.');
      // Nous gardons l'état du switch mais la fonctionnalité est désactivée
    }
  }

  // Fonction pour gérer la connexion des appareils
  const handleConnectDevice = (deviceType: string) => {
    Alert.alert(
      'Connexion appareil',
      `Voulez-vous connecter votre ${deviceType}?`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Connecter',
          onPress: () => {
            setConnectedDevices([...connectedDevices, deviceType]);
            Alert.alert('Succès', `${deviceType} connecté avec succès!`);
          }
        }
      ]
    );
  };

  // Gestionnaires de changement d'état
  const handleMealReminderChange = async (value: boolean) => {
    setMealReminder(value);
    await scheduleMealReminders(value);
  };

  const handleWaterReminderChange = async (value: boolean) => {
    setWaterReminder(value);
    await scheduleWaterReminders(value);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Réglages</Text>

      {/* Section Profil */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="person" size={24} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Mon compte</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Informations personnelles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Plan nutritionnel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Premium</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="school" size={24} color="#FF6A88" />
          <Text style={styles.sectionTitle}>Devenir Coach</Text>
        </View>
        <Text style={styles.coachInfoText}>
          Vous êtes un professionnel de la nutrition ou du fitness ? Partagez votre expertise en devenant coach sur notre plateforme.
        </Text>
        <TouchableOpacity 
          style={styles.coachButton}
          onPress={sendCoachRequest}
        >
          <Text style={styles.coachButtonText}>Postuler pour devenir coach</Text>
        </TouchableOpacity>
      </View>

      {/* Section Objectifs */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="balance-scale" size={24} color="#22c55e" />
          <Text style={styles.sectionTitle}>Objectifs & Suivi</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Objectif de poids</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Besoins caloriques</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Répartition des macros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Aliments favoris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Mes recettes</Text>
        </TouchableOpacity>
      </View>

      {/* Section Préférences */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="settings" size={24} color="#6b7280" />
          <Text style={styles.sectionTitle}>Préférences</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Text>Unités de mesure</Text>
          <Picker
            selectedValue={units}
            style={styles.picker}
            onValueChange={(itemValue) => setUnits(itemValue)}
          >
            <Picker.Item label="Métrique (kg, cm)" value="metric" />
            <Picker.Item label="Impérial (lb, in)" value="imperial" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Format d'affichage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Langue</Text>
        </TouchableOpacity>
      </View>

      {/* Section Podomètre */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="directions-walk" size={24} color="#ef4444" />
          <Text style={styles.sectionTitle}>Podomètre</Text>
        </View>
        <View style={styles.pedometerContainer}>
          {isPedometerAvailable ? (
            <>
              <Text style={styles.stepCount}>{stepCount}</Text>
              <Text style={styles.stepLabel}>pas aujourd'hui</Text>
            </>
          ) : (
            <Text style={styles.unavailableText}>
              Le podomètre n'est pas disponible sur cet appareil
            </Text>
          )}
        </View>
      </View>

      {/* Section Appareils Connectés */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="watch" size={24} color="#8b5cf6" />
          <Text style={styles.sectionTitle}>Appareils connectés</Text>
        </View>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleConnectDevice('Apple Watch')}
        >
          <View style={styles.deviceButton}>
            <Text>Apple Watch</Text>
            {connectedDevices.includes('Apple Watch') && (
              <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleConnectDevice('Samsung Watch')}
        >
          <View style={styles.deviceButton}>
            <Text>Samsung Watch</Text>
            {connectedDevices.includes('Samsung Watch') && (
              <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Section Notifications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="notifications" size={24} color="#eab308" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchDescription}>
            <Text style={styles.switchTitle}>Rappel des repas</Text>
            <Text style={styles.switchSubtitle}>Notifications pour enregistrer vos repas</Text>
          </View>
          <Switch value={mealReminder} onValueChange={handleMealReminderChange} />
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchDescription}>
            <Text style={styles.switchTitle}>Rappel de pesée</Text>
            <Text style={styles.switchSubtitle}>Rappel hebdomadaire pour vous peser</Text>
          </View>
          <Switch value={weightReminder} onValueChange={setWeightReminder} />
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchDescription}>
            <Text style={styles.switchTitle}>Rappel d'hydratation</Text>
            <Text style={styles.switchSubtitle}>Rappels pour boire de l'eau</Text>
          </View>
          <Switch value={waterReminder} onValueChange={handleWaterReminderChange} />
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchDescription}>
            <Text style={styles.switchTitle}>Rapport hebdomadaire</Text>
            <Text style={styles.switchSubtitle}>Résumé de votre semaine</Text>
          </View>
          <Switch value={weeklyReport} onValueChange={setWeeklyReport} />
        </View>
        <View style={styles.switchRow}>
          <View style={styles.switchDescription}>
            <Text style={styles.switchTitle}>Objectifs atteints</Text>
            <Text style={styles.switchSubtitle}>Célébrez vos réussites</Text>
          </View>
          <Switch value={achievementNotif} onValueChange={setAchievementNotif} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Configurer les horaires</Text>
        </TouchableOpacity>
      </View>

      {/* Section Support */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="help" size={24} color="#6b7280" />
          <Text style={styles.sectionTitle}>Support</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text>Guide d'utilisation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Contactez-nous</Text>
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  picker: {
    width: 150,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchDescription: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deviceButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  pedometerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  stepCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  stepLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  unavailableText: {
    color: '#666',
    textAlign: 'center',
  },
  coachInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  coachButton: {
    backgroundColor: '#FF6A88',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  coachButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});