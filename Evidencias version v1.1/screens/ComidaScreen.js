import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import RegistroComidaModal from './RegistroComidaModal'; // Asegúrate de que la ruta sea correcta
import { Picker } from '@react-native-picker/picker'; // Asegúrate de tener instalada esta librería

function ComidaScreen() {
  const [comidaData, setComidaData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('fecha');
  const [order, setOrder] = useState('asc');
  const navigation = useNavigation();

  const fetchComidaData = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/comida');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setComidaData(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudieron cargar los datos de comida.');
    }
  };

  useEffect(() => {
    fetchComidaData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>Registro de Comida</Text>
      ),
      headerTitleAlign: 'center',
      headerTintColor: '#384EA2',
    });
  }, [navigation]);

  // Manejar la lógica de filtrado
  const getFilteredData = () => {
    let filteredData = [...comidaData];

    // Ordenar por tipo de filtro
    filteredData.sort((a, b) => {
      const valueA = filterType === 'fecha' ? new Date(a.fecha) : (filterType === 'cantidad' ? a.cantidad : a.hora);
      const valueB = filterType === 'fecha' ? new Date(b.fecha) : (filterType === 'cantidad' ? b.cantidad : b.hora);
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });

    return filteredData;
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id.toString();
    return (
      <TouchableOpacity style={styles.tableRow} onPress={() => setSelectedId(isSelected ? null : item.id.toString())}>
        <View style={styles.rowHeader}>
          <Text style={styles.rowText}>Cantidad: {item.cantidad} kg</Text>
          <Text style={styles.rowText}>Fecha: {item.fecha}</Text>
          <Icon name={isSelected ? 'chevron-up' : 'chevron-down'} size={20} color="#384EA2" />
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

  const handleRegisterComida = async (cantidad, descripcion) => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/comida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad, descripcion }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la comida');
      }

      const newComida = await response.json();
      setComidaData((prevData) => [...prevData, newComida]);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar la comida.');
    }
  };

  // Filtrado automático en base a los filtros seleccionados
  useEffect(() => {
    setCurrentPage(1); // Reiniciar a la primera página al aplicar nuevos filtros
  }, [filterType, order, itemsPerPage]);

  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);
  const paginatedData = getFilteredData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo 1.png')} style={styles.logo} />
        <TouchableOpacity>
          <Icon name="search" size={30} color="#384EA2" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Cantidad:</Text>
            <Picker
              selectedValue={itemsPerPage}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setItemsPerPage(itemValue);
              }}
            >
              <Picker.Item label="5" value={5} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="15" value={15} />
              <Picker.Item label="20" value={20} />
            </Picker>
          </View>

          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Filtrar por:</Text>
            <Picker
              selectedValue={filterType}
              style={styles.picker}
              onValueChange={(itemValue) => setFilterType(itemValue)}
            >
              <Picker.Item label="Fecha" value="fecha" />
              <Picker.Item label="Cantidad" value="cantidad" />
              <Picker.Item label="Hora" value="hora" />
            </Picker>
          </View>

          <View style={styles.filterColumn}>
            <Text style={styles.filterLabel}>Ordenar:</Text>
            <Picker
              selectedValue={order}
              style={styles.picker}
              onValueChange={(itemValue) => setOrder(itemValue)}
            >
              <Picker.Item label="Ascendente" value="asc" />
              <Picker.Item label="Descendente" value="desc" />
            </Picker>
          </View>
        </View>
      </View>

      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedId}
        style={styles.tableContainer}
      />

      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>Página {currentPage} de {totalPages}</Text>
        <View style={styles.paginationButtons}>
          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RegistroComidaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRegister={handleRegisterComida}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#384EA2',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 60,
    resizeMode: 'contain',
  },
  registerButton: {
    backgroundColor: '#384EA2',
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 18,
    color: '#384EA2',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderColor: '#384EA2',
    borderWidth: 1,
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
    textAlign: 'center',
    flex: 1,
  },
  rowDetails: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
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
  paginationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  paginationButton: {
    fontSize: 16,
    color: '#384EA2',
    marginHorizontal: 10,
  },
  disabledButton: {
    color: '#C0C0C0',
  },
});

export default ComidaScreen;
