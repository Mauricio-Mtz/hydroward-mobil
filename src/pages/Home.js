import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './../config/url';

export default function Home() {
    const navigation = useNavigation();
    const [estanques, setEstanques] = useState([]);


    const goToMonitoreo = async (estanqueId) => {
        console.log('Estanque seleccionado: ' + estanqueId);
        try {
            await AsyncStorage.setItem('estanqueC', estanqueId.toString());
            navigation.navigate('Monitoreo');
        } catch (error) {
            console.error('Error al guardar el ID del estanque:', error);
        }
    };


    const goToScanner = () => {
        navigation.navigate('Scanner');
    };

    const getEstanques = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const formData = new FormData();
            formData.append('idUser', userId);

            const response = await fetch(`${API_URL}/Estanques/obtenerEstanques`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setEstanques(data.estanques);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error al obtener los datos de los estanques:', error);
        }
    };


    useEffect(() => {
        getEstanques();
    }, []);


    return (
        <>
            <View style={[styles.container, { backgroundColor: colors.bodyBg }]}>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={[styles.title, { color: colors.lightText }]}>HYDROWARD</Text>
                        </View>
                        <View style={styles.cardContainer}>
                            {estanques.length > 0 ? (
                                estanques.map(estanque => (
                                    <TouchableOpacity style={styles.card} key={estanque.id} onPress={() => goToMonitoreo(estanque.id)}>
                                        <Image source={require('../../assets/images/salmon.png')} style={styles.cardImage} />
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.cardTitle, { color: colors.lightText }]}>{estanque.nombre}</Text>
                                            <TouchableOpacity style={styles.button} onPress={() => goToMonitoreo(estanque.id)}>
                                                <Text style={styles.buttonText}>Monitoreo</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View>
                                    <Text style={[styles.centeredText, { color: colors.warning }]}>¡No hay ningún estanque registrado!</Text>
                                    <View>
                                        <TouchableOpacity style={styles.button} onPress={goToScanner}>
                                            <Text style={styles.buttonText}>Registrar un estanque</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View >
                </ScrollView >
            </View >
            <Navbar />
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.lightText,
    },
    camera: {
        aspectRatio: 1,
        width: '85%',
        borderWidth: 2,
    },
    centeredText: {
        textAlign: 'center',
        margin: 15,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        borderBlockColor: colors.light
    },
    buttonText: {
        color: colors.lightText,
        fontSize: 16,
        alignItems: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    card: {
        width: '80%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginBottom: 20,
        overflow: 'hidden',
        backgroundColor: colors.lightBgSubtle,
    },
    cardImage: {
        width: 85,
        height: 85,
        borderRadius: 50,
        marginRight: 15,
    },
    cardContent: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: colors.light,
        borderRadius: 5,
        margin: 20,
        paddingHorizontal: 50,
        paddingVertical: 8,
        width: '80%',
        backgroundColor: colors.primary,
    },
    cardButton: {
        marginTop: 10,
        backgroundColor: colors.primary,
        borderRadius: 5,
        padding: 10,
    },
    cardButtonText: {
        color: colors.lightText,
        textAlign: 'center',
        fontSize: 16,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.borderColor,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    navIcon: {
        width: 30,
        height: 30,
    },
});
