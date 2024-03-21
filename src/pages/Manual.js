import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { API_URL } from './../config/url';

export default function Manual({ route }) {
    const navigation = useNavigation();
    const { detalleVentaId, name } = route.params;
    const [alimentacion, setAlimentacion] = useState('');
    const [liberacionAlimento, setLiberacionAlimento] = useState('');
    const [durante, setDurante] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [phMin, setPhMin] = useState('');
    const [phMax, setPhMax] = useState('');

    const guardar = async () => {

        if (
            !alimentacion ||
            !liberacionAlimento ||
            !durante ||
            !tempMin ||
            !tempMax ||
            !phMin ||
            !phMax
        ) {
            alert('Por favor complete todos los campos.');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            const data = {
                nombre: name,
                alimentacion: alimentacion,
                noAlim: liberacionAlimento,
                siAlim: durante,
                tempMin: tempMin,
                tempMax: tempMax,
                phMin: phMin,
                phMax: phMax,
                idVenta: detalleVentaId,
                idUser: userId
            };
            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            const response = await fetch(`${API_URL}/Estanques/registrarEstanqueManual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody,
            });
            if (response.ok) {
                await AsyncStorage.setItem('idEM', '');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
                alert('¡Registro exitoso!')
            } else {
                alert('¡Ha ocurrido un error en la solicitud!');
            }
        } catch (error) {
            console.error('Ha ocurrido un error:', error);
            alert('¡Ha ocurrido un error en la solicitud!');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.section}>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Alimentación</Text>
                            <Text style={styles.subtitle}>Tipo de alimentación:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tipo de alimentación"
                                placeholderTextColor={colors.light}
                                onChangeText={setAlimentacion}
                            />
                            <Text style={styles.subtitle}>Tiempo de compuerta abierta:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Liberación de alimento"
                                placeholderTextColor={colors.light}
                                onChangeText={setLiberacionAlimento}
                                keyboardType='numeric'
                            />
                            <Text style={styles.subtitle}>Tiempo de compuerta cerrada:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Durante"
                                placeholderTextColor={colors.light}
                                onChangeText={setDurante}
                                keyboardType='numeric'
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Temperatura</Text>
                            <Text style={styles.subtitle}>Temperatura mínima:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Temperatura mínima"
                                placeholderTextColor={colors.light}
                                onChangeText={setTempMin}
                                keyboardType='decimal-pad'
                            />
                            <Text style={styles.subtitle}>Temperatura máxima:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Temperatura máxima"
                                placeholderTextColor={colors.light}
                                onChangeText={setTempMax}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>PH</Text>
                            <Text style={styles.subtitle}>PH mínimo:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ph mínimo"
                                placeholderTextColor={colors.light}
                                onChangeText={setPhMin}
                                keyboardType='decimal-pad'
                            />
                            <Text style={styles.subtitle}>PH máximo:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ph máximo"
                                placeholderTextColor={colors.light}
                                onChangeText={setPhMax}
                                keyboardType='decimal-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={guardar} style={[styles.footerButton, { backgroundColor: colors.successText }]}>
                            <Text style={styles.footerButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
    },
    section: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.lightBg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.borderColor,
        padding: 10,
        marginTop: 15,
        marginBottom: 15,
    },
    cardContainer: {
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.lightText,
    },
    containerTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: colors.warning,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.warning,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.lightText,
        textAlign: 'center',
        marginBottom: 10,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 14,
        color: colors.lightText,
        textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: colors.lightText,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: colors.lightText,
        textAlign: 'center',
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerButton: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButtonText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
    btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    btn: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
});
