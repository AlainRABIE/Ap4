import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; // Utilisation de React Native Paper pour des composants modernes
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter, router } from 'expo-router';
import app from '../../firebase/firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

const ProfileSetup = () => {
    const [nomComplet, setNomComplet] = useState('');
    const [departement, setDepartement] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            router.replace('/login'); 
        }
    }, []);

    const handleSaveProfile = async () => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Erreur', 'Aucun utilisateur trouvé.');
            return;
        }

        setLoading(true);
        try {
            await setDoc(
                doc(db, 'utilisateurs', user.uid),
                {
                    nomComplet,
                    departement,
                    dateModification: new Date(),
                },
                { merge: true }
            );

            router.replace('/ProfileData'); 
            Alert.alert('Succès', 'Profil mis à jour avec succès!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue.';
            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Complétez votre Profil</Text>

                <TextInput
                    label="Nom Complet"
                    value={nomComplet}
                    onChangeText={(e) => {setNomComplet(e); console.log(e)}}
                    style={styles.input}
                    
                />

                <TextInput
                    label="Département"
                    value={departement}
                    onChangeText={setDepartement}
                    style={styles.input}
                />

                {loading ? (
                    <ActivityIndicator animating={true} color="#6200EE" style={styles.loader} />
                ) : (
                    <Button
                        mode="contained"
                        onPress={handleSaveProfile}
                        style={styles.button}
                        disabled={loading}
                    >
                        Enregistrer
                    </Button>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        width: '100%',
    },
    loader: {
        marginTop: 20,
    },
});

export default ProfileSetup;