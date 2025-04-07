import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import PremiumOverlay from "../../components/PremiumOverlay";

const RecettePage = () => {
  const [recipes, setRecipes] = useState<{ idMeal: string; strMeal: string; strCategory: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [showPremiumOverlay, setShowPremiumOverlay] = useState(false);

  // Fonction de traduction
  const translateText = async (text: string, targetLang: string) => {
    try {
      const sourceLang = targetLang === 'en' ? 'fr' : 'en';
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error('Erreur de traduction:', error);
      return text;
    }
  };

  useEffect(() => {
    // Simuler la vérification d'abonnement - à remplacer par votre logique réelle
    const hasPremiumAccess = false; // Intégrer votre logique de vérification ici
    if (!hasPremiumAccess) {
      setShowPremiumOverlay(true);
    }
  }, []);

  const searchRecipes = async () => {
    if (showPremiumOverlay) return; // Empêcher la recherche si l'overlay est visible

    setLoading(true);
    try {
      // Traduire l'ingrédient en anglais
      const ingredientEnglish = await translateText(ingredients, 'en');
      
      // Rechercher les recettes
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientEnglish}`);
      const data = await response.json();
      
      if (data.meals) {
        const translatedRecipes = await Promise.all(
          data.meals.map(async (recipe: any) => ({
            ...recipe,
            strMeal: await translateText(recipe.strMeal, 'fr'),
          }))
        );
        setRecipes(translatedRecipes);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setRecipes([]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche de Recettes</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Entrez un ingrédient (en français)"
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchRecipes}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Chargement des recettes...</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <Text style={styles.recipeTitle}>{item.strMeal}</Text>
              {item.strCategory && <Text style={styles.recipeCategory}>Catégorie: {item.strCategory}</Text>}
            </View>
          )}
        />
      )}

      <PremiumOverlay 
        isVisible={showPremiumOverlay} 
        onClose={() => setShowPremiumOverlay(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  recipeItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeCategory: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default RecettePage;