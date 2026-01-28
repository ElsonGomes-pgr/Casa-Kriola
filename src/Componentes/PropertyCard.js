import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * @param {Object} property - Dados do imóvel
 * @param {Function} onPress - Callback ao clicar no card
 * @param {Boolean} isSelected - Se o card está selecionado
 */
export default function PropertyCard({ property, onPress, isSelected }) {
 
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
        return '#FF0000';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected, 
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(property.type) }]}>
        <Text style={styles.typeText}>{property.type}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {property.title}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {property.price.toLocaleString()} CVE
        </Text>
        <Text style={styles.period}>/mês</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 280, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowOpacity: 0.2,
    elevation: 6,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    minHeight: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});
