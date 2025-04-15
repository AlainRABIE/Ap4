import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from 'firebase/auth';
import { getUserData } from '../../services/auth';

export default function AdminProfile() {
  const router = useRouter();
  const auth = getAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: '',
    lastLogin: '',
    photoURL: 'https://www.gravatar.com/avatar/?d=mp'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const data = await getUserData(user.uid);
          setUserData({
            name: data.name || user.displayName || 'Admin',
            email: user.email || 'Non renseigné',
            role: data.role || 'admin',
            createdAt: user.metadata.creationTime || 'Non disponible',
            lastLogin: user.metadata.lastSignInTime || 'Non disponible',
            photoURL: user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'
          });
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
          <Image
            source={{ uri: userData.photoURL }}
            style={styles.profileImage}
          />
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
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
            <Text style={styles.infoValue}>Administrateur</Text>
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
          <Text style={styles.sectionTitle}>Actions administrateur</Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/client')}
          >
            <Ionicons name="people-outline" size={22} color="#FFF" />
            <Text style={styles.actionButtonText}>Gestion des utilisateurs</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FFF" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
        
      </ScrollView>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6A88',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
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
});