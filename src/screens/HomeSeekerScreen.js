import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';


export default function HomeSeekerScreen() {
  const SAO_VICENTE_REGION = {
    latitude: 16.8627,   
    longitude: -24.9956, 
    latitudeDelta: 0.05,  
    longitudeDelta: 0.05, 
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={SAO_VICENTE_REGION}
        showsUserLocation={true} 
        showsMyLocationButton={true} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1, 
  },
});
