import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Picker as RnPicker, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { colors } from '../styles/colors';

export default function Conteo() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Estadísticas de Conteo</Text>
        <Image source={require('../../assets/images/grafica.png')} style={styles.image} />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bodyBg,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.lightText,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },
});
