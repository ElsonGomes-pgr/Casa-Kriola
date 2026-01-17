import React, { useState } from 'react';
import { Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert, } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; 

export default function HomeOwnerScreen() {
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

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
