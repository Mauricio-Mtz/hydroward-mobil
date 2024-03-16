import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Auto() {
    const navigation = useNavigation();
    const [selectedFish, setSelectedFish] = useState();
    const [fishData, setFishData] = useState([]);

    const cancelar = () => {
        navigation.navigate('Home');
    };

    const continuar = async () => {
        try {
            const idEstanque = await AsyncStorage.getItem('idEstanque');
            const data = {
                fish: selectedFish,
                estanque: idEstanque,
            };
            console.log(data);
            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            const response = await fetch('http://192.168.100.79/hydroward_back/back/registrarPezEstanque', {
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
                alert('¡Registro Exitoso!')
            } else {
                alert('¡Ha ocurrido un error en la solicituuuuuuuuud!');
            }
        } catch (error) {
            console.error('Ha ocurrido un error:', error);
            alert('¡Ha ocurrido un error en la solicitud!');
        }
    };



    const getFish = async () => {
        try {
            const response = await fetch('http://192.168.100.79/hydroward_back/back/obtenerPeces');
            if (response.ok) {
                const data = await response.json();
                setFishData(data);
            } else {
                console.error('¡La solicitud no fue exitosa!');
            }
        } catch (error) {
            console.error('Ha ocurrido un error:', error);
        }
    };

    useEffect(() => {
        getFish();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <Text style={styles.title}>Configuración</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.alert}>
                    <Text style={styles.alertText}>Selecciona tipo de pez a monitorear en un contenedor</Text>
                </View>
                {fishData.map((fish, index) => (
                    <View style={styles.cardContainer} key={index}>
                        <TouchableOpacity
                            style={[styles.card, selectedFish === fish.id && styles.selectedCard]}
                            onPress={() => { console.log(selectedFish); setSelectedFish(fish.id); }}
                        >

                            {/*<Image source={{ uri: `../../assets/images/${fish.imagen}` }} style={styles.cardImage} />*/}
                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{fish.nombre}</Text>
                                <Text style={styles.cardText}>pH del agua: {fish.ph_min} - {fish.ph_max}</Text>
                                <Text style={styles.cardText}>Temperatura: {fish.temperatura_min} -  {fish.temperatura_max}</Text>
                                <Text style={styles.cardText}>Tipo de alimentación: {fish.alimentacion}</Text>
                                <Text style={styles.cardText}>Horas sin alimento al día: {fish.tiempo_no_alim}</Text>
                                <Text style={styles.cardText}>Horas con alimento al día: {fish.tiempo_si_alim}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footerSection}>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={continuar} style={[styles.footerButton, { backgroundColor: colors.success }]}>
                        <Text style={styles.footerButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    alert: {
        backgroundColor: colors.dark,
        padding: 10,
        borderRadius: 5,
        margin: 20,
    },
    alertText: {
        color: colors.lightText,
        textAlign: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.light,
        backgroundColor: colors.dark,
    },
    selectedCard: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardBody: {
        padding: 10,
        backgroundColor: colors.white,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.lightText,
    },
    cardText: {
        fontSize: 14,
        color: colors.lightText,
    },
    footerSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerButton: {
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '80  %',
    },
    footerButtonText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
});
