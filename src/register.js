import React from 'react';
import { View, Text, StyleSheet, Button ,TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';

export default function Register({navigation}){

   return(
    <View style={styles.container}>
        <View style={styles.topBar}>
            <Text style={styles.title}>Make your Register</Text>

        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#68c6ddff',
        flex: 1,
        justifyContent:'center'
    },
    topBar:{
        backgroundColor:'#378859ff',
        height: '60%',
        width: '80%',
        borderRadius: '12%',
        alignSelf:'center'
    },
    title:{
        color: '#ffff',
        marginTop: 24,
        marginRight: 44
    }
});