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
            if (!user) {
              navigation.replace('Login');
            }

            try{
              const userDoc = await getDoc(doc(db, 'users', user.uid));

              if (!userDoc.exists()) {
                navigation.replace('ProfileChoice');
                return;
              }

              const { role } = userDoc.data();

              if (role === 'seeker') {
                navigation.replace('HomeSeeker');
              } else if (role === 'owner') {
                navigation.replace('HomeOwner');  
              } else {
                navigation.replace('ProfileChoice');
              }
            } catch (error) {
              console.log(error);
              navigation.replace('Login');
            }
        }, 1500);
        
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
