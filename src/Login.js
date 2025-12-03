import React from 'react';
import { View, Text, StyleSheet, Button ,TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import { Image } from 'react-native';

export default function Login({navigation}){

    const [box, setBox] = useState({
        email: '',
        password: 0
    });
    const [password, setPassword] = useState(0); 

    return(
        <View style ={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../assets/logo.png")}
                    style={styles.logo}
                />
            </View>

            <Text style={styles.title}>Segn in to Casa - Kriola</Text>

            <Text style={styles.subtitle}>Get access to your home here</Text>

        
            <View style={styles.box}>
                <View style={styles.input}>
                    <Text style={styles.inputLabel}>Email address</Text>

                    <TextInput
                    keyboardType='email-address'
                    placeholder='email@gmail.com' 
                    value={box.email}
                    onChangeText={email => setBox({...box, email})}
                    style={styles.inputControl}
                    />
                </View>

                <View style={styles.input}>
                    <Text style={styles.inputLabel}>Password address</Text>

                    <TextInput
                    placeholder='*********' 
                    value={box.password}
                    onChangeText={password => setBox({...box, password})}
                    style={styles.inputControl}
                    />
                </View>

                

                <TouchableOpacity onPress={()=> {}} style={styles.btn}>
                    <Text style={{color: '#fff'}} >Sign in</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate('Register') } style={styles.btn}>
                    <Text style={{color: '#fff'}} >Create Acount</Text>
                </TouchableOpacity>

            </View>
        </View>

    );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 24
   },
   header:{
    marginVertical: 36,
   },
   logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 10
   },
   /*}
   box: {
    backgroundColor: '#61B367',
    padding: '40%',
    borderRadius: 10
   },*/
   title:{
    fontSize: 29,
    fontWeight:'700',
    marginBottom: 6,
    textAlign: 'center'
   },
   subtitle:{
    fontSize: 15,
    fontWeight: '500',
    color:'#929292',
    textAlign: 'center',
    marginBottom: 40
   },
   input:{
    marginBottom: 30,
   },
   inputLabel:{
    fontSize: 17,
    fontWeight:'600',
    color:'#222',
    marginBottom: 16
   },

   inputControl:{
    height: 44,
    backgroundColor: '#ffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 15
   },
   btn:{
    backgroundColor:'#4fa7daff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 3,
    height: 34,
    marginBottom: 12
   }
});