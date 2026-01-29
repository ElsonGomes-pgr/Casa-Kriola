import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

/**
 * @param {Object} property 
 * @param {Function} onPress 
 */
export default function MinhaCasaCard({ property, onPress }) {
  const getTypeColor = (type) => {
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
        return '#61B566';
    }
  };


  const getStatusInfo = (status) => {
    switch (status) {
      case 'disponivel':
        return { text: 'Disponível', color: '#27AE60' };
      case 'ocupado':
        return { text: 'Ocupado', color: '#E94B3C' };
      case 'manutencao':
        return { text: 'Manutenção', color: '#F5A623' };
      default:
        return { text: 'Não definido', color: '#999' };
    }
  };

  const statusInfo = getStatusInfo(property.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {property.photos && property.photos.length > 0 ? (
          <Image
            source={{ uri: property.photos[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>🏠</Text>
          </View>
        )}
        
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(property.type) }]}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {property.title || 'Sem título'}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {property.price?.toLocaleString() || '0'} CVE
          </Text>
          <Text style={styles.period}>/mês</Text>
        </View>

        {property.address && (
          <Text style={styles.address} numberOfLines={1}>
            📍 {property.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 60,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    padding: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    minHeight: 44,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#61B566',
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
});
