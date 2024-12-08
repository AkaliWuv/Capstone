import React, { useEffect, useState, useRef } from 'react';
<<<<<<< HEAD
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider } from './DarkModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
=======
import { AppState, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider } from './DarkModeContext';
import { ThemeProvider } from './ThemeContext'; // Ajusta la ruta según tu estructura
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

// Importar pantallas existentes
import IntroScreen from './screens/IntroScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import PinLoginScreen from './screens/PinLoginScreen';
import MainScreen from './screens/MainScreen';
<<<<<<< HEAD
import PollosScreen from './screens/PollosScreen';
import ComidaScreen from './screens/ComidaScreen';
import AnalisisScreen from './screens/AnalisisScreen';

import NivelesComidaScreen from './screens/NivelesComidaScreen';
import PerfilScreen from './screens/PerfilScreen';
import LoginScreen from './screens/LoginScreen';
=======

// Importar nuevas pantallas
import PollosScreen from './screens/PollosScreen';
import ComidaScreen from './screens/ComidaScreen';
import AnalisisScreen from './screens/AnalisisScreen';
import TemporizadorModal from './screens/TemporizadorModal';
import NivelesComidaScreen from './screens/NivelesComidaScreen';
import PerfilScreen from './screens/PerfilScreen';  // Importar la pantalla Perfil
import LoginScreen from './screens/LoginScreen';  // Asegúrate de importar correctamente
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

const Stack = createStackNavigator();
const navigationRef = React.createRef();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
<<<<<<< HEAD
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
=======
  const [isUserActive, setIsUserActive] = useState(true); // Estado para controlar la actividad
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef(null);

  // Lógica para el cambio de estado de inactividad
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsUserActive(false); // Marcar inactividad
      Alert.alert(
        'Inactividad detectada',
        '¿Sigues ahí?',
        [
          { text: 'Sí', onPress: () => { setIsUserActive(true); resetTimer(); } },
          { text: 'Cerrar sesión', onPress: () => navigationRef.current?.navigate('PinLogin') },
        ],
        { cancelable: false }
      );
    }, 50000000); // Ajusta este tiempo según lo necesario
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  };

  // Determinar la ruta inicial basándose en los datos del usuario
  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
<<<<<<< HEAD
        const userDetails = await AsyncStorage.getItem('userDetails');
        const userPin = await AsyncStorage.getItem('userPin');
=======
        const userDetails = await AsyncStorage.getItem('userDetails'); // Datos del usuario
        const userPin = await AsyncStorage.getItem('userPin'); // PIN del usuario
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

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

<<<<<<< HEAD
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

=======
  // Redirigir a `PinLogin` si la app pasa al fondo
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        !isUserActive // Si el usuario está inactivo, redirigir
      ) {
        AsyncStorage.getItem('userPin').then((userPin) => {
          if (userPin) {
            navigationRef.current?.navigate('PinLogin'); // Redirigir a PinLogin
          }
        });
      }
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
      appState.current = nextAppState;
    });

    return () => subscription.remove();
<<<<<<< HEAD
  }, [shouldRequestPin, isBypassingPin]);

  // Mostrar una pantalla de carga inicial si no se determina la ruta
  if (!initialRoute) {
    return null; // Puedes agregar aquí una pantalla de carga personalizada
=======
  }, [isUserActive]);

  // Redirigir siempre al iniciar la app si hay un registro
  useEffect(() => {
    const checkUserOnLaunch = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        const userPin = await AsyncStorage.getItem('userPin');

        if (userDetails && userPin) {
          navigationRef.current?.navigate('PinLogin'); // Redirigir directamente
        }
      } catch (error) {
        console.error('Error al verificar usuario al iniciar:', error);
      }
    };

    checkUserOnLaunch();
  }, []);

  // Mostrar pantalla de carga inicial si aún no se determina la ruta
  if (!initialRoute) {
    return null; // Opcional: agrega aquí una pantalla de carga personalizada si deseas
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  }

  return (
    <DarkModeProvider>
<<<<<<< HEAD
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
=======
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Pantallas de la aplicación */}
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CreatePin" component={CreatePinScreen} />
        <Stack.Screen name="PinLogin" component={PinLoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        
        {/* Nuevas pantallas */}
        <Stack.Screen name="Pollos" component={PollosScreen} />
        <Stack.Screen name="Comida" component={ComidaScreen} />
        <Stack.Screen name="Analisis" component={AnalisisScreen} />
        <Stack.Screen name="Temporizador" component={TemporizadorModal} />
        <Stack.Screen name="NivelesComida" component={NivelesComidaScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
    </DarkModeProvider>
  );
};

export default App;
