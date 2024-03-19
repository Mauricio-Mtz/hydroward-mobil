import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { API_URL } from './../config/url';

export default function Monitoreo({ route }) {
    const navigation = useNavigation();
    const { estanqueId } = route.params;
    const [estanques, setEstanques] = useState([]);

    const Conteo = () => {
        navigation.navigate('Conteo');
    };

    const getEstanque = async () => {
        try {
            const formData = new FormData();
            formData.append('idEstanque', estanqueId);

            const response = await fetch(`${API_URL}/Estanques/obtenerEstanqueC`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            console.log(data);

            if (data.success) {
                const estanquesData = data.estanques.map(estanque => ({
                    nombre: estanque.nombre,
                    id: estanque.id,
                    maxTemp: estanque.temp_max,
                    minTemp: estanque.temp_min,
                    alimentacion: estanque.alimentacion,
                    tiempo_si_alim: estanque.si_alim,
                    tiempo_no_alim: estanque.no_alim,
                    maxPh: estanque.ph_max,
                    minPh: estanque.ph_min,
                    cantidad: estanque.cantidad,
                }));
                setEstanques(estanquesData);
            } else {
                alert('¡Error al obtener la información del estanque!');
            }
        } catch (error) {
            console.error('Error al obtener los datos de los estanques:', error);
        }
    };

    const goToEditar = async (estanqueId) => {
        try {
            navigation.navigate('Configuracion', { estanqueId });
        } catch (error) {
            console.error('Error al guardar el ID del estanque:', error);
        }
    };

    useEffect(() => {
        getEstanque();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {estanques.map((estanque, index) => (
                    <View style={styles.section} key={index}>
                        <Text style={styles.containerTitle}>"{estanque.nombre}"</Text>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Alimentación</Text>
                                <Text style={styles.subtitle}>Tipo de alimentación:</Text>
                                <Text style={styles.info}>{estanque.alimentacion}</Text>
                                <Text style={styles.subtitle}>Alimento en contenedor:</Text>
                                <Text style={styles.infoBase}>{'Base no relacional (kg)'}</Text>
                                <Text style={styles.subtitle}>Liberación de alimento:</Text>
                                <View style={styles.inputRow}>
                                    <Text style={styles.info}>{'Cada ' + estanque.tiempo_no_alim + ':00 horas'}</Text>
                                </View>
                                <Text style={styles.subtitle}>Durante:</Text>
                                <Text style={styles.info}>{estanque.tiempo_si_alim + ':00 horas'}</Text>
                            </View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Temperatura</Text>
                                <Text style={styles.subtitle}>Temperatura actual:</Text>
                                <Text style={styles.infoBase}>{'Base no relacional (C°)'}</Text>
                                <Text style={styles.subtitle}>Temperatura mínima:</Text>
                                <Text style={styles.info}>{estanque.minTemp + ' C°'}</Text>
                                <Text style={styles.subtitle}>Temperatura máxima:</Text>
                                <Text style={styles.info}>{estanque.maxTemp + ' C°'}</Text>
                            </View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Ph</Text>
                                <Text style={styles.subtitle}>Ph actual:</Text>
                                <Text style={styles.infoBase}>{'Base no relacional (Ph)'}</Text>
                                <Text style={styles.subtitle}>Ph mínimo:</Text>
                                <Text style={styles.info}>{'Ph = ' + estanque.minPh}</Text>
                                <Text style={styles.subtitle}>Ph máximo:</Text>
                                <Text style={styles.info}>{'Ph = ' + estanque.maxPh}</Text>
                            </View>
                        </View>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Conteo</Text>
                                <Text style={styles.subtitle}>Número de peces:</Text>
                                <Text style={styles.info}>{estanque.cantidad}</Text>
                                <View style={styles.btns}>
                                    <TouchableOpacity onPress={Conteo} style={[styles.btn, { backgroundColor: colors.successBorderSubtle }]}>
                                        <Text style={styles.btnText}>Configurar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.btns}>
                            <TouchableOpacity onPress={() => goToEditar(estanque.id)} style={[styles.btn, { backgroundColor: colors.warningBorderSubtle }]}>
                                <Text style={styles.btnText}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
        padding: 20,
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
        margin: 15,
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
    info: {
        fontSize: 18,
        color: colors.lightText,
        textAlign: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.lightText,
        borderRadius: 5,
        padding: 10,
    },
    infoBase: {
        fontSize: 18,
        color: colors.dangerBorderSubtle,
        textAlign: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.lightText,
        borderRadius: 5,
        padding: 10,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    btns: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
});
