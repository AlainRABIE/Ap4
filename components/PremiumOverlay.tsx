import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';

interface PremiumOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  const goToCheckout = () => {
    onClose(); // On ferme l'overlay
    router.push('/Abo'); // On redirige vers la page d'abonnement
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Contenu Premium</Text>
          <Text style={styles.description}>
            Cette fonctionnalité est réservée aux membres Premium.
            Abonnez-vous pour y accéder !
          </Text>
          <TouchableOpacity style={styles.button} onPress={goToCheckout}>
            <Text style={styles.buttonText}>S'abonner</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6A88',
    padding: 10,
    borderRadius: 5,
    width: '50%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PremiumOverlay;
