import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';

const RecettePage = () => {
  const [recipes, setRecipes] = useState<{ idMeal: string; strMeal: string; strCategory: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState('');

  const searchRecipes = () => {
    setLoading(true);
    // L'API TheMealDB permet de chercher par ingrédient principal
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des recettes:', error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche de Recettes</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Entrez un ingrédient (en anglais)"
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