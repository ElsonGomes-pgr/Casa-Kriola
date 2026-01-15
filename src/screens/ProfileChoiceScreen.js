import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../config/firebaseConfig';
import { db } from '../config/firebaseConfig';

export default function ProfileChoiceScreen() {
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
        name: user.displayName || '',
        role: role,
        createdAt: new Date(),
      });

      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como deseja usar o Casa Kriola?</Text>

      <TouchableOpacity
        style={[styles.card, styles.seeker]}
        onPress={() => selectRole('seeker')}
      >
        <Text style={styles.cardTitle}>Quero procurar casa</Text>
        <Text style={styles.cardSubtitle}>Inquilino</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.owner]}
        onPress={() => selectRole('owner')}
      >
        <Text style={styles.cardTitle}>Quero anunciar casa</Text>
        <Text style={styles.cardSubtitle}>Proprietário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
  },
  seeker: {
    backgroundColor: '#e3f2fd',
  },
  owner: {
    backgroundColor: '#fff3e0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
});
