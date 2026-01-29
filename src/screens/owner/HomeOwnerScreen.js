import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator,   TouchableOpacity, ScrollView,FlatList  } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import MinhaCasaCard from '../../Componentes/MinhaCasaCard';

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Apartamento T2 no Centro',
    type: 'T2',
    price: 45000,
    status: 'disponivel',
    address: 'Rua da Praia, Mindelo',
    photos: ['https://via.placeholder.com/400x300'],
  },
  {
    id: '2',
    title: 'Quarto individual com banheiro',
    type: 'Quarto',
    price: 15000,
    status: 'ocupado',
    address: 'Av. Marginal, São Vicente',
    photos: [],
  },
  {
    id: '3',
    title: 'Casa T3 com vista para o mar',
    type: 'T3',
    price: 65000,
    status: 'manutencao',
    address: 'Baia das Gatas',
    photos: ['https://via.placeholder.com/400x300'],
  },
];

export default function HomeOwnerScreen({navigation}) {
  
  const [userName, setUserName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [loadingProperties, setLoadingProperties] = useState(false);
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
  
  const handleAddProperty = () => {
    console.log('Adicionar nova casa clicado');
  };

  const handlePropertyPress = (property) => {
    console.log('Casa clicada:', property.title);
  };

  const renderPropertyCard = ({ item }) => (
    <MinhaCasaCard
      property={item}
      onPress={() => handlePropertyPress(item)}
    />
  );
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏠</Text>
      <Text style={styles.emptyTitle}>Nenhuma casa cadastrada</Text>
      <Text style={styles.emptyText}>
        Comece adicionando seu primeiro imóvel para locação
      </Text>
    </View>
  );
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
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProperty}
          activeOpacity={0.8}
        >
           <View style={styles.addButtonIcon}>
            <Text style={styles.addButtonIconText}>➕</Text>
          </View>
          <Text style={styles.addButtonText}>Adicionar Nova Casa</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas Casas</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{properties.length}</Text>
            </View>
          </View>

          {loadingProperties ? (
            <ActivityIndicator size="large" color="#61B566" style={styles.loader} />
          ) : (
            <FlatList
              data={properties}
              renderItem={renderPropertyCard}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={properties.length === 0 ? styles.emptyListContent : null}
            />
          )}
        </View>
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
  addButton: {
    backgroundColor: '#61B566',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 30,
  },
  addButtonIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButtonIconText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 20
  },
 addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
