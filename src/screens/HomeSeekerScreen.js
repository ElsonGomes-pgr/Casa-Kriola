import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
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


  const handleMarkerPress = (property) => {
    console.log('Imóvel clicado:', property.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
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
              pinColor={getPinColor(property.type)}
              onPress={() => handleMarkerPress(property)}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <View 
                    style={[
                      styles.typeBadge, 
                      { backgroundColor: getPinColor(property.type) }
                    ]}
                  >
                    <Text style={styles.typeText}>{property.type}</Text>
                  </View>
                  <Text style={styles.calloutTitle} numberOfLines={2}>
                    {property.title}
                  </Text>
                  <Text style={styles.calloutPrice}>
                    {property.price.toLocaleString()} CVE/mês
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.placeholder}>Lista de imóveis em breve...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 0.6,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 0.4,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  calloutPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
});
