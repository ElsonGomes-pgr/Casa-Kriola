import React from 'react';
import { View, Text, StyleSheet, Button ,TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function Register({navigation}){
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    async function handleRegister() {
        const { name, email, password, confirmPassword } = form;

        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
            );

            await updateProfile(userCredential.user, {
            displayName: name,
            });

            navigation.replace('ProfileChoice');
        } catch (error) {
            Alert.alert('Erro ao criar conta', error.message);
        }
    }


   return(
    <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                />
            </View>

            <Text style={styles.title}>Create Account</Text>


            <View style={styles.form}>
                <Text style ={styles.label}>Name</Text>
                <TextInput 
                style={styles.input}
                    placeholder='Your name'
                    value={form.name}
                    onChangeText={(name) => setForm({...form, name})}
                />

                <Text style ={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='exmpl@gmail.com'
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(email) => setForm({...form, email})}
                />

                <Text style ={styles.label}>Password</Text>
                <TextInput 
                style={styles.input}
                    placeholder='******'
                    secureTextEntry
                    value={form.password}
                    onChangeText={(password) => setForm({...form, password})}
                />

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry
                    value={form.confirmPassword}
                    onChangeText={(confirmPassword) =>
                        setForm({ ...form, confirmPassword })
                    }
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Create account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Already have an account? Sign in</Text>
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
    },
    header:{
        alignItems: 'center',
        marginBottom: 24,
    },
     logo: {
        width: 80,
        height: 80,
        borderRadius: 10
   },
    title:{
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 24,
    },
    form:{
        marginTop: 10,
    },
    label:{
        bheight: 44,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4fa7da',
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
     },
     buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    link: {
        marginTop: 16,
        textAlign: 'center',
        color: '#4fa7da',
  },

});