import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface PremiumOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Contenu Premium</Text>
          <Text style={styles.description}>
            Cette fonctionnalité est réservée aux membres Premium.
            Abonnez-vous pour y accéder !
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000', // Fond complètement noir au lieu de semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Position absolue pour couvrir toute la page
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // S'assurer que l'overlay est au-dessus de tout
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // Pour Android
    shadowColor: '#000', // Pour iOS
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
