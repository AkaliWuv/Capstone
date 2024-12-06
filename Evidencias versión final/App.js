import React, { useEffect, useState, useRef } from 'react';
import { AppState, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider } from './DarkModeContext';
import { ThemeProvider } from './ThemeContext'; // Ajusta la ruta según tu estructura
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar pantallas existentes
import IntroScreen from './screens/IntroScreen';
import RegisterScreen from './screens/RegisterScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import PinLoginScreen from './screens/PinLoginScreen';
import MainScreen from './screens/MainScreen';

// Importar nuevas pantallas
import PollosScreen from './screens/PollosScreen';
import ComidaScreen from './screens/ComidaScreen';
import AnalisisScreen from './screens/AnalisisScreen';
import TemporizadorModal from './screens/TemporizadorModal';
import NivelesComidaScreen from './screens/NivelesComidaScreen';
import PerfilScreen from './screens/PerfilScreen';  // Importar la pantalla Perfil
import LoginScreen from './screens/LoginScreen';  // Asegúrate de importar correctamente

const Stack = createStackNavigator();
const navigationRef = React.createRef();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
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
  };

  // Determinar la ruta inicial basándose en los datos del usuario
  useEffect(() => {
    const determineInitialRoute = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails'); // Datos del usuario
        const userPin = await AsyncStorage.getItem('userPin'); // PIN del usuario

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
      appState.current = nextAppState;
    });

    return () => subscription.remove();
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
  }

  return (
    <DarkModeProvider>
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
    </DarkModeProvider>
  );
};

export default App;
