import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';
import { Camera } from 'expo-camera';
import { API_URL } from './../config/url';

export default function Scanner() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [qrData, setQrData] = useState('');
    const [scanned, setScanned] = useState(false);

    const handleQrCode = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const data = {
                qrCode: qrData,
                idUser: userId
            };
            const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
            const response = await fetch(`${API_URL}/Estanques/ObtenerQrCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: formBody,
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log(data)
                    if (data.venta.existeEnEstanques) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    } else {
                        const detalleVentaId = data.venta.detalleVentaId;
                        // Navegar a la pantalla de selección con el id de detalle venta
                        navigation.navigate("Seleccion", { detalleVentaId });
                    }
                } else {
                    alert(data.message);
                }
            } else {
                console.log('Error en la solicitud:', response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener los datos del qr:', error);
        }
    };


    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setQrData(data);
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.cameraContainer}>
                            <Text style={[styles.centeredText, { color: colors.lightText }]}>
                                ¡Escanea el código QR de tu sistema para comenzar un nuevo registro!
                            </Text>
                            <Camera
                                style={styles.camera}
                                type={Camera.Constants.Type.front}
                                onBarCodeScanned={!scanned ? handleBarCodeScanned : undefined}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Código de sistema"
                                value={qrData}
                                onChangeText={setQrData}
                                maxLength={13}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleQrCode}>
                                <Text style={styles.buttonText}>Aceptar</Text>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.light,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    input: {
        borderWidth: 2,
        borderColor: colors.bodyColor,
        borderRadius: 5,
        marginTop: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width: '100%',
        backgroundColor: colors.primary,
        color: colors.lightText,
        textAlign: 'center',
    },
    navIcon: {
        width: 30,
        height: 30,
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
    },
    buttonText: {
        color: colors.lightText,
        fontSize: 16,
    },
});
