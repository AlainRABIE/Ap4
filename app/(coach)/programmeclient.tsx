import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

type Client = {
  id: string;
  nom: string;
  prenom: string;
  photoURL: string;
  email: string;
  dateInscription: Date;
  dernierEntrainement?: Date;
  programme?: {
    id: string;
    nom: string;
  };
};

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("Aucun utilisateur connecté");
          setLoading(false);
          return;
        }

        // Récupérer tous les clients associés à ce coach
        const clientsRef = collection(db, 'utilisateurs');
        const q = query(
          clientsRef,
          where('coachId', '==', user.uid),
          orderBy('nom', 'asc')
        );

        const querySnapshot = await getDocs(q);
        const clientsList: Client[] = [];

        for (const doc of querySnapshot.docs) {
          const clientData = doc.data();
          
          // Récupérer le dernier programme si disponible
          let programme = undefined;
          try {
            const programmesRef = collection(db, 'programmes');
            const programmeQuery = query(
              programmesRef,
              where('clientId', '==', doc.id),
              orderBy('dateCreation', 'desc'),
              limit(1)
            );
            
            const programmeSnapshot = await getDocs(programmeQuery);
            if (!programmeSnapshot.empty) {
              const programmeDoc = programmeSnapshot.docs[0];
              programme = {
                id: programmeDoc.id,
                nom: programmeDoc.data().nom
              };
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du programme:", error);
          }

          clientsList.push({
            id: doc.id,
            nom: clientData.nom || '',
            prenom: clientData.prenom || '',
            photoURL: clientData.photoURL || 'https://www.gravatar.com/avatar/?d=mp',
            email: clientData.email || '',
            dateInscription: clientData.dateInscription?.toDate() || new Date(),
            dernierEntrainement: clientData.dernierEntrainement?.toDate(),
            programme
          });
        }

        setClients(clientsList);
        setFilteredClients(clientsList);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(client => 
        client.nom.toLowerCase().includes(query) || 
        client.prenom.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const viewClientProgram = (client: Client) => {
    router.push({
      pathname: '/programme-details',
      params: {
        clientId: client.id,
        clientName: `${client.prenom} ${client.nom}`
      }
    });
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => viewClientProgram(item)}
    >
      <Image 
        source={{ uri: item.photoURL }} 
        style={styles.clientAvatar} 
      />
      
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.prenom} {item.nom}</Text>
        <Text style={styles.clientEmail}>{item.email}</Text>
        
        {item.programme ? (
          <View style={styles.programBadge}>
            <Text style={styles.programText}>{item.programme.nom}</Text>
          </View>
        ) : (
          <View style={styles.noProgramBadge}>
            <Text style={styles.noProgramText}>Pas de programme</Text>
          </View>
        )}
      </View>
      
      <View style={styles.clientStatus}>
        {item.dernierEntrainement ? (
          <Text style={styles.lastTrainingDate}>
            Dernier: {new Date(item.dernierEntrainement).toLocaleDateString()}
          </Text>
        ) : null}
        <Ionicons name="chevron-forward" size={24} color="#9E9E9E" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Clients</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9E9E9E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9E9E9E"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9E9E9E" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#FF6A88" />
          <Text style={styles.loadingText}>Chargement des clients...</Text>
        </View>
      ) : filteredClients.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="people" size={50} color="#9E9E9E" />
          {searchQuery ? (
            <Text style={styles.emptyText}>Aucun client ne correspond à votre recherche</Text>
          ) : (
            <Text style={styles.emptyText}>Vous n'avez pas encore de clients</Text>
          )}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/add-client')}
          >
            <Text style={styles.addButtonText}>Ajouter un client</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.clientCountText}>
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
          </Text>
          <FlatList
            data={filteredClients}
            renderItem={renderClientItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => router.push('/add-client')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
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
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clientCountText: {
    fontSize: 14,
    color: '#666',
    padding: 15,
    paddingBottom: 5,
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  clientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  clientInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  programBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  programText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '500',
  },
  noProgramBadge: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  noProgramText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '500',
  },
  clientStatus: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lastTrainingDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 5,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6A88',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#FF6A88',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});