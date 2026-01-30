import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function Login({ navigation }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);


  const checkUserRoleAndNavigate = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;

        console.log('Role do usuário:', role);

        if (role === 'seeker') {
          navigation.replace('HomeSeeker');
        } else if (role === 'owner') {
          navigation.replace('HomeOwner');
        } else {
+          navigation.replace('ProfileChoice');
        }
      } else {
        console.log('Usuário sem documento no Firestore');
        navigation.replace('ProfileChoice');
      }
    } catch (error) {
      console.error('Erro ao verificar role:', error);
      navigation.replace('ProfileChoice');
    }
  };

 
  async function handleLogin() {
    if (!form.email || !form.password) {
      Alert.alert('Atenção', 'Preencha email e senha');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;
      console.log('Login bem-sucedido:', user.uid);

      await checkUserRoleAndNavigate(user.uid);

    } catch (error) {
      console.error('Erro ao entrar:', error);
      
      let errorMessage = 'Não foi possível fazer login. Tente novamente.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido.';
      }

      Alert.alert('Erro ao entrar', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Casa Kriola</Text>
      </View>

      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Entre para acessar sua conta</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            keyboardType="email-address"
            placeholder="seuemail@gmail.com"
            placeholderTextColor="#999"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            style={styles.input}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            style={styles.input}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={[styles.secondaryText, loading && styles.textDisabled]}>
            Criar nova conta
          </Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4fa7da',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4fa7da',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0d4ed',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    padding: 12,
  },
  secondaryText: {
    color: '#4fa7da',
    fontWeight: '600',
    fontSize: 16,
  },
  textDisabled: {
    opacity: 0.5,
  },
});