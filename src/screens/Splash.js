import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';


export default function Splash  ({ navigation }) {

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setTimeout(async () => {
            
              navigation.replace('Login');
            
        }, 2000);
        
    });

    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casa Kriola</Text>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
