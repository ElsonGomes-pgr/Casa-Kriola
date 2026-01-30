import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Image 
} from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import MinhaCasaCard from '../../Componentes/MinhaCasaCard';
import { signOut } from 'firebase/auth';

export default function HomeOwnerScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


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

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
            }
          },
        },
      ]
    );
};

  
  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log('Usuário não autenticado');
        setProperties([]);
        return;
      }

      const propertiesRef = collection(db, 'properties');
      const q = query(propertiesRef, where('ownerId', '==', currentUser.uid));
      
      const querySnapshot = await getDocs(q);
      
      const fetchedProperties = [];
      querySnapshot.forEach((doc) => {
        fetchedProperties.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`${fetchedProperties.length} casas encontradas`);
      setProperties(fetchedProperties);

    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

 
  useEffect(() => {
    fetchProperties();
  }, []);

 
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  };

  const handleAddProperty = () => {
    if (navigation) {
    navigation.navigate('AddProperty');
    } else {
      console.log('Navigation não disponível');
    }
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


  const renderEmptyList = () => {
    if (loadingProperties) {
      return null; 
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏠</Text>
        <Text style={styles.emptyTitle}>Nenhuma casa cadastrada</Text>
        <Text style={styles.emptyText}>
          Comece adicionando seu primeiro imóvel para locação
        </Text>
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={handleAddProperty}
        >
          <Text style={styles.emptyButtonText}>Adicionar Agora</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {loadingUser ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Text style={styles.greeting}>Olá, {userName}</Text>
              <Text style={styles.subtitle}>Gerencie seus imóveis</Text>
            </>
          )}
        </View>

  <TouchableOpacity 
    style={styles.logoutButton}
    onPress={handleLogout}
  >
    <Image
      source={require('../../../assets/1024.png')}
      style={styles.logoutIcon}
      resizeMode="contain"
    />
  </TouchableOpacity>
        
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
            {!loadingProperties && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{properties.length}</Text>
              </View>
            )}
          </View>

          {loadingProperties && properties.length === 0 ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#61B566" />
              <Text style={styles.loaderText}>Carregando suas casas...</Text>
            </View>
          ) : (
            <FlatList
              data={properties}
              renderItem={renderPropertyCard}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={properties.length === 0 ? styles.emptyListContent : styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#61B566']}
                  tintColor="#61B566"
                />
              }
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
    paddingTop: 50,
    paddingBottom: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
  flex: 1,
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
    padding: 20,
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
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: '#61B566',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#61B566',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
  padding: 8,
  },
  logoutIcon: {
    width: 44,
    height: 36,
  },
});