import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

interface Forfait {
    id?: string;
    name: string;
    price: number;
    numberOfSessions: number;
    description: string;
}

export default function ForfaitPage() {
    const [forfaits, setForfaits] = useState<Forfait[]>([]);
    const [newForfait, setNewForfait] = useState<Forfait>({
        name: '',
        price: 0,
        numberOfSessions: 1,
        description: ''
    });

    const handleInputChange = (name: string, value: string) => {
        setNewForfait({
            ...newForfait,
            [name]: name === 'price' || name === 'numberOfSessions' ? Number(value) : value
        });
    };

    const handleSubmit = () => {        
        if (!newForfait.name || newForfait.price <= 0 || newForfait.numberOfSessions <= 0) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs correctement");
            return;
        }
        
        const forfaitWithId = { ...newForfait, id: Date.now().toString() };
        setForfaits([...forfaits, forfaitWithId]);
        
        setNewForfait({
            name: '',
            price: 0,
            numberOfSessions: 1,
            description: ''
        });
        
        Alert.alert("Succès", "Le forfait a été ajouté avec succès");
    };

    const deleteForfait = (id: string) => {
        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr de vouloir supprimer ce forfait ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: () => {
                        setForfaits(forfaits.filter(forfait => forfait.id !== id));
                        Alert.alert("Succès", "Le forfait a été supprimé avec succès");
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Gestion des forfaits</Text>
            
            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Ajouter un nouveau forfait</Text>
                <Text style={styles.sectionSubtitle}>Créez un forfait pour vos séances de coaching</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nom du forfait</Text>
                    <TextInput 
                        style={styles.input}
                        value={newForfait.name} 
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Ex: Pack 10 séances"
                        placeholderTextColor="#999"
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prix (€)</Text>
                    <TextInput 
                        style={styles.input}
                        value={newForfait.price.toString()} 
                        onChangeText={(value) => handleInputChange('price', value)}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de séances</Text>
                    <TextInput 
                        style={styles.input}
                        value={newForfait.numberOfSessions.toString()} 
                        onChangeText={(value) => handleInputChange('numberOfSessions', value)}
                        placeholder="1"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        value={newForfait.description} 
                        onChangeText={(value) => handleInputChange('description', value)}
                        placeholder="Détails du forfait..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                    />
                </View>
                
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Ajouter le forfait</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.listContainer}>
                <Text style={styles.sectionTitle}>Forfaits disponibles</Text>
                {forfaits.length === 0 ? (
                    <Text style={styles.emptyText}>Aucun forfait n'a été créé</Text>
                ) : (
                    forfaits.map((forfait) => (
                        <View key={forfait.id} style={styles.forfaitCard}>
                            <Text style={styles.forfaitName}>{forfait.name}</Text>
                            <Text style={styles.forfaitDetails}>
                                {forfait.numberOfSessions} séance{forfait.numberOfSessions > 1 ? 's' : ''} - {forfait.price}€
                            </Text>
                            <Text style={styles.forfaitDescription}>{forfait.description}</Text>
                            <TouchableOpacity 
                                style={styles.deleteButton}
                                onPress={() => forfait.id && deleteForfait(forfait.id)}
                            >
                                <Text style={styles.deleteButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#333',
    },
    formContainer: {
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 16,
    },
    forfaitCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    forfaitName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    forfaitDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    forfaitDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        borderRadius: 6,
        padding: 8,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});