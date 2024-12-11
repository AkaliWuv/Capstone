import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { DarkModeContext } from '../DarkModeContext';
import { WebView } from 'react-native-webview';
import { API_BASE_URL } from '../config';
import * as Location from 'expo-location';  // Importa la librería de ubicación

const categories = [
  { id: '1', name: 'pollos' },
  { id: '2', name: 'comida' },
];

export default function MainScreen({ navigation, route }) {
  const [location, setLocation] = useState(null); // Ubicación del dispositivo
  const [sensorData, setSensorData] = useState(null); // Datos del sensor
  const [errorMsg, setErrorMsg] = useState(null); // Error general
  const { isDarkMode } = useContext(DarkModeContext);
  const [comidaCount, setComidaCount] = useState(0);
  const [pollosCount, setPollosCount] = useState(0);

  useEffect(() => {
    (async () => {
      // Solicitar permiso de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        return;
      }

      // Obtener ubicación actual
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación');
      }

      // Obtener datos de pollos y comida
      try {
        const pollosResponse = await axios.get(`${API_BASE_URL}/api/cantidad_pollos`);
        setPollosCount(pollosResponse.data?.total_pollos || 0);
      } catch (error) {
        console.error('Error al obtener datos de pollos:', error);
      }

      try {
        const comidaResponse = await axios.get(`${API_BASE_URL}/api/cantidad_comida`);
        setComidaCount(comidaResponse.data?.total_comida || 0);
      } catch (error) {
        console.error('Error al obtener datos de comida:', error);
      }

      // Obtener datos del sensor
      try {
        const response = await axios.get(
          'https://api.thingspeak.com/channels/2776457/feeds.json?api_key=H9J4E5HF52YWY1BM&results=2'
        );
        if (response.data.feeds && response.data.feeds.length > 0) {
          setSensorData(response.data.feeds[0]);
        } else {
          setErrorMsg('No se encontraron datos del sensor.');
        }
      } catch (error) {
        setErrorMsg('Error al obtener los datos del sensor.');
        console.error(error);
      }
    })();
  }, []);

  // Mostrar mensaje de error si ocurre algún problema
  if (errorMsg) {
    return (
      <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
        <Text style={[styles.errorText, isDarkMode && { color: '#FFFFFF' }]}>{errorMsg}</Text>
      </View>
    );
  }

  // Mostrar cargando si faltan ubicación o datos del sensor
  if (!location || !sensorData) {
    return (
      <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
        <View style={styles.loadingContainer}>
          {/* Primera imagen, como el logo */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.loadingImage}
          />
         
        </View>
      </View>
    );
  }
  

  
  

  return (
    <View
        style={[
            styles.container,
            isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
        ]}
    >
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />

        {/* Header */}
        <View
            style={[
                styles.header,
                isDarkMode && { backgroundColor: '#121212' }, // Fondo del header en modo oscuro
            ]}
        >
            <Image
                source={require('../assets/logo.png')} // Ruta local de la imagen
                style={styles.profileImage}
            />
            <View style={styles.headerTextContainer}>
                <Text
                    style={[
                        styles.headerSubText,
                        isDarkMode && { color: '#AAAAAA' }, // Texto secundario en modo oscuro
                    ]}
                >
                    Bienvenido
                </Text>
                <View style={styles.locationRow}>
                    <Text
                        style={[
                            styles.headerMainText,
                            isDarkMode && { color: '#FFFFFF' }, // Texto principal en modo oscuro
                        ]}
                    >
                        Avijaulas
                    </Text>
                </View>
            </View>
        </View>

        <ScrollView>
            {/* Special Offers */}
            <View style={[styles.sensorDataContainer, isDarkMode && { backgroundColor: '#333' }]}>
    {/* Gráfico */}
    <View style={styles.graphContainer}>
      <WebView
        source={{ uri: 'https://thingspeak.com/channels/2776457/charts/1?api_key=H9J4E5HF52YWY1BM' }} // URL del gráfico
        style={{ width: '230%' }} // Ajusta la altura y el diseño del gráfico
      />
    </View>
    {/* Datos del sensor */}
    <Text style={[styles.sensorDataText, isDarkMode && { color: '#FFFFFF' }]}>
    Peso de la última comida: {sensorData.field1} Kg
    </Text>
  </View>

            {/* Mapa dentro del rectángulo */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude, // Usa la latitud actual
                        longitude: location.longitude, // Usa la longitud actual
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {/* Marcador en la ubicación actual */}
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                    />
                </MapView>
            </View>

            {/* Categories */}
            <View
                style={[
                    styles.categories,
                    isDarkMode && { backgroundColor: '#121212' }, // Fondo de categorías en modo oscuro
                ]}
            >
                {categories.map((item) => (
                    <View key={item.id} style={styles.categoryItem}>
                        <View
                            style={[
                                styles.categoryRectangle,
                                isDarkMode && { backgroundColor: '#333' }, // Rectángulo en modo oscuro
                            ]}
                        >
                            {item.name === 'pollos' && (
                                <View style={styles.pollosContainer}>
                                    <Text
                                        style={[
                                            styles.pollosTitle,
                                            isDarkMode && { color: '#FFFFFF' }, // Título de categoría en modo oscuro
                                        ]}
                                    >
                                        Pollos Totales
                                    </Text>
                                    <Text
                                        style={[
                                            styles.pollosCount,
                                            isDarkMode && { color: '#AAAAAA' }, // Contador en modo oscuro
                                        ]}
                                    >
                                        x {pollosCount}
                                    </Text>
                                </View>
                            )}
                            {item.name === 'comida' && (
                                <View style={styles.pollosContainer}>
                                    <Text
                                        style={[
                                            styles.pollosTitle,
                                            isDarkMode && { color: '#FFFFFF' },
                                        ]}
                                    >
                                        Comida Total
                                    </Text>
                                    <Text
                                        style={[
                                            styles.pollosCount,
                                            isDarkMode && { color: '#AAAAAA' },
                                        ]}
                                    >
                                        {comidaCount} Kg.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View
            style={[
                styles.navBar,
                isDarkMode && { backgroundColor: '#1E1E1E', borderTopColor: '#333' }, // Fondo en modo oscuro
            ]}
        >
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Main')} // Redirige a la pantalla de Inicio
            >
                <Icon
                    name="home"
                    size={24}
                    color={isDarkMode ? '#374EA3' : '#384EA1'}
                />
                <Text
                    style={[
                        styles.navTextActive,
                        isDarkMode && { color: '#374EA3' }, // Texto activo en modo oscuro
                    ]}
                >
                    Inicio
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Pollos')} // Redirige a PollosScreen
            >
                <Icon
                    name="leaf"
                    size={24}
                    color={isDarkMode ? '#AAAAAA' : '#aaa'}
                />
                <Text
                    style={[
                        styles.navText,
                        isDarkMode && { color: '#AAAAAA' }, // Texto inactivo en modo oscuro
                    ]}
                >
                    Pollos
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Comida')} // Redirige a ComidaScreen
            >
                <Icon
                    name="cutlery"
                    size={24}
                    color={isDarkMode ? '#AAAAAA' : '#aaa'}
                />
                <Text
                    style={[
                        styles.navText,
                        isDarkMode && { color: '#AAAAAA' },
                    ]}
                >
                    Comida
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Analisis')} // Redirige a AnalisisScreen
            >
                <Icon
                    name="bar-chart"
                    size={24}
                    color={isDarkMode ? '#AAAAAA' : '#aaa'}
                />
                <Text
                    style={[
                        styles.navText,
                        isDarkMode && { color: '#AAAAAA' },
                    ]}
                >
                    Análisis
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('Perfil')} // Redirige a la pantalla de Perfil
            >
                <Icon
                    name="user"
                    size={24}
                    color={isDarkMode ? '#AAAAAA' : '#aaa'}
                />
                <Text
                    style={[
                        styles.navText,
                        isDarkMode && { color: '#AAAAAA' },
                    ]}
                >
                    Perfil
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,  // Ocupa todo el espacio disponible
    justifyContent: 'center',  // Centra verticalmente
    alignItems: 'center',  // Centra horizontalmente
  },

  loadingImage: {
    width: 250,  // Ajusta el tamaño según lo necesites
    height: 250,  // Ajusta el tamaño según lo necesites
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  categoryRectangle: {
    width: '100%',
    height: 150,
    backgroundColor: '#384EA1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10, // Para separar el texto de los bordes
  },
  pollosContainer: {
    flex: 1, // Asegura que ocupe el espacio completo del rectángulo
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',  // Centra el contenido horizontalmente
    textAlign: 'center', // Asegura que el texto se centre
  },
  pollosTitle: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5, // Espacio entre el título y la cantidad
    textAlign: 'center', // Asegura que el texto esté centrado
  },
  pollosCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center', // Asegura que la cantidad también esté centrada
  },
  categoryText: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerSubText: {
    fontSize: 12,
    color: '#888',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginLeft: 15,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
  },
  specialOffer: {
    flexDirection: 'row',
    backgroundColor: '#384EA1',
    borderRadius: 10,
    margin: 15,
    padding: 20,
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    margin: 15,
    paddingRight: 30,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  offerText: {
    flex: 1,
  },
  offerPercent: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  offerDescription: {
    fontSize: 14,
    color: '#fff',
  },
  offerImage: {
    width: 70,
    height: 70,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: '45%',
  },
  categoryRectangle: {
    width: '100%',
    height: 150,
    backgroundColor: '#384EA1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pollosCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryText: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#aaa',
  },
  navTextActive: {
    fontSize: 12,
    color: '#384EA1',
  },
  specialOffer: {
    flexDirection: 'column',
    backgroundColor: '#384EA1',
    borderRadius: 10,
    margin: 15,
    padding: 20,
    alignItems: 'center',
  },
  sensorDataContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#384EA1',
    borderRadius: 10,
    alignItems: 'center',
  },
  graphContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sensorDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});
