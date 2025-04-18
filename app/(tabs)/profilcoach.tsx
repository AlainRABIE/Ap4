import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut, updateProfile } from 'firebase/auth';
import { getUserData, updateUserData } from '../../services/auth';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function AdminProfile() {
  const router = useRouter();
  const auth = getAuth();
  const storage = getStorage();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: '',
    lastLogin: '',
    photoURL: 'https://www.gravatar.com/avatar/?d=mp',
    sessionPrice: '0'
  });
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(false);
  const [sessionPrice, setSessionPrice] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const data = await getUserData(user.uid);
          setUserData({
            name: data.name || user.displayName || 'Admin',
            email: user.email || 'Non renseigné',
            role: data.role || 'non',
            createdAt: user.metadata.creationTime || 'Non disponible',
            lastLogin: user.metadata.lastSignInTime || 'Non disponible',
            photoURL: user.photoURL || 'https://www.gravatar.com/avatar/?d=mp',
            sessionPrice: data.sessionPrice || '0'
          });
          setSessionPrice(data.sessionPrice || '0');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la déconnexion. Veuillez réessayer.');
    }
  };

  const saveSessionPrice = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateUserData(user.uid, { sessionPrice });
        setUserData({ ...userData, sessionPrice });
        setEditingPrice(false);
        Alert.alert('Succès', 'Le tarif a été mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tarif:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le tarif');
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre galerie');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à votre caméra');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string | URL | Request) => {
    setPhotoModalVisible(false);
    setLoading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Progression du téléchargement si nécessaire
        },
        (error) => {
          Alert.alert('Erreur', 'Échec du téléchargement de l\'image');
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });
          await updateUserData(user.uid, { photoURL: downloadURL });
          
          setUserData({
            ...userData,
            photoURL: downloadURL
          });
          
          setLoading(false);
          Alert.alert('Succès', 'Photo de profil mise à jour avec succès');
        }
      );
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      Alert.alert('Erreur', 'Échec de la mise à jour de la photo de profil');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={() => setPhotoModalVisible(true)}>
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.profileImage}
            />
            <View style={styles.editPhotoButton}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Coach</Text>
          </View>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{userData.name}</Text>
          <Text style={styles.emailText}>{userData.email}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Informations du compte</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Rôle:</Text>
            <Text style={styles.infoValue}>Coach</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Compte créé le:</Text>
            <Text style={styles.infoValue}>{new Date(userData.createdAt).toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="log-in-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Dernière connexion:</Text>
            <Text style={styles.infoValue}>{new Date(userData.lastLogin).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Forfait par séance</Text>
          
          {editingPrice ? (
            <View style={styles.priceEditRow}>
              <TextInput
                style={styles.priceInput}
                value={sessionPrice}
                onChangeText={setSessionPrice}
                keyboardType="numeric"
                placeholder="Prix par séance"
              />
              <Text style={styles.currencyText}>€</Text>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveSessionPrice}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setSessionPrice(userData.sessionPrice);
                  setEditingPrice(false);
                }}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Tarif séance:</Text>
              <Text style={styles.infoValue}>{userData.sessionPrice} €</Text>
              <TouchableOpacity onPress={() => setEditingPrice(true)}>
                <Ionicons name="create-outline" size={20} color="#FF6A88" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/client')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="people-outline" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionCardText}>Mes clients</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/rendezvouscoach')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="calendar-outline" size={24} color="#FFF" />
              </View>
              <Text style={styles.actionCardText}>Rendez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFF" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
        
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Photo de profil</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color="#FF6A88" />
              <Text style={styles.modalOptionText}>Prendre une photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={selectImage}>
              <Ionicons name="image-outline" size={24} color="#FF6A88" />
              <Text style={styles.modalOptionText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setPhotoModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF6A88',
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6A88',
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FF6A88',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  adminBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757575',
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  priceEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  cancelButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});