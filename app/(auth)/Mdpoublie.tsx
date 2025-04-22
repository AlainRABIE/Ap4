import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

export default function Mdpoublie() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputScale = useSharedValue(1);

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: inputScale.value }]
    };
  });

  const focusInput = () => {
    inputScale.value = withSpring(1.02);
  };

  const blurInput = () => {
    inputScale.value = withSpring(1);
  };

  const checkEmailExists = async (email: unknown) => {
    try {
      const userQuery = query(collection(db, 'utilisateurs'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      return false;
    }
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        setError("Cette adresse email n'est pas associée à un compte");
        setLoading(false);
        return;
      }
      
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      
      setTimeout(() => {
        router.replace('/login');
      }, 4000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe :', error);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={80} color="#FFF" />
        </View>
        <Text style={styles.successTitle}>Email envoyé!</Text>
        <Text style={styles.successText}>
          Un lien de réinitialisation a été envoyé à {email}
        </Text>
        <Text style={styles.redirectText}>
          Vous allez être redirigé vers la page de connexion...
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['#0575E6', '#00F260']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Animated.View 
            entering={FadeInUp.delay(200).duration(1000).springify()} 
            style={styles.logoContainer}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Réinitialiser votre mot de passe</Text>
            <Text style={styles.subtitle}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#fff" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <Animated.View style={[styles.inputWrapper, inputStyle]}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={22} color="#0575E6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Votre adresse email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />
                {email ? (
                  <TouchableOpacity onPress={() => setEmail('')}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </Animated.View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Envoyer le lien</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace('/login')}
            >
              <Ionicons name="arrow-back-outline" size={16} color="#0575E6" style={styles.loginLinkIcon} />
              <Text style={styles.loginLinkText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 60,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0575E6',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    shadowColor: '#0575E6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginLinkIcon: {
    marginRight: 6,
  },
  loginLinkText: {
    color: '#0575E6',
    fontSize: 15,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0575E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0575E6',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  redirectText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  }
});