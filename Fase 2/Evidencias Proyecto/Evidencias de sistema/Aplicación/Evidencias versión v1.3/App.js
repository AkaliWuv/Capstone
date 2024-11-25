import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar las pantallas
import PollosScreen from './screens/PollosScreen';
import ComidaScreen from './screens/ComidaScreen';
import AnalisisScreen from './screens/AnalisisScreen';
import TemporizadorModal from './screens/TemporizadorModal';
import NivelesComidaScreen from './screens/NivelesComidaScreen';

const Stack = createStackNavigator();

// Definir la URL de la API aquí
const API_BASE_URL = 'https://68b8-186-189-103-178.ngrok-free.app';  // Reemplaza esta URL con tu URL real de la API

function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
  const [apiData, setApiData] = useState(null); // Estado para almacenar datos de la API
  const [apiError, setApiError] = useState(false); // Estado para manejar el error de la API

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '¡Buenos días!';
    else if (hour < 21) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    // Llama a la API de Ngrok al cargar la pantalla
    fetch(`${API_BASE_URL}`)  // URL sin el endpoint adicional
      .then(response => response.json())
      .then(data => {
        setApiData(data);  // Guarda los datos obtenidos de la API
        setApiError(false); // Resetea el error si la solicitud es exitosa
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
        setApiError(true);  // Establece el estado de error si algo falla
        setApiData(null);  // Resetea los datos si hubo un error
      });
  }, []);

  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Santiago' };
  const timeString = new Intl.DateTimeFormat('es-CL', options).format(currentTime);
  const dateString = currentTime.toLocaleDateString('es-CL');

  const opacity = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [timeString]);

  const openModal = () => {
    setModalVisible(true); // Abre el modal
  };

  const closeModal = () => {
    setModalVisible(false); // Cierra el modal
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('./assets/logo 1.png')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Animated.View style={{ opacity }}>
          <Text style={styles.time}>{timeString}</Text>
        </Animated.View>
        <Text style={styles.date}>{dateString}</Text>
        <View style={styles.spacer} />

        {/* Muestra datos de la API si están disponibles */}
        {apiError ? (
          <Text style={styles.apiError}>Error al cargar los datos de la API</Text>
        ) : (
          <View style={styles.apiDataContainer}>
            <Text style={styles.apiDataText}>Peso desde la API:</Text>
            <Text>{apiData ? `${apiData.peso} kg` : 'Cargando...'}</Text>
          </View>
        )}

        {/* Botón para abrir el temporizador */}
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Icon name="clock-o" size={120} color="#384EA2" style={styles.icon} />
          <Text style={styles.buttonText}>Automatizar</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />

      <View style={styles.rectangle}>
        <Text style={styles.sectionTitle}>Opciones</Text>
        {/* Botones para navegar a otras pantallas */}
        <TouchableOpacity style={styles.rectButton} onPress={() => navigation.navigate('Pollos')}>
          <View style={styles.iconContainer}>
            <Icon name="cutlery" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Cantidad de Pollos</Text>
            <Text style={styles.rectButtonDescription}>Cantidad total de pollos en el corral.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectButton} onPress={() => navigation.navigate('Comida')}>
          <View style={styles.iconContainer}>
            <Icon name="cutlery" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Cantidad de Comida</Text>
            <Text style={styles.rectButtonDescription}>Total de comida disponible para los pollos.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectButton} onPress={() => navigation.navigate('Analisis')}>
          <View style={styles.iconContainer}>
            <Icon name="bar-chart" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Análisis de Datos</Text>
            <Text style={styles.rectButtonDescription}>Análisis estadístico de los datos recolectados.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TemporizadorModal visible={modalVisible} onClose={closeModal} />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Pollos" component={PollosScreen} />
        <Stack.Screen name="Comida" component={ComidaScreen} />
        <Stack.Screen name="Analisis" component={AnalisisScreen} />
        <Stack.Screen name="NivelesComida" component={NivelesComidaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: 200, height: 200, alignSelf: 'center' },
  textContainer: { alignItems: 'center', marginVertical: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#384EA2' },
  time: { fontSize: 32, fontWeight: 'bold', color: '#384EA2' },
  date: { fontSize: 18, color: '#384EA2' },
  spacer: { height: 20 },
  apiDataContainer: { padding: 10, backgroundColor: '#eaeaea', borderRadius: 8, marginVertical: 10 },
  apiDataText: { fontSize: 16, color: '#384EA2', fontWeight: 'bold' },
  apiError: { color: 'red', fontWeight: 'bold', marginVertical: 10 },
  button: { alignItems: 'center', marginVertical: 20 },
  icon: { marginBottom: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#384EA2' },
  rectangle: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#384EA2' },
  rectButton: { flexDirection: 'row', alignItems: 'center', padding: 10, marginVertical: 8, backgroundColor: '#eaeaea', borderRadius: 8 },
  iconContainer: { marginRight: 10 },
  buttonContent: { flex: 1 },
  rectButtonText: { fontSize: 18, fontWeight: 'bold' },
  rectButtonDescription: { fontSize: 14, color: '#6b6b6b' },
});
