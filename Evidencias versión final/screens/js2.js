import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';  // Importa la librería de ubicación
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = [
  { id: '1', name: 'pollos' },
  { id: '2', name: 'comida' },
];

export default function MainScreen({ navigation }) {
  const [location, setLocation] = useState(null);  // Guarda la ubicación del dispositivo
  const [errorMsg, setErrorMsg] = useState(null);
  const [comidaCount, setComidaCount] = useState(0);  // Estado para la cantidad de comida
  const [pollosCount, setPollosCount] = useState(0);  // Estado para la cantidad de pollos
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado del modo oscuro


  
  // Cargar la preferencia de tema desde AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
        console.log("Loaded theme:", JSON.parse(savedTheme)); // Debug log
      }
    };
    loadTheme();
  }, []);
  

  // Cambiar tema y guardar la preferencia en AsyncStorage
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    console.log("New theme:", newTheme); // Debug log
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme));
  };
  


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
  
      // Obtener la cantidad de pollos
      try {
        const pollosResponse = await axios.get('http://10.0.2.2:5000/api/cantidad_pollos');
        console.log('Pollos Response:', pollosResponse.data);  // Log de respuesta pollos
        if (pollosResponse.data && pollosResponse.data.total_pollos) {
          setPollosCount(pollosResponse.data.total_pollos);
          console.log('Pollos count actualizado:', pollosCount);  // Verifica si se actualizó correctamente
        } else {
          console.error('Respuesta inesperada para pollos:', pollosResponse.data);
        }
      } catch (err) {
        console.error('Error fetching pollos data:', err.message);  // Log de error en pollos
      }
  
      // Obtener la cantidad de comida
      try {
        const comidaResponse = await axios.get('http://10.0.2.2:5000/api/cantidad_comida');
        console.log('Comida Response:', comidaResponse.data);  // Log de respuesta comida
  
        // Verificar si la respuesta tiene el valor correcto
        if (comidaResponse.data && comidaResponse.data.total_comida !== undefined) {
          console.log('Total comida recibido:', comidaResponse.data.total_comida);  // Verifica el valor específico
          setComidaCount(comidaResponse.data.total_comida);
        } else {
          console.error('Respuesta inesperada para comida:', comidaResponse.data);  // Si el valor no está disponible
        }
      } catch (err) {
        console.error('Error fetching comida data:', err.message);  // Log de error en comida
      }
    })();
  }, []);
  
  

 // Si la ubicación no está disponible, muestra un mensaje de error
if (errorMsg) {
  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
      ]}
    >
      <Text
        style={[
          styles.errorText,
          isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
        ]}
      >
        {errorMsg}
      </Text>
    </View>
  );
}

// Si la ubicación aún no está disponible, muestra un cargando
if (!location) {
  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
      ]}
    >
      <Text
        style={[
          styles.loadingText,
          isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
        ]}
      >
        Loading...
      </Text>
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
    <StatusBar style={isDarkMode ? "light" : "dark"} />

    {/* Header */}
    <View
      style={[
        styles.header,
        isDarkMode && { backgroundColor: '#1E1E1E' }, // Fondo del header en modo oscuro
      ]}
    >
      <Image
        source={require('../assets/logo.png')}
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
            Avijuelas
          </Text>
        </View>
      </View>
    </View>

    <ScrollView>
      {/* Special Offers */}
      <View
        style={[
          styles.specialOffer,
          isDarkMode && { backgroundColor: '#1E1E1E' }, // Fondo en modo oscuro
        ]}
      >
        <View style={styles.offerText}>
          <Text
            style={[
              styles.offerPercent,
              isDarkMode && { color: '#FFAA00' }, // Color destacado en modo oscuro
            ]}
          >
            30%
          </Text>
          <Text
            style={[
              styles.offerDescription,
              isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
            ]}
          >
            DISCOUNT ONLY VALID FOR TODAY!
          </Text>
        </View>
        <Image source={require('../assets/logo 1.png')} style={styles.offerImage} />
      </View>

      {/* Mapa dentro del rectángulo */}
      <View
        style={[
          styles.mapContainer,
          isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' }, // Fondo y borde en modo oscuro
        ]}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map((item) => (
          <View key={item.id} style={styles.categoryItem}>
            <View
              style={[
                styles.categoryRectangle,
                isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Fondo y borde en modo oscuro
              ]}
            >
              {item.name === 'pollos' && (
                <View style={styles.pollosContainer}>
                  <Text
                    style={[
                      styles.pollosTitle,
                      isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
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
                      isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
                    ]}
                  >
                    Comida Total
                  </Text>
                  <Text
                    style={[
                      styles.pollosCount,
                      isDarkMode && { color: '#AAAAAA' }, // Contador en modo oscuro
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
    isDarkMode && { backgroundColor: '#1E1E1E', borderTopColor: '#333' }, // Fondo y borde en modo oscuro
  ]}
>
  {[
    { name: 'Main', icon: 'home', label: 'Inicio' },
    { name: 'Pollos', icon: 'leaf', label: 'Pollos' },
    { name: 'Comida', icon: 'cutlery', label: 'Comida' },
    { name: 'Analisis', icon: 'bar-chart', label: 'Análisis' },
    { name: 'Perfil', icon: 'user', label: 'Perfil' },
  ].map((item, index) => {
    // Determina si el botón es el activo basado en la ruta actual
    const isActive = navigation.isFocused() && navigation.getCurrentRoute().name === item.name;

    return (
      <TouchableOpacity
        key={index}
        style={styles.navItem}
        onPress={() => navigation.navigate(item.name)}
      >
        <Icon
          name={item.icon}
          size={24}
          color={isActive ? (isDarkMode ? '#FFFFFF' : '#384EA1') : (isDarkMode ? '#AAAAAA' : '#aaa')}
        />
        <Text
          style={[
            styles.navText,
            isActive
              ? [styles.navTextActive, isDarkMode && { color: '#FFFFFF' }]
              : isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

  </View>
);

}

const styles = StyleSheet.create({
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
});
