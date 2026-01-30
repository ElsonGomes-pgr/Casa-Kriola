import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebaseConfig';
import { db } from '../config/firebaseConfig';

export default function ProfileChoiceScreen({ navigation }) {
  async function selectRole(role) {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'Usuário',
        role: role,
        createdAt: new Date(),
      });

      if (role === 'seeker') {
        navigation.replace('HomeSeeker');
      } else if (role === 'owner') {
        navigation.replace('HomeOwner');
      }
    } catch (error) {
      console.log('Erro ao salvar role:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua escolha. Tente novamente.', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/LogoSF.png')}
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Casa Kriola</Text>
      </View>


      <Text style={styles.question}>Como deseja usar o Casa Kriola?</Text>

      <TouchableOpacity
        style={[styles.card, styles.seekerCard]}
        onPress={() => selectRole('seeker')}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.iconText}>🔍</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Quero procurar casa</Text>
          <Text style={styles.cardSubtitle}>Inquilino</Text>
          <Text style={styles.cardDescription}>
            Encontre o imóvel ideal para você
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.ownerCard]}
        onPress={() => selectRole('owner')}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.iconText}>🏘️</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Quero anunciar casa</Text>
          <Text style={styles.cardSubtitle}>Proprietário</Text>
          <Text style={styles.cardDescription}>
            Anuncie seus imóveis para locação
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',

  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  },
  question: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  seekerCard: {
    backgroundColor: '#5995C6',
  },
  ownerCard: {
    backgroundColor: '#61B566',
  },
  cardIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 30,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4
  },
  cardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
