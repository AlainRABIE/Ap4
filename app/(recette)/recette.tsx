import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const RecettePage = () => {
  const [recipes, setRecipes] = useState<{ idMeal: string; strMeal: string; strCategory: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplacez l'URL par celle de votre API de recettes
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals || []); // Si aucune recette n'est trouvée, on retourne un tableau vide
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des recettes:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des recettes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Recettes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeTitle}>{item.strMeal}</Text>
            <Text style={styles.recipeCategory}>Catégorie: {item.strCategory}</Text>
          </View>
        )}
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
});

export default RecettePage;