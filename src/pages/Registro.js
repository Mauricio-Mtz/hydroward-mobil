import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

export default function Registro() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const Login = () => {
        navigation.navigate('Login');
    };
    const handleSignIn = () => {
        if (!isValidEmail(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }
        if (name.trim() === '') {
            alert('Por favor, introduce un nombre.');
            return;
        } if (lastName.trim() === '') {
            alert('Por favor, introduce un nombre.');
            return;
        }
        if (number.trim() === '') {
            alert('Por favor, introduce un teléfono.');
            return;
        }
        if (number.trim().length !== 10 || isNaN(number.trim())) {
            alert('Por favor, introduce un número de teléfono válido de 10 dígitos.');
            return;
        }
        if (password.trim() === '') {
            alert('Por favor, introduce una contraseña.');
            return;
        }
        const data = {
            email: email,
            password: password,
            name: name,
            lastName: lastName,
            number: number,
        };

        const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

        fetch('http://192.168.100.79/hydroward_back/back/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formBody,
        })
            .then(response => response.json())
            .then(async data => {
                console.log('Respuesta del servidor:', data);
                if (data) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login', params: { registroExitoso: true } }],
                    });
                } else {
                    alert('Registro fallido. Por favor, verifica tus datos.');
                }
            })

            .catch(error => {
                console.error('Error al realizar el registro:', error);
                alert('Se produjo un error al realizar el registro. Por favor, inténtalo de nuevo.');
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
                    <View style={styles.imageContainer}>
                        <Image source={require('../../assets/images/HydroWard.jpg')} style={styles.image} />
                    </View>
                    <View style={styles.formWrapper}>
                        <View style={styles.formContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de usuario"
                                onChangeText={(text) => setName(text)}
                                value={name}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Apelllido(s)"
                                onChangeText={(text) => setLastName(text)}
                                value={lastName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Correo Electrónico"
                                keyboardType="email-address"
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Teléfono"
                                onChangeText={(number) => setNumber(number)}
                                value={number}
                                keyboardType="numeric"
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
                            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                                <Text style={styles.buttonText}>Registrarse</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.googleButton} onPress={""}>
                            <Image source={require('../../assets/images/google.png')} style={styles.googleImage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={Login} style={styles.registerButton}>
                            <Text style={styles.registerText}>¿Ya tienes una cuenta? <Text style={styles.link}>Iniciar Sesión</Text></Text>
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
