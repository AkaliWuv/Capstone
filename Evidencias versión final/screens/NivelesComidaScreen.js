import React, { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_BASE_URL } from '../config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa MaterialCommunityIcons
import { Picker } from '@react-native-picker/picker';
import RegistroNivelesModal from './RegistroNivelesModal'; // Ensure this path is correct
import EditNivelesModal from './EditNivelesModal'; // Ensure this path is correct
import { Modal } from 'react-native';
import { DarkModeContext } from '../DarkModeContext';


function LowStockAlertModal({ sacosLowStock, visible, onClose, isDarkMode }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.modalBackground,
          isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.6)' }, // Fondo semitransparente en modo oscuro
        ]}
      >
        <View
          style={[
            styles.modalContent,
            isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' }, // Fondo y borde en modo oscuro
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              isDarkMode && { color: '#FFFFFF' }, // Color del título en modo oscuro
            ]}
          >
            ¡Alerta de Bajo Stock!
          </Text>
          {sacosLowStock.length > 0 ? (
            sacosLowStock.map((saco, index) => (
              <View key={index} style={styles.lowStockItem}>
                <Text
                  style={[
                    styles.lowStockText,
                    isDarkMode && { color: '#FF6F61' }, // Color del texto en modo oscuro
                  ]}
                >
                  {saco.nombre} -{' '}
                  <Text
                    style={[
                      styles.lowStockAmount,
                      isDarkMode && { color: '#FFA07A' }, // Color de cantidad en modo oscuro
                    ]}
                  >
                    {saco.cantidad} Kg
                  </Text>
                </Text>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.noStockText,
                isDarkMode && { color: '#AAAAAA' }, // Color del texto "No hay sacos" en modo oscuro
              ]}
            >
              No hay sacos con menos de 20 kg
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.closeButton,
              isDarkMode && { backgroundColor: '#333' }, // Botón en modo oscuro
            ]}
            onPress={onClose}
          >
            <Text
              style={[
                styles.closeButtonText,
                isDarkMode && { color: '#FFFFFF' }, // Texto del botón en modo oscuro
              ]}
            >
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


function ComidaScreen({ navigation, route }) {
  const [comidaData, setComidaData] = useState([]);
  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterType, setFilterType] = useState('tipo');
  const [order, setOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [lowStockSacos, setLowStockSacos] = useState([]); // Sacos con bajo stock
  const [lowStockModalVisible, setLowStockModalVisible] = useState(false); // Modal de bajo stock


  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };
  

  const handleDelete = (itemId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar este elemento?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/api/sacos_comida/${itemId}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                throw new Error('Error deleting item');
              }
              fetchComidaData();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete the item.');
            }
          },
        },
      ]
    );
  };

  const fetchComidaData = async () => { 
    setLoading(true); // Iniciar el loader
    try {
      const response = await fetch(`${API_BASE_URL}/api/sacos_comida`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
  
      const data = await response.json();
  
      // Filtrar sacos con menos de 20 Kg
      const lowStock = data.filter(tipo => tipo.cantidad < 20);
      setLowStockSacos(lowStock);
  
      // Mostrar modal si hay sacos con bajo stock
      if (lowStock.length > 0) {
        setLowStockModalVisible(true); // Muestra el modal
      }
  
      // Formatear los datos de comida
      const formattedData = data.map(item => ({
        ...item,
        fecha_compra: item.fecha_compra ? item.fecha_compra.split('T')[0] : 'Sin fecha', // Verificación para evitar 'undefined'
      }));
  
      setComidaData(formattedData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load food data.');
    } finally {
      setLoading(false); // Detener el loader
    }
  };
  

  useEffect(() => {
    fetchComidaData();
  }, []);

  const handleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const totalPages = Math.ceil(comidaData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = comidaData.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View
        style={[
            styles.itemContainer,
            isDarkMode && { backgroundColor: '#121212', borderColor: '#fff' }, // Fondo y borde en modo oscuro
        ]}
    >
        <TouchableOpacity
            onPress={() => handleExpand(item.id)}
            style={[
                styles.itemHeader,
                isDarkMode && { backgroundColor: '#121212' }, // Fondo del header en modo oscuro
            ]}
        >
            <View style={styles.itemDetails}>
                <Text
                    style={[
                        styles.itemName,
                        isDarkMode && { color: '#FFFFFF' }, // Color del texto en modo oscuro
                    ]}
                    numberOfLines={1}
                >
                    {item.nombre}
                </Text>
                <Text
                    style={[
                        styles.itemPrice,
                        isDarkMode && { color: '#AAAAAA' }, // Color del texto en modo oscuro
                    ]}
                >
                    {item.fecha_compra || 'Fecha no disponible'}
                </Text>
            </View>
            <Text
                style={[
                    styles.itemQuantity,
                    isDarkMode && { color: '#FFFFFF' }, // Color de la cantidad en modo oscuro
                ]}
            >
                {item.cantidad} Kg.
            </Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity>
                    <Icon
                        name="pencil"
                        size={20}
                        color={isDarkMode ? '#374EA3' : '#374EA3'} // Color dinámico del icono
                        onPress={() => handleEdit(item)}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon
                        name="trash"
                        size={20}
                        color={isDarkMode ? '#FF6F61' : '#F44336'} // Color dinámico del icono
                        style={styles.trashIcon}
                        onPress={() => handleDelete(item.id)}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>

        {expandedItem === item.id && (
            <View
                style={[
                    styles.expandedContent,
                    isDarkMode && { backgroundColor: '#222', borderColor: '#444' }, // Fondo expandido en modo oscuro
                ]}
            >
                <Text
                    style={[
                        styles.expandedText,
                        isDarkMode && { color: '#CCCCCC' }, // Texto expandido en modo oscuro
                    ]}
                >
                    Info: Nueva compra de comida con fecha: {item.fecha_compra} por el valor de {formatPrice(item.precio)}{"\n"}
                    Se ingresaron: {item.cantidad} kilos de comida correspondiente a tipo: {item.nombre} cuyo proveedor fue: {item.proveedor}{"\n"}
                    {item.descripcion
                        ? `Cuenta con la siguiente descripción: ${item.descripcion}`
                        : 'No posee descripción'}
                </Text>
            </View>
        )}
    </View>
);

  
  // Función de formateo de precios
  const formatPrice = (price) => {
    if (price != null) {  // Verificamos que el precio no sea null o undefined
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(price);
    } else {
      return 'Precio no disponible';  // Valor por defecto si no hay precio
    }
  };
  

   
  

  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo del contenedor en modo oscuro
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
              Avijuelas
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={() => setLowStockModalVisible(true)}
          >
            <Icon
              name="bell"
              size={20}
              color={isDarkMode ? '#AAAAAA' : '#000'} // Icono dinámico
            />
            {lowStockSacos.length > 0 && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </View>
  
      <LowStockAlertModal
        sacosLowStock={lowStockSacos}
        visible={lowStockModalVisible}
        onClose={() => setLowStockModalVisible(false)}
        isDarkMode={isDarkMode} // Pasar estado del modo oscuro
      />
  
      {/* Registro Niveles Header */}
      <View
        style={[
          styles.header,
          isDarkMode && { backgroundColor: '#121212' }, // Fondo adicional
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            isDarkMode && { color: '#FFFFFF' }, // Título dinámico
          ]}
        >
          Registro Niveles
        </Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            isDarkMode && { backgroundColor: '#555', borderColor: '#777' },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.addButtonText,
              isDarkMode && { color: '#FFFFFF' }, // Texto del botón dinámico
            ]}
          >
            Registrar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addButton1,
            isDarkMode && { backgroundColor: '#555', borderColor: '#777' },
          ]}
          onPress={() => navigation.navigate('Comida')}
        >
          <Text
            style={[
              styles.addButtonText1,
              isDarkMode && { color: '#FFFFFF' }, // Texto del botón dinámico
            ]}
          >
            Comida
          </Text>
        </TouchableOpacity>
      </View>
  
      {/* Search Input */}
      <TextInput
        style={[
          styles.searchInput,
          isDarkMode && {
            backgroundColor: '#333',
            color: '#FFFFFF',
            borderColor: '#555',
          }, // Input dinámico
        ]}
        placeholder="Buscar por Tipo de Comida"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
      />
  
      {/* Filters */}
      <View
        style={[
          styles.filtersContainer,
          isDarkMode && { backgroundColor: '#121212', borderColor: '#333' },
        ]}
      >
        <View style={styles.filterRow}>
          {/* Cantidad de Registros */}
          <View style={styles.filterColumn}>
            <Text
              style={[
                styles.filterLabel,
                isDarkMode && { color: '#FFFFFF' }, // Texto dinámico
              ]}
            >
              Cantidad de Registros
            </Text>
            <Picker
              selectedValue={itemsPerPage}
              style={[
                styles.picker,
                isDarkMode && { backgroundColor: '#333', color: '#FFFFFF' },
              ]}
              onValueChange={(value) => setItemsPerPage(value)}
            >
              <Picker.Item label="5" value={5} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="15" value={15} />
              <Picker.Item label="20" value={20} />
            </Picker>
          </View>
  
          {/* Filtrar por */}
          <View style={styles.filterColumn}>
            <Text
              style={[
                styles.filterLabel,
                isDarkMode && { color: '#FFFFFF' }, // Texto dinámico
              ]}
            >
              Filtrar por
            </Text>
            <Picker
              selectedValue={filterType}
              style={[
                styles.picker,
                isDarkMode && { backgroundColor: '#333', color: '#FFFFFF' },
              ]}
              onValueChange={(value) => setFilterType(value)}
            >
              <Picker.Item label="Tipo" value="tipo" />
              <Picker.Item label="Cantidad" value="cantidad" />
            </Picker>
          </View>
  
          {/* Orden */}
          <View style={styles.filterColumn}>
            <Text
              style={[
                styles.filterLabel,
                isDarkMode && { color: '#FFFFFF' }, // Texto dinámico
              ]}
            >
              Orden
            </Text>
            <Picker
              selectedValue={order}
              style={[
                styles.picker,
                isDarkMode && { backgroundColor: '#333', color: '#FFFFFF' },
              ]}
              onValueChange={(value) => setOrder(value)}
            >
              <Picker.Item label="Ascendente" value="asc" />
              <Picker.Item label="Descendente" value="desc" />
            </Picker>
          </View>
        </View>
      </View>
  
      {/* Lista */}
      <FlatList
        data={paginatedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          isDarkMode && { backgroundColor: '#121212' },
        ]}
      />
  
      {/* Paginación */}
      <View
        style={[
          styles.paginationContainer,
          isDarkMode && { backgroundColor: '#121212' },
        ]}
      >
        <TouchableOpacity
          style={[styles.paginationButton, styles.previousButton]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Icon name="chevron-left" size={20} color="#374EA3" />
        </TouchableOpacity>
        <Text
          style={[
            styles.pageInfo,
            isDarkMode && { color: '#FFFFFF' }, // Texto dinámico
          ]}
        >
          {`${currentPage} / ${totalPages}`}
        </Text>
        <TouchableOpacity
          style={[styles.paginationButton, styles.nextButton]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron-right" size={20} color="#374EA3" />
        </TouchableOpacity>
      </View>
  
      <RegistroNivelesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRegister={fetchComidaData} // Call fetchComidaData after registering
      />
  
      <EditNivelesModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onUpdate={fetchComidaData} // Call fetchComidaData after updating
        itemToEdit={selectedItem} // Pass the item to be edited
        setItemToEdit={setSelectedItem} // Reset after editing
      />
  
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
    { name: 'NivelesComida', icon: 'cutlery', label: 'Niveles' }, // Cambiado a "Niveles"
    { name: 'Analisis', icon: 'bar-chart', label: 'Análisis' },
    { name: 'Perfil', icon: 'user', label: 'Perfil' },
  ].map((item) => {
    // Determina si la pestaña actual es la activa
    const isActive = route.name === item.name;

    return (
      <TouchableOpacity
        key={item.name}
        style={styles.navItem}
        onPress={() => navigation.navigate(item.name)}
      >
        <Icon
          name={item.icon}
          size={24}
          color={
            isActive
              ? isDarkMode
                ? '#374EA3'
                : '#374EA3'
              : isDarkMode
              ? '#AAAAAA'
              : '#aaa'
          }
        />
        <Text
          style={[
            styles.navText,
            isActive
              ? [styles.navTextActive, isDarkMode && { color: '#374EA3' }]
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 20, // Ajusté el padding top para un espaciado más uniforme
  },
  searchInput: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,  // Ajusté el padding para dar más espacio
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#374EA3',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  addButtonText: {
    color: '#374EA3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  addButtonText1: {
    color: '#A2A2A2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filtersContainer: {
    marginVertical: 20,
    paddingHorizontal: 5,  // Ajusté el padding horizontal para más espacio alrededor de los filtros
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap', // Permite que los filtros se acomoden bien si el espacio no es suficiente
  },
  filterColumn: {
    flex: 1,
    marginHorizontal: 8, // Aumenté el margen para separar más las columnas
    marginBottom: 10,    // Añadí margen inferior para separar las filas de filtros
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  listContainer: {
    paddingBottom: 80,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15, // Añadí más espacio interior para mejor presentación
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Más espacio entre el contenido
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#777',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,  // Espaciado más amplio para los iconos
  },
  trashIcon: {
    marginLeft: 15,
  },
  expandedContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  expandedText: {
    fontSize: 18,
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
  },
  previousButton: {
    marginRight: 20,
  },
  nextButton: {
    marginLeft: 20,
  },
  pageInfo: {
    fontSize: 16,
    color: '#333',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
    color: '#888',
  },
  navTextActive: {
    fontSize: 12,
    marginTop: 5,
    color: '#384EA1',
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  priceText: {
    fontSize: 16,
    color: '#27AE60', // Verde para destacar el precio
  },
  
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#374EA3',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  lowStockItem: {
    marginBottom: 10,
  },
  lowStockText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center', // Centrado para los elementos de bajo stock
  },
  lowStockAmount: {
    fontWeight: 'bold',
  },
  noStockText: {
    fontSize: 16,
    textAlign: 'center', // Centrado para el texto de "No hay stock"
    color: '#888',
  },
  addButton1: {
    borderWidth: 1,
    borderColor: '#A2A2A2',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

export default ComidaScreen;
