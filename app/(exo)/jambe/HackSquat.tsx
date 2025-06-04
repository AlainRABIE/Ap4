import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ArrowLeft } from 'lucide-react-native'

export default function HackSquat() {
  const navigation = useNavigation()
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={styles.backText}>Retour aux exercices des jambes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Hack Squat</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Comment faire le Hack Squat</Text>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Description</Text>
          <Text style={styles.text}>
            Le Hack Squat est un exercice de musculation qui cible principalement les quadriceps, les fessiers et les ischio-jambiers. Il s'effectue sur une machine spécifique qui guide le mouvement et permet de soulever des charges importantes en toute sécurité.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Étapes d'exécution</Text>
          <View style={styles.list}>
            <Text style={styles.text}>1. Positionnez-vous sur la machine Hack Squat, dos bien calé contre le dossier incliné.</Text>
            <Text style={styles.text}>2. Placez vos pieds sur la plateforme à largeur d'épaules ou légèrement plus larges.</Text>
            <Text style={styles.text}>3. Déverrouillez la sécurité de la machine et tenez fermement les poignées.</Text>
            <Text style={styles.text}>4. Inspirez et descendez lentement en fléchissant les genoux jusqu'à ce qu'ils forment un angle d'environ 90 degrés.</Text>
            <Text style={styles.text}>5. Poussez ensuite sur vos talons pour remonter à la position initiale tout en expirant.</Text>
            <Text style={styles.text}>6. Répétez le mouvement pour le nombre de répétitions souhaité.</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Conseils techniques</Text>
          <View style={styles.list}>
            <Text style={styles.text}>• Gardez votre dos bien appuyé contre le dossier tout au long du mouvement.</Text>
            <Text style={styles.text}>• Ne laissez pas vos genoux s'affaisser vers l'intérieur pendant la descente.</Text>
            <Text style={styles.text}>• Adaptez le placement de vos pieds sur la plateforme pour cibler différentes parties des jambes.</Text>
            <Text style={styles.text}>• Contrôlez le mouvement, surtout lors de la descente.</Text>
            <Text style={styles.text}>• Évitez de verrouiller complètement vos genoux en position haute.</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Muscles sollicités</Text>
          <View style={styles.list}>
            <Text style={styles.text}>• Principalement : Quadriceps</Text>
            <Text style={styles.text}>• Secondairement : Fessiers, ischio-jambiers</Text>
            <Text style={styles.text}>• Stabilisateurs : Muscles du tronc</Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Variantes et adaptations</Text>
        <View style={styles.list}>
          <Text style={styles.text}><Text style={{fontWeight:'bold'}}>Hack squat pieds hauts</Text> : Placez vos pieds plus haut sur la plateforme pour solliciter davantage les ischio-jambiers et les fessiers.</Text>
          <Text style={styles.text}><Text style={{fontWeight:'bold'}}>Hack squat pieds serrés</Text> : Rapprochez vos pieds pour cibler plus intensément la partie externe des quadriceps.</Text>
          <Text style={styles.text}><Text style={{fontWeight:'bold'}}>Hack squat pieds écartés</Text> : Écartez davantage vos pieds pour travailler l'intérieur des cuisses.</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backText: {
    color: '#2563eb',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1e293b',
  },
  section: {
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
    color: '#334155',
  },
  text: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  list: {
    marginLeft: 8,
    marginBottom: 4,
  },
})
