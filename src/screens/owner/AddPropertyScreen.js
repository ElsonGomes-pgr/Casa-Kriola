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
  SafeAreaView,
} from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_CLOUD_NAME = 'dsndjgcrm'; 
const CLOUDINARY_UPLOAD_PRESET = 'imoveis_preset'; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


export default function AddPropertyScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...selectedUris]);
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


  const handleSaveProperty = async () => {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Preencha o título do imóvel');
      return;
    }

    if (!type.trim()) {
      Alert.alert('Atenção', 'Preencha o tipo do imóvel');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Atenção', 'Preencha o preço');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos uma foto');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para cadastrar um imóvel');
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < photos.length; i++) {
        const uri = photos[i];
        console.log(`Uploading imagem ${i + 1}/${photos.length}...`);
        
        const cloudinaryUrl = await uploadToCloudinary(uri);
        uploadedUrls.push(cloudinaryUrl);
      }

      await addDoc(collection(db, 'properties'), {
        title: title.trim(),
        type: type.trim(),
        price: parseFloat(price),
        address: address.trim() || '',
        description: description.trim(),
        photos: uploadedUrls,
        status: 'disponivel', 
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        'Sucesso', 
        'Imóvel cadastrado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.goBack();
              }
            }
          }
        ]
      );

      setTitle('');
      setType('');
      setPrice('');
      setAddress('');
      setDescription('');
      setPhotos([]);

    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      Alert.alert('Erro', 'Não foi possível salvar o imóvel. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };


  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          disabled={uploading}
        >
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Imóvel</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Título do Imóvel *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Apartamento T2 no Centro"
          value={title}
          onChangeText={setTitle}
          editable={!uploading}
        />

        <Text style={styles.label}>Tipo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: T2, Quarto, T0, T1, T3"
          value={type}
          onChangeText={setType}
          editable={!uploading}
        />

        <Text style={styles.label}>Preço Mensal (CVE) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 45000"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          editable={!uploading}
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua da Praia, Mindelo"
          value={address}
          onChangeText={setAddress}
          editable={!uploading}
        />

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o imóvel, comodidades, localização..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!uploading}
        />

        <Text style={styles.label}>Fotos *</Text>
        <TouchableOpacity
          style={[styles.photoButton, uploading && styles.buttonDisabled]}
          onPress={pickImage}
          disabled={uploading}
        >
          <Text style={styles.photoButtonText}>📷 Adicionar Fotos</Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            {photos.map((uri, index) => (
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
          style={[styles.saveButton, uploading && styles.buttonDisabled]}
          onPress={handleSaveProperty}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Imóvel</Text>
          )}
        </TouchableOpacity>

        {uploading && (
          <Text style={styles.uploadingText}>
            Fazendo upload das imagens... Aguarde.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#61B566',
    paddingHorizontal: 20,
    paddingVertical: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 19
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#61B566',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#61B566',
    fontSize: 16,
    fontWeight: '600',
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E94B3C',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  saveButton: {
    backgroundColor: '#61B566',
    padding: 18,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadingText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});