import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import * as Google from 'expo-auth-session/providers/google';
import { API_URL } from './../config/url';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const [registroExitoso, setRegistroExitoso] = useState(false);


    const [userInfo, setUserInfo] = useState(null);

    /*   const [request, response, promptAsync] = Google.useAuthRequest({
           webClientId:
               "610496027106-aml6c0slp7gh1e4sj98qreajkgbimfmg.apps.googleusercontent.com",
           iosClientId:
               "610496027106-v4gctcf53na6u798l87eciunt10ednqe.apps.googleusercontent.com",
           androidClientId:
               "610496027106-0q5fq56ahcpn3muhammavsrgrncdhqc2.apps.googleusercontent.com",
       });
   
       useEffect(() => {
           handleSignInGoogle();
       }, [response])
   
       async function handleSignInGoogle() {
           const user = await getLocalUser();
           if (!user) {
               if (response?.type === "success") {
                   getUserInfo(response.authentication.accessToken);
               }
           } else {
               setUserInfo(user);
               navigation.reset({
                   index: 0,
                   routes: [{ name: 'Home' }],
               });
           }
       }
   
       const getLocalUser = async () => {
           const data = await AsyncStorage.getItem("@User");
           if (!data) return null;
           return JSON.parse(data);
       }
   
       const getUserInfo = async (token) => {
           if (!token) return;
           try {
               const response = await fetch(
                   "https://www.googleapis.com/userinfo/v2/me",
                   {
                       headers: { Authorization: `Bearer ${token}` },
                   }
               );
               const user = await request.json();
               await AsyncStorage.setItem("@User", JSON.stringify(user));
               setUserInfo(user);
               navigation.reset({
                   index: 0,
                   routes: [{ name: 'Home' }],
               });
           } catch (error) {
               console.log(error);
           }
       }
   */
    const Registro = () => {
        navigation.navigate('Registro');
    };
    const handleLogin = () => {
        if (!isValidEmail(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }
        if (password.trim() === '') {
            alert('Por favor, introduce una contraseña.');
            return;
        }
        const data = {
            email: email,
            password: password,
        };

        const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

        fetch(`${API_URL}/Login/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formBody,
        })
            .then(response => response.json())
            .then(async data => {
                console.log('Respuesta del servidor:', data);
                if (data.success) {
                    // Guardar datos de sesión en AsyncStorage
                    await AsyncStorage.setItem('userId', data.usuario.id.toString());
                    await AsyncStorage.setItem('userType', data.usuario.tipo.toString());
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                } else {
                    alert('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                alert('Se produjo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
            });
    };
    
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    {registroExitoso && ( // Mostrar mensaje si el registro fue exitoso
                        <Text style={styles.registroExitosoText}>¡Registro exitoso! Por favor, inicia sesión.</Text>
                    )}
                    <View style={styles.imageContainer}>
                        <Image source={require('../../assets/images/HydroWard.jpg')} style={styles.image} />
                    </View>
                    <View style={styles.formWrapper}>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Electrónico"
                                keyboardType="email-address"
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                            />
                            <View style={styles.passwordInput}>
                                <TextInput
                                    style={styles.passwordField}
                                    placeholder="Contraseña"
                                    secureTextEntry={!showPassword}
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                />
                                <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
                                    <Text style={styles.showPasswordButtonText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.googleButton} onPress={() => {
                            promptAsync();
                        }}>
                            <Image source={require('../../assets/images/google.png')} style={styles.googleImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={Registro} style={styles.registerButton} >
                            <Text style={styles.registerText}>¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registroExitosoText: {
        marginTop: 10,
        color: colors.successText,
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 20,
    },

    imageContainer: {
        marginTop: 50,
        marginBottom: 30,
        alignItems: 'center',
    },
    image: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    formWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 200,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.light,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: '100%',
        backgroundColor: colors.light,
        color: colors.lightText,
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        backgroundColor: colors.light,
        borderRadius: 5
    },
    passwordField: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: colors.light,
        color: colors.lightText,
    },
    showPasswordButton: {
        padding: 8,
    },
    showPasswordButtonText: {
        color: colors.primary,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: colors.lightText,
        fontSize: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    googleButton: {
        marginBottom: 10,
    },
    googleImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    registerButton: {
        marginBottom: 20,
    },
    registerText: {
        fontSize: 16,
        color: colors.lightText,
    },
    link: {
        color: colors.primary,
    },
});
