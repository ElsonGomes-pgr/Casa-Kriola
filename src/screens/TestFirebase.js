import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function TestFirebase() {

  const testarFirebase = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        "elson@gmail.com",
        "123456"
      );

      Alert.alert("✅ Firebase OK", "Usuário criado com sucesso!");
      console.log(user.user);
    } catch (error) {
      Alert.alert("❌ Erro", error.message);
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Teste Firebase 🚀</Text>
      <Button title="Testar Firebase" onPress={testarFirebase} />
    </View>
  );
}
