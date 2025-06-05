import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import app from '../../firebase/firebaseConfig';
import { AboService } from '../../services/abo';

export default function PaymentScreen() {
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  const aboService = new AboService();

  const params = useLocalSearchParams();
  const planName = params.planName as string;
  const planPrice = params.planPrice as string;
  const planPeriod = params.planPeriod as string;

  const updateUserSubscription = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      console.log(`Mise à jour de l'abonnement vers: ${planName}`);
      
      const userRef = doc(db, 'utilisateurs', user.uid);
      await updateDoc(userRef, {
        abonnement: planName, 
        derniereModification: serverTimestamp(),
        dateModification: serverTimestamp()
      });

      console.log(`Abonnement mis à jour avec succès vers: ${planName}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      throw error;
    }
  };
  const handlePayment = async () => {
    try {
      setLoading(true);

      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateUserSubscription();

      // Mettre à jour le service d'abonnement local
      const subscriptionType = planName.toLowerCase().includes('plus') ? 'plus' : 'basic';
      aboService.setSubscription(subscriptionType);

      Alert.alert(
        'Abonnement activé!',
        'Votre abonnement premium est maintenant actif.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(prenium)/CheckoutScreen',
                params: {
                  planName: planName,
                  planPrice: planPrice,
                  planPeriod: planPeriod
                }
              });
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirmer votre abonnement</Text>

      <View style={styles.planCard}>
        <Text style={styles.planTitle}>{planName}</Text>
        <Text style={styles.planPrice}>
          {Number(planPrice).toFixed(2).replace('.', ',')} € 
          <Text style={styles.planPeriod}>/ {planPeriod}</Text>
        </Text>
        <Text style={styles.planDescription}>
          • Accès à toutes les fonctionnalités{'\n'}
          • Support premium{'\n'}
          • Sans publicités
        </Text>
      </View>      <View style={styles.cardContainer}>
        <Text style={styles.sectionTitle}>Méthode de paiement</Text>

        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodTitle}>Paiement sécurisé</Text>
          <Text style={styles.paymentMethodDesc}>
            Votre abonnement sera activé immédiatement après confirmation.
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.payButton} 
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.payButtonText}>Confirmer l'abonnement</Text>
        )}
      </TouchableOpacity>      <Text style={styles.termsText}>
        En confirmant cet abonnement, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
        Votre abonnement sera automatiquement renouvelé chaque mois jusqu'à annulation.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E293B',
  },
  planCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1E293B',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 16,
  },
  planPeriod: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 'normal',
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  cardContainer: {
    marginBottom: 24,
  },  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1E293B',
  },
  paymentMethodCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  paymentMethodDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  }
});