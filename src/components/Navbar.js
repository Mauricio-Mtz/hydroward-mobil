import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';

const Navbar = () => {
  const navigation = useNavigation();

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const goToScanner = () => {
    navigation.navigate('Scanner');
  };

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} onPress={goToHome}>
        <Image source={require('../../assets/images/home.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={goToScanner}>
        <Image source={require('../../assets/images/qr.png')} style={styles.navIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={goToProfile}>
        <Image source={require('../../assets/images/porfile.png')} style={styles.navIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dark,
    backgroundColor: colors.light,
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

export default Navbar;
