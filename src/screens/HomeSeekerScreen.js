import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockProperties } from '../../Data/mockProperties';


export default function HomeSeekerScreen() {
  const SAO_VICENTE_REGION = {
    latitude: 16.8627,   
    longitude: -24.9956, 
    latitudeDelta: 0.05,  
    longitudeDelta: 0.05, 
  };

  const getPinColor = (type) => {
    switch (type) {
      case 'Quarto':
        return '#4A90E2';
      case 'T0':
        return '#50C878'; 
      case 'T1':
        return '#F5A623';   
      case 'T2':
        return '#E94B3C'; 
      case 'T3':
        return '#9013FE'; 
      default:
        return '#FF0000'; 
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={SAO_VICENTE_REGION}
        showsUserLocation={true} 
        showsMyLocationButton={true} 
      >
       {mockProperties.map((property) => (
          <Marker
            key={property.id}
            coordinate={{
              latitude: property.latitude,
              longitude: property.longitude,
            }}
            title={property.title}
            description={`${property.price.toLocaleString()} CVE`}
            pinColor={getPinColor(property.type)}
          />
        ))}
      </MapView>
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
