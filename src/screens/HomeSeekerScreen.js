import { View, Text, StyleSheet } from 'react-native';

export default function HomeSeekerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home do Inquilino</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
