import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_CLOUD_NAME = 'dsndjgcrm'; 
const CLOUDINARY_UPLOAD_PRESET = 'imoveis_preset'; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function HomeOwnerScreen() {
  const [tipo, setTipo] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotos, setFotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setFotos([...fotos, ...selectedUris]);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg', 
        name: `photo_${Date.now()}.jpg`,
      });
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      formData.append('folder', 'imoveis');

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Erro no upload para Cloudinary');
      }

      const data = await response.json();
      
      return data.secure_url;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const handleSaveImovel = async () => {
    if (!tipo || !preco || !descricao) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (fotos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma foto');
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < fotos.length; i++) {
        const uri = fotos[i];
        console.log(`Uploading imagem ${i + 1}/${fotos.length}...`);
        
        const cloudinaryUrl = await uploadToCloudinary(uri);
        uploadedUrls.push(cloudinaryUrl);
      }

      await addDoc(collection(db, 'imoveis'), {
        tipo: tipo,
        preco: preco,
        descricao: descricao,
        fotos: uploadedUrls, 
        createdAt: serverTimestamp(),
      });

      setTipo('');
      setPreco('');
      setDescricao('');
      setFotos([]);

      Alert.alert('Sucesso', 'Imóvel cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      Alert.alert('Erro', 'Não foi possível salvar o imóvel. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    setFotos(newFotos);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Espaço para Aluguel</Text>

      <TextInput
        style={styles.input}
        placeholder="Tipo do imóvel (Casa, Apartamento...)"
        value={tipo}
        onChangeText={setTipo}
        editable={!uploading}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço mensal"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        editable={!uploading}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição do imóvel"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        editable={!uploading}
      />

      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={pickImage}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>Adicionar Fotos</Text>
      </TouchableOpacity>

      {fotos.length > 0 && (
        <View style={styles.photosContainer}>
          {fotos.map((uri, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePhoto(index)}
                disabled={uploading}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, uploading && styles.buttonDisabled]}
        onPress={handleSaveImovel}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Salvar Imóvel</Text>
        )}
      </TouchableOpacity>

      {uploading && (
        <Text style={styles.uploadingText}>
          Fazendo upload das imagens... Aguarde.
        </Text>
      )}
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
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadingText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});