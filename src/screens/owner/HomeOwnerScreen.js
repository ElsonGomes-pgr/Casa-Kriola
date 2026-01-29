import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';


export default function HomeOwnerScreen() {
  const [userName, setUserName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          if (currentUser.displayName) {
            setUserName(currentUser.displayName);
            setLoadingUser(false);
            return;
          }

          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const name = userData.name || userData.nome || userData.displayName || 'Usuário';
            setUserName(name);
          } else {
            const emailName = currentUser.email?.split('@')[0] || 'Usuário';
            setUserName(emailName);
          }
        } else {
          setUserName('Visitante');
        }
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        setUserName('Usuário');
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserName();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {loadingUser ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text style={styles.greeting}>Olá, {userName}</Text>
            <Text style={styles.subtitle}>Gerencie seus imóveis</Text>
          </>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>Dashboard em construção...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#61B566',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 55,
    borderRadius: 29
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
});
