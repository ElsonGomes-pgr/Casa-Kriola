import React from 'react';
import { View, Text, StyleSheet, Button ,TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import { Image } from 'react-native';

export default function Register({navigation}){
    const [box, setBox] = useState({
        name: '',
        email: '',
        password: '',
    })

   return(
    <View style={styles.container}>
        <View style={styles.topBar}>
            <View style={styles.header}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                />
            </View>

            <Text style={styles.title}>Sign Up</Text>


            <View style={styles.box}>
                <Text style ={styles.textController}>Name</Text>
                <TextInput style={styles.inputController}
                    placeholder='Name'
                    value={box.name}
                    onChangeText={name => setBox({...box, name})}
                />

                <Text style ={styles.textController}>Email</Text>
                <TextInput style={styles.inputController}
                    placeholder='exmpl@gmail.com'
                    value={box.name}
                    onChangeText={email => setBox({...box, email})}
                />

                <Text style ={styles.textController}>Name</Text>
                <TextInput style={styles.inputController}
                    placeholder='*******'
                    value={box.name}
                    onChangeText={name => setBox({...box, name})}
                />
            </View>

        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
        flex: 1,
        justifyContent:'flex-start',
        paddingTop: 60,
        padding: 24
    },
    header:{
        marginVertical: 36
    },
     logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        borderRadius: 10
   },
    title:{
        marginTop: 24,
        marginRight: 44,
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 45
    },
    inputController:{
        backgroundColor:'#ffff',
        borderRadius: 10,
        padding: 14,
        marginBottom: 20
    },
    textController:{
        marginBottom: 10,
        fontWeight: '600',
        fontWeight: 'bold'
    }

});