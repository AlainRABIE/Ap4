import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Subscription {
  type: 'basic' | 'plus';
}

export class AboService {
  private currentSubscription: Subscription = {
    type: 'basic'
  };

  async init() {
    try {
      const storedSubscription = await AsyncStorage.getItem('userSubscription');
      if (storedSubscription) {
        this.currentSubscription = JSON.parse(storedSubscription);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'abonnement:', error);
    }
  }

  checkAccess(): boolean {
    return this.currentSubscription.type !== 'basic';
  }

  getSubscriptionType(): 'basic' | 'plus' {
    return this.currentSubscription.type;
  }

  async setSubscription(type: 'basic' | 'plus') {
    this.currentSubscription.type = type;
    try {
      await AsyncStorage.setItem('userSubscription', JSON.stringify(this.currentSubscription));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'abonnement:', error);
    }
  }

  async clearSubscription() {
    this.currentSubscription.type = 'basic';
    try {
      await AsyncStorage.removeItem('userSubscription');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'abonnement:', error);
    }
  }
}

// Instance singleton pour l'utilisation dans l'app
export const aboService = new AboService();
