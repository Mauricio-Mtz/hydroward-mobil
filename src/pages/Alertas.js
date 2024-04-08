import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './../config/url';
import { colors } from '../styles/colors';

export default function Alertas() {
    const navigation = useNavigation();
    const [alertas, setAlertas] = useState([]);

    const getAlertas = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const formData = new FormData();
            formData.append('idUser', userId);

            const response = await fetch(`${API_URL}/Alertas/obtener_alertas`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setAlertas(data.alertas);
            } else {
                alert('¡Error al obtener las alertas!');
            }
        } catch (error) {
            console.error('Error del servidor:', error);
        }
    };

    const deleteAlerta = async (id) => {
        try {
            const formData = new FormData();
            formData.append('id', id);

            const response = await fetch(`${API_URL}/Alertas/eliminar_alerta`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                setAlertas(alertas.filter(alerta => alerta.id !== id));
                alert('Alerta eliminada');
            } else {
                alert('¡Error al eliminar la alerta!');
            }
        } catch (error) {
            console.error('Error con el servidor:', error);
        }
    };

    useEffect(() => {
        getAlertas();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    {alertas.map(alerta => (
                        <View key={alerta.id} style={styles.section}>
                            <View style={styles.cardContainer}>
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>{alerta.mensaje}</Text>
                                    <Text style={styles.subtitle}>{alerta.fecha}</Text>
                                    <TouchableOpacity onPress={() => deleteAlerta(alerta.id)} style={[styles.btn, { backgroundColor: colors.danger }]}>
                                        <Text style={styles.btnText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <Navbar />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
        paddingTop: 20
    },
    section: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 10,
        marginBottom: 10
    },
    cardContainer: {
        paddingHorizontal: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'white',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
        textAlign: 'center'
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    btnText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
});
