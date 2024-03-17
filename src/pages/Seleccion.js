import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './../config/url';

export default function Seleccion({ route }) {
  const navigation = useNavigation();
  const { detalleVentaId } = route.params;
  const [name, setName] = useState('');

  const handleOptionPress = (option) => {
    try {
      if (name !== '' && detalleVentaId) {
        if (option === 'Automática') {
          navigation.navigate('Auto', { detalleVentaId, name });
        } else {
          navigation.navigate('Manual', { detalleVentaId, name });
        }
      } else {
        alert('¡Ingrese un nombre para su estanque!');
      }
    } catch (error) {
      console.error('Ha ocurrido un error:', error);
      alert('¡Ha ocurrido un error en la solicitud!');
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={[styles.cardTitle, { color: colors.lightText }]}>Configuración del Estanque</Text>
      </View>
      <View style={styles.nameSection}>
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nombre del Estanque:</Text>
            <TextInput style={styles.input}
              placeholder="Ej. Salmón"
              placeholderTextColor={colors.light}
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>
        </View>
      </View>
      <View style={styles.configSection}>
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tipo de Configuración:</Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleOptionPress('Automática')}
              >
                <Text style={styles.btnText}>Automática</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleOptionPress('Manual')}
              >
                <Text style={styles.btnText}>Manual</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodyBg,
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  nameSection: {
    marginBottom: 20,
  },
  configSection: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.lightBg,
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightText,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.lightText,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.bodyColor,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: colors.successText,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
  },
  btnText: {
    color: colors.lightText,
    fontSize: 16,
    textAlign: 'center',
  },
});
