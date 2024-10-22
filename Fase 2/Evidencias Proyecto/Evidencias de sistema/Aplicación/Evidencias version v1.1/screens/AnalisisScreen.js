import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

function AnalisisScreen() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>Análisis de Datos</Text>
      ),
      headerTitleAlign: 'center', // Centrado del título
      headerTintColor: '#384EA2', // Color del botón de volver
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo y botón de búsqueda */}
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo 1.png')} style={styles.logo} />
      
        <TouchableOpacity>
          <Icon name="search" size={30} color="#384EA2" />
        </TouchableOpacity>
      </View>

      {/* Botón Registrar */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      {/* Filtro */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtro:</Text>
      </View>

      {/* Sección de Análisis */}
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisText}>Análisis de Datos</Text>
      </View>
    </View>
  );
}

export default AnalisisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20, // Tamaño de la letra
    fontWeight: 'bold', // Negrita
    color: '#384EA2', // Color corporativo
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250, // Aumentado el tamaño del logo
    height: 60,
    resizeMode: 'contain',
  },
  registerButton: {
    backgroundColor: '#384EA2', // Color corporativo
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    color: '#384EA2',
    fontWeight: 'bold',
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  analysisText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#384EA2',
  },
});
