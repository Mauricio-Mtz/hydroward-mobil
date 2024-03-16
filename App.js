import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Scanner from './src/pages/Scanner';
import Profile from './src/pages/Profile';
import Auto from './src/pages/Auto';
import Registro from './src/pages/Registro';
import Configuracion from './src/pages/Configuracion';
import Seleccion from './src/pages/Seleccion';
import Monitoreo from './src/pages/Monitoreo';
import Conteo from './src/pages/Conteo';
import Manual from './src/pages/Manual';
import { colors } from './src/styles/colors';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.lightText,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} initialParams={{}} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="Configuracion" component={Configuracion} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Auto" component={Auto} />
        <Stack.Screen name="Seleccion" component={Seleccion} />
        <Stack.Screen name="Manual" component={Manual} />
        <Stack.Screen name="Monitoreo" component={Monitoreo} />
        <Stack.Screen name="Conteo" component={Conteo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
