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

const categories = [
  { id: '1', name: 'pollos' },
  { id: '2', name: 'comida' },
];

export default function MainScreen({ navigation }) {
  const [location, setLocation] = useState(null);  // Guarda la ubicación del dispositivo
  const [errorMsg, setErrorMsg] = useState(null);
  const [pollosCount, setPollosCount] = useState(0); // Estado para la cantidad de pollos

  // Obtiene la ubicación cuando el componente se monta
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);  // Guarda las coordenadas en el estado

      // Obtiene la cantidad de pollos desde la API
      try {
        const pollosResponse = await axios.get('http://10.0.2.2:5000/api/cantidad_pollos');
        setPollosCount(pollosResponse.data.total_pollos);  // Actualiza la cantidad de pollos
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    })();
  }, []);

  // Si la ubicación no está disponible, muestra un mensaje de error
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  // Si la ubicación aún no está disponible, muestra un cargando
  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')} // Ruta local de la imagen
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubText}>Bienvenido</Text>
          <View style={styles.locationRow}>
            <Text style={styles.headerMainText}>Times Square</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="bell" size={20} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="shopping-bag" size={20} color="#000" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Special Offers */}
        <View style={styles.specialOffer}>
          <View style={styles.offerText}>
            <Text style={styles.offerPercent}>30%</Text>
            <Text style={styles.offerDescription}>
              DISCOUNT ONLY VALID FOR TODAY!
            </Text>
          </View>
          <Image source={require('../assets/logo 1.png')} style={styles.offerImage} />
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
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          {categories.map((item) => (
            <View key={item.id} style={styles.categoryItem}>
              <View style={styles.categoryRectangle}>
                {item.name === 'pollos' && (
                  <Text style={styles.pollosCount}>{pollosCount}</Text> // Muestra la cantidad de pollos
                )}
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Main')} // Redirige a la pantalla de Inicio
        >
          <Icon name="home" size={24} color="#384EA1" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Pollos')} // Redirige a PollosScreen
        >
          <Icon name="leaf" size={24} color="#aaa" />
          <Text style={styles.navText}>Pollos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Comida')} // Redirige a ComidaScreen
        >
          <Icon name="cutlery" size={24} color="#aaa" />
          <Text style={styles.navText}>Comida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Analisis')} // Redirige a AnalisisScreen
        >
          <Icon name="bar-chart" size={24} color="#aaa" />
          <Text style={styles.navText}>Análisis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Perfil')} // Redirige a la pantalla de Perfil
        >
          <Icon name="user" size={24} color="#aaa" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginLeft: 10,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryRectangle: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollosCount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryText: {
    marginTop: 10,
    color: '#888',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  navItem: {
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
