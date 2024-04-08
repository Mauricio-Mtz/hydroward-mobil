import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../styles/colors';
import { API_URL } from './../config/url';

export default function Conteo({ route }) {
    const { estanqueId } = route.params;
    const [dataNoRelacional, setDataNoRelacional] = useState([]);
    const [estanqueActual, setEstanqueActual] = useState({});
    const [conteo, setConteo] = useState('');
    const [nuevoConteo, setNuevoConteo] = useState('');
    const navigation = useNavigation();

    // Función para manejar el envío del nuevo conteo al servidor
    const insertConteo = async () => {
        console.log(estanqueActual)
        try {
            const formData = new FormData();
            formData.append('id_estanque', estanqueActual.id_estanque);
            formData.append('alimentacion', estanqueActual.alimentacion);
            formData.append('conteo', nuevoConteo);
            formData.append('ph', estanqueActual.ph);
            formData.append('temperatura', estanqueActual.temperatura);

            const response = await fetch(`${API_URL}/Firebase/test`, {
                method: 'POST',
                body: formData,
            });

            obtenerConteo()
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerConteo()
    }, []);
    obtenerConteo = async () => {
        fetch(`${API_URL}/Firebase/get_data`)
            .then(response => response.json())
            .then(data => {
                // Filtra los datos para obtener el estanque específico
                const estanque = data.data.filter(dato => dato.id_estanque == estanqueId);
                setDataNoRelacional(estanque);
                // Ordena los datos por fecha y obtén el último registro
                const ultimoRegistro = estanque.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
                setEstanqueActual(ultimoRegistro);
                setConteo(ultimoRegistro.conteo.toString()); // Establece el conteo del último registro como string
            })
            .catch(error => console.error(error));
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.title}>Estadísticas de Conteo</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={nuevoConteo}
                        onChangeText={setNuevoConteo}
                        placeholder="Nuevo conteo"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.button} onPress={insertConteo}>
                        <Text style={styles.buttonText}>Enviar Conteo</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={styles.column}>Fecha</Text>
                        <Text style={styles.column}>Conteo</Text>
                    </View>
                    {dataNoRelacional.map((dato, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.column}>{dato.fecha}</Text>
                            <Text style={styles.column}>{dato.conteo}</Text>
                        </View>
                    ))}
                </View>
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
    scrollViewContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.lightText,
    },
    table: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    column: {
        flex: 1,
        textAlign: 'center',
        color: colors.lightText,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 10,
        color: colors.lightText,
        textAlign: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: colors.lightText,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
});
