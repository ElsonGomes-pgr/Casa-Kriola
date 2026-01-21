import { View, Text, StyleSheet } from 'react-native';
//import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation"

export default function Home() {
  return (
    <View style={styles.container}>
      <View 
        topBarO
      >
        <Text>Top bar</Text>
      </View>
      <Text>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    backgroundColor: '#0000',
    marginBottom: '10px',
    marginTop: '15%'
  }
});
