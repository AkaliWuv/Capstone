import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Datos de ejemplo para la tabla
const pollosData = [
  { id: '1', cantidad: 10, fecha: '2024-10-04', acciones: 'Editar/Eliminar' },
  { id: '2', cantidad: 15, fecha: '2024-10-03', acciones: 'Editar/Eliminar' },
  { id: '3', cantidad: 8, fecha: '2024-10-02', acciones: 'Editar/Eliminar' },
  { id: '4', cantidad: 10, fecha: '2024-10-02', acciones: 'Editar/Eliminar' },
  // Puedes agregar más registros
];

function PollosScreen() {
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>Registro de Pollos</Text>
      ),
      headerTitleAlign: 'center', // Centrado del título
      headerTintColor: '#384EA2', // Color del botón de volver
    });
  }, [navigation]);

  // Función para renderizar cada registro (celda) como un desplegable
  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    return (
      <TouchableOpacity style={styles.tableRow} onPress={() => setSelectedId(isSelected ? null : item.id)}>
        <View style={styles.rowHeader}>
          <Text style={styles.rowText}>Cantidad: {item.cantidad}</Text>
          <Text style={styles.rowText}>Fecha: {item.fecha}</Text>
          <Icon name={isSelected ? 'chevron-up' : 'chevron-down'} size={16} color="#384EA2" />
        </View>
        {isSelected && (
          <View style={styles.rowDetails}>
            <Text style={styles.detailTitle}>Fecha Registro:</Text>
            <Text style={styles.detailText}>{item.fecha}</Text>
            <Text style={styles.detailTitle}>Acciones:</Text>
            <View style={styles.actionIcons}>
              <TouchableOpacity>
                <Icon name="edit" size={24} color="#384EA2" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="trash" size={24} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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

      {/* Tabla de registros */}
      <FlatList
        data={pollosData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        style={styles.tableContainer}
      />

      {/* Filtro de registros */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>Mostrando 1-10 de 100 registros</Text>
      </View>
    </View>
  );
}

export default PollosScreen;

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
  tableContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  tableRow: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#384EA2',
  },
  rowDetails: {
    marginTop: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
  },
  paginationContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  paginationText: {
    fontSize: 16,
    color: '#7D7D7D',
  },
});
