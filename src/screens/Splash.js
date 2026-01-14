import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';




export default function Splash  () {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setTimeout(() => {
            if (user) {
            navigation.replace('Home');
            } else {
            navigation.replace('Login');
            }
        }, 1000);
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
