import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider } from './DarkModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Importar pantallas existentes
import IntroScreen from './screens/IntroScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import PinLoginScreen from './screens/PinLoginScreen';
import MainScreen from './screens/MainScreen';
import PollosScreen from './screens/PollosScreen';
import ComidaScreen from './screens/ComidaScreen';
import AnalisisScreen from './screens/AnalisisScreen';

import NivelesComidaScreen from './screens/NivelesComidaScreen';
import PerfilScreen from './screens/PerfilScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();
const navigationRef = React.createRef();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const appState = useRef(AppState.currentState);
  const [shouldRequestPin, setShouldRequestPin] = useState(false);
  const [isBypassingPin, setIsBypassingPin] = useState(false); // Estado para manejar bypass temporal

  const sensitiveScreens = ['Main', 'Pollos', 'Comida', 'Analisis', 'NivelesComida', 'Perfil']; // Pantallas sensibles

  // Configurar permisos de notificaciones
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permiso para notificaciones denegado.');
      }
    };
    requestPermissions();
  }, []);

  // Función para enviar una notificación local
  const sendLogoutNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Cierre de sesión',
        body: 'Se cerró tu sesión por seguridad.',
        sound: true,
      },
      trigger: null, // Enviar inmediatamente
    });
  };

  // Determinar la ruta inicial basándose en los datos del usuario
  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        const userPin = await AsyncStorage.getItem('userPin');

        if (!userDetails) {
          setInitialRoute('Intro'); // Usuario no registrado
        } else if (!userPin) {
          setInitialRoute('CreatePin'); // Usuario registrado pero sin PIN
        } else {
          setInitialRoute('PinLogin'); // Usuario registrado con PIN
        }
      } catch (error) {
        console.error('Error al determinar la ruta inicial:', error);
      }
    };

    determineInitialRoute();
  }, []);

  // Detectar cuando la app pasa al fondo y activar la lógica de PIN
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        // Si salimos de una pantalla sensible y no estamos en bypass, marcamos que se necesita el PIN
        if (!isBypassingPin) {
          const currentRoute = navigationRef.current?.getCurrentRoute()?.name;
          if (sensitiveScreens.includes(currentRoute)) {
            setShouldRequestPin(true);
          }
        }
      }

      if (appState.current.match(/background/) && nextAppState === 'active' && shouldRequestPin) {
        // Redirigir a la pantalla de PIN y enviar una notificación
        setShouldRequestPin(false);
        navigationRef.current?.navigate('PinLogin');
        sendLogoutNotification();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [shouldRequestPin, isBypassingPin]);

  // Mostrar una pantalla de carga inicial si no se determina la ruta
  if (!initialRoute) {
    return null; // Puedes agregar aquí una pantalla de carga personalizada
  }

  return (
    <DarkModeProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          {/* Pantallas principales */}
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CreatePin" component={CreatePinScreen} />
          <Stack.Screen name="PinLogin" component={PinLoginScreen} />
          <Stack.Screen name="Main" component={MainScreen} />

          {/* Pantallas adicionales */}
          <Stack.Screen name="Pollos">
  {(props) => <PollosScreen {...props} setIsBypassingPin={setIsBypassingPin} />}
</Stack.Screen>

          <Stack.Screen name="Comida" component={ComidaScreen} />
          <Stack.Screen name="Analisis" component={AnalisisScreen} />
         
          <Stack.Screen name="NivelesComida" component={NivelesComidaScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DarkModeProvider>
  );
};

export default App;
