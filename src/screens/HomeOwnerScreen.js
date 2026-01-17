import React, { useState } from 'react';
import { Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Alert, } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 
import * as ImagePicker from 'expo-image-picker';


export default function HomeOwnerScreen() {
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState([]); 

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const selectedUris = result.assets.map(asset => asset.uri);
        setFotos([...fotos, ...selectedUris]);
      }
    };

  const handleSaveImovel = async () => {
  try {
    await addDoc(collection(db, 'imoveis'), {
      tipo: tipo,
      preco: preco,
      descricao: descricao,
      createdAt: serverTimestamp(),
    });

    Alert.alert('Sucesso', 'Imóvel salvo com sucesso!');
  } catch (error) { 
    console.log(error);
    Alert.alert('Erro', 'Erro ao salvar imóvel');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Cadastro de Espaço para Aluguel
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Tipo do imóvel (Casa, Apartamento...)"
        value={tipo}
        onChangeText={setTipo}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço mensal"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição do imóvel"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Adicionar Fotos</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
        {fotos.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 80, height: 80, marginRight: 10, marginBottom: 10, borderRadius: 6 }}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveImovel}>
        <Text style={styles.buttonText}>Salvar Imóvel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
