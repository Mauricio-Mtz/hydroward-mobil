import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { API_URL } from './../config/url';

export default function Monitoreo({ route }) {
    const navigation = useNavigation();
    const { estanqueId } = route.params;
    const [estanque, setEstanque] = useState([]);
    const [dataNoRelacional, setDataNoRelacional] = useState({});

    const getEstanque = async () => {
        try {
            const formData = new FormData();
            formData.append('idEstanque', estanqueId);

            const response = await fetch(`${API_URL}/Estanques/obtenerEstanqueC`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            // console.log(data);

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
                setEstanque(estanquesData[0]);
            } else {
                alert('¡Error al obtener la información del estanque!');
            }
        } catch (error) {
            console.error('Error al obtener los datos de los estanques:', error);
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/Firebase/get_data`)
            .then(response => response.json())
            .then(data => {
                // Filtra los datos para obtener el estanque especifico
                const estanque = data.data.filter(dato => dato.id_estanque == estanqueId);
                // Ordena los datos por fecha y obtén el último registro
                const ultimoRegistro = estanque.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
                setDataNoRelacional(ultimoRegistro);
            })
            .catch(error => console.error(error));
    }, []);

    const goToEditar = async (estanqueId) => {
        try {
            navigation.navigate('Configuracion', { estanqueId });
        } catch (error) {
            console.error('Error al guardar el ID del estanque:', error);
        }
    };
    const goToConteo = async (estanqueId) => {
        try {
            navigation.navigate('Conteo', { estanqueId });
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
                <View style={styles.section}>
                    <Text style={styles.containerTitle}>"{estanque.nombre}"</Text>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Alimentación</Text>
                            <Text style={styles.subtitle}>Tipo de alimentación:</Text>
                            <Text style={styles.infoBase}>{estanque.alimentacion}</Text>
                            <Text style={dataNoRelacional && dataNoRelacional.alimentacion ? styles.infoSuccess : styles.infoDanger}>{dataNoRelacional && dataNoRelacional.alimentacion ? 'Hay alimento' : 'No hay alimento'}</Text>
                            <View style={styles.column}>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Liberación:</Text>
                                    <Text style={styles.infoWarning}>Cada {estanque.tiempo_no_alim}:00 horas</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Apertura:</Text>
                                    <Text style={styles.infoWarning}>Durante {estanque.tiempo_si_alim}:00 horas</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Temperatura</Text>
                            <View style={styles.row}>
                                <Text style={styles.subtitle}>Temperatura actual:</Text>
                                <Text style={dataNoRelacional && dataNoRelacional.temperatura >= estanque.minTemp && dataNoRelacional.temperatura <= estanque.maxTemp ? styles.infoBase : styles.infoDanger}>{dataNoRelacional && dataNoRelacional.temperatura} C°</Text>
                            </View>
                            <View style={styles.column}>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Temperatura mínima:</Text>
                                    <Text style={styles.infoWarning}>{estanque.minTemp} C°</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Temperatura máxima:</Text>
                                    <Text style={styles.infoWarning}>{estanque.maxTemp} C°</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Ph</Text>
                            <View style={styles.row}>
                                <Text style={styles.subtitle}>Ph actual:</Text>
                                <Text style={dataNoRelacional && (dataNoRelacional.ph >= estanque.minPh && dataNoRelacional.ph <= estanque.maxPh) ? styles.infoBase : styles.infoDanger}>{dataNoRelacional && dataNoRelacional.ph} PH</Text>
                            </View>
                            <View style={styles.column}>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Ph mínimo:</Text>
                                    <Text style={styles.infoWarning}>Ph = {estanque.minPh}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.subtitle}>Ph máximo:</Text>
                                    <Text style={styles.infoWarning}>Ph = {estanque.maxPh}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Conteo</Text>
                            <Text style={styles.subtitle}>Número de peces: {dataNoRelacional && dataNoRelacional.conteo}</Text>
                            <View style={styles.btns}>
                                <TouchableOpacity onPress={() => goToConteo(estanque.id)} style={[styles.btn, { backgroundColor: colors.successBorderSubtle }]}>
                                    <Text style={styles.btnText}>Agregar conteo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.btns}>
                        <TouchableOpacity onPress={() => goToEditar(estanque.id)} style={[styles.btnFooter, { backgroundColor: colors.warningBorderSubtle }]}>
                            <Text style={styles.btnText}>Editar</Text>
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
        paddingTop: 20
    },
    section: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: colors.lightBg,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.borderColor,
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
        color: colors.lightText,
    },
    containerTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        marginBottom: 20,
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
    infoBase: {
        fontSize: 18,
        color: colors.info,
        textAlign: 'center',
        marginBottom: 10,
    },
    infoDanger: {
        fontSize: 18,
        color: colors.danger,
        textAlign: 'center',
        marginBottom: 10,
    },
    infoSuccess: {
        fontSize: 18,
        color: colors.success,
        textAlign: 'center',
        marginBottom: 10,
    },
    infoWarning: {
        fontSize: 18,
        color: colors.warning,
        textAlign: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    column: {
        flex: 1,
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
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    btnFooter: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: "89%"
    },
    btnText: {
        color: colors.lightText,
        fontSize: 16,
        textAlign: 'center',
    },
});
