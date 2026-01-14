import { View, Text, StyleSheet } from 'react-native';

export default function Splash  () {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Casa Kriola</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
