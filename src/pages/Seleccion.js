import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Seleccion() {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const handleOptionPress = async (option) => {
    try {
      if (name !== '') {
        const idVenta = await AsyncStorage.getItem('idVenta');
        const data = {
          idVenta: idVenta,
          nombre: name,
        };
        console.log(data);
        const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
        const response = await fetch('http://192.168.100.79/hydroward_back/back/registrarNombreEstanque', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.idEstanque) {
            await AsyncStorage.setItem('idEstanque', responseData.idEstanque.toString());
            if (option === 'Automática') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auto' }],
              });
            } else {
              console.log(responseData);
              await AsyncStorage.setItem('idEM', responseData.idEstanque.toString());
              navigation.reset({
                index: 0,
                routes: [{ name: 'Manual' }],
              });
            }
          } else {
            alert('¡Ha ocurrido un error en el servidor!');
          }
        } else {
          alert('¡Ha ocurrido un error en la solicitud!');
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
