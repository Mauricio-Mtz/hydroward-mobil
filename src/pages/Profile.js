import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/colors';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch('http://192.168.100.79/hydroward_back/back/obtenerUsuarioM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `id=${userId}`,
      });
      const data = await response.json();
      if (data.success) {
        setUserData({
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          correo: data.user.correo,
          telefono: data.user.telefono,
          tipo: data.user.tipo
        });
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };


  const logOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.user}>
              <Image source={require('../../assets/images/user.png')} style={styles.userImage} />
              <Text style={styles.title}>{userData.tipo ? userData.tipo.toUpperCase() : ''}</Text>
            </View>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nombre:"
                placeholderTextColor={colors.lightText}
                value={userData.nombre + " " + userData.apellido}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Teléfono:"
                placeholderTextColor={colors.lightText}
                value={'+52 ' + userData.telefono}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Correo:"
                placeholderTextColor={colors.lightText}
                value={userData.correo}
                editable={false}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Contraseña:"
                  placeholderTextColor={colors.lightText}
                  value={'••••••••'}
                  editable={false}
                />
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonR} onPress={logOut}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <Navbar />
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bodyBg,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  user: {
    alignItems: 'center',
    marginBottom: 70,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.lightText,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.white,
    color: colors.lightText,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonR: {
    backgroundColor: colors.dangerBorderSubtle,
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.lightText,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.white,
    color: colors.lightText,
  },
  showPasswordText: {
    marginLeft: 10,
    color: colors.primary,
  },
});
