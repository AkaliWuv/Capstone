import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import RegistroComidaModal from './RegistroComidaModal'; // Ensure this path is correct
import { Picker } from '@react-native-picker/picker';
import EditComidaModal from './EditComidaModal'; // Ensure this path is correct

function ComidaScreen() {
  const [comidaData, setComidaData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal visibility
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('fecha');
  const [order, setOrder] = useState('asc');
  const [selectedItem, setSelectedItem] = useState(null); // To track the item being edited
  const navigation = useNavigation();
  const [searchVisible, setSearchVisible] = useState(false); // Control visibility of search bar
  const [searchText, setSearchText] = useState(''); // Text for search
  const [confirmationVisible, setConfirmationVisible] = useState(false); // Estado para la alerta de eliminación
  const [deletionSuccessVisible, setDeletionSuccessVisible] = useState(false); // Estado para la alerta de éxito
  const [itemToDelete, setItemToDelete] = useState(null); // Estado para almacenar el item a eliminar

  const fetchComidaData = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/comida');
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        fecha: item.fecha.split('T')[0], // Format date
      }));
      setComidaData(formattedData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load food data.');
    }
  };

  useEffect(() => {
    fetchComidaData();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.headerTitle}>Registro de Comida</Text>,
      headerTitleAlign: 'center',
      headerTintColor: '#384EA2',
    });
  }, [navigation]);

  const getFilteredData = () => {
    let filteredData = [...comidaData];
    filteredData.sort((a, b) => {
      const valueA = filterType === 'fecha' ? new Date(a.fecha) : (filterType === 'cantidad' ? a.cantidad : a.hora);
      const valueB = filterType === 'fecha' ? new Date(b.fecha) : (filterType === 'cantidad' ? b.cantidad : b.hora);
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
   // Apply search filter
   if (searchText) {
    filteredData = filteredData.filter(item => item.tipo.toLowerCase().includes(searchText.toLowerCase()));
  }
  
  return filteredData;
};

  const handleEdit = (item) => {
    setSelectedItem(item); // Set the item to be edited
    setEditModalVisible(true); // Open edit modal
  };

  const handleDelete = (itemId) => {
    setItemToDelete(itemId); // Guarda el ID del item a eliminar
    setConfirmationVisible(true); // Muestra la alerta de eliminación
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/api/comida/${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting item');
      }
      fetchComidaData(); // Refresh data after deletion
      setConfirmationVisible(false); // Cierra la alerta de confirmación
      setDeletionSuccessVisible(true); // Muestra la alerta de éxito
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete the item.');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id.toString();
    return (
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() => setSelectedId(isSelected ? null : item.id.toString())}
      >
        <View style={styles.rowHeader}>
          <Text style={styles.rowText}>Tipo: {item.tipo}</Text>
          <Text style={styles.rowText}>Cantidad: {item.cantidad} kg</Text>
          <Icon name={isSelected ? 'chevron-up' : 'chevron-down'} size={20} color="#384EA2" />
        </View>
        {isSelected && (
          <View style={styles.rowDetails}>
            <Text style={styles.detailTitle}>Cantidad:</Text>
            <Text style={styles.detailText}>{item.cantidad} kg</Text>
            <Text style={styles.detailTitle}>Fecha Registro:</Text>
            <Text style={styles.detailText}>{item.fecha}</Text>
            <Text style={styles.detailTitle}>Hora:</Text>
            <Text style={styles.detailText}>{item.hora}</Text>
            <Text style={styles.detailTitle}>Descripción:</Text>
            <Text style={styles.detailText}>{item.descripcion || 'No disponible'}</Text>
            <Text style={styles.detailTitle}>Acciones:</Text>
            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Icon name="edit" size={24} color="#384EA2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Icon name="trash" size={24} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterType, order, itemsPerPage]);

  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);
  const paginatedData = getFilteredData().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo 1.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
          <Icon name="search" size={30} color="#384EA2" />
        </TouchableOpacity>
      </View>

      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tipo"
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

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
              onValueChange={(itemValue) => setItemsPerPage(itemValue)}
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
          <TouchableOpacity onPress={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>

       {/* Alerta de confirmación de eliminación */}
       {confirmationVisible && (
        <View style={styles.alertContainer}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Confirmar Eliminación</Text>
            <Text style={styles.alertMessage}>¿Estás seguro de que deseas eliminar este elemento?</Text>
            <View style={styles.alertActions}>
              <TouchableOpacity onPress={() => setConfirmationVisible(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Alerta de éxito de eliminación */}
      {deletionSuccessVisible && (
        <View style={styles.alertContainer}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Elemento Eliminado</Text>
            <Text style={styles.alertMessage}>El elemento ha sido eliminado con éxito.</Text>
            <TouchableOpacity onPress={() => setDeletionSuccessVisible(false)} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <RegistroComidaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRegister={fetchComidaData} // Call fetchComidaData after registering
      />

      {/* Edit modal to edit items */}
      <EditComidaModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={fetchComidaData} // Call fetchComidaData after updating
        itemToEdit={selectedItem} // Pass the item to be edited
        setItemToEdit={setSelectedItem} // Reset after editing
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
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
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  alertMessage: {
    marginVertical: 10,
    textAlign: 'center',
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#384EA2',
  },
  alertButtonText: {
    color: '#fff',
  }
});

export default ComidaScreen;
