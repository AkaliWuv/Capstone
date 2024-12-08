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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa MaterialCommunityIcons
import { Picker } from '@react-native-picker/picker';
import EditPollosModal from './EditPollosModal';
import RegistroPollosModal from './RegistroPollosModal';
import { DarkModeContext } from '../DarkModeContext';
<<<<<<< HEAD
import { API_BASE_URL } from '../config';



function PollosScreen({ navigation, route, setIsBypassingPin }) {
=======


function PollosScreen({ navigation, route }) {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  const [comidaData, setComidaData] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterType, setFilterType] = useState('tipo');
  const [order, setOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);


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
<<<<<<< HEAD
              const response = await fetch(`${API_BASE_URL}/api/pollos/${itemId}`, {
=======
              const response = await fetch(`http://10.0.2.2:5000/api/pollos/${itemId}`, {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
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
    try {
<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/api/pollos`);
=======
      const response = await fetch('http://10.0.2.2:5000/api/pollos');
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      const formattedData = data.map(item => ({
        ...item,
        fecha: item.fecha.split('T')[0],
<<<<<<< HEAD
        imagen: item.imagen ? `${API_BASE_URL}${item.imagen}` : null,
=======
        imagen: item.imagen ? `http://10.0.2.2:5000${item.imagen}` : null,
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
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
            isDarkMode && { backgroundColor: '#121212', borderColor: '#555' }, // Fondo y borde en modo oscuro
        ]}
    >
        <TouchableOpacity
            onPress={() => handleExpand(item.id)}
            style={[
                styles.itemHeader,
                isDarkMode && { backgroundColor: '#121212' }, // Fondo del header en modo oscuro
            ]}
        >
            {/* Usa item.imagen como la fuente de la imagen */}
            <Image
                source={{ uri: item.imagen }}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text
                    style={[
                        styles.itemName,
                        isDarkMode && { color: '#FFFFFF' }, // Color del texto en modo oscuro
                    ]}
                    numberOfLines={1}
                >
                    {item.tipo}
                </Text>
                <Text
                    style={[
                        styles.itemPrice,
                        isDarkMode && { color: '#AAAAAA' }, // Color del texto en modo oscuro
                    ]}
                >
                    {item.fecha}
                </Text>
            </View>
            <Text
                style={[
                    styles.itemQuantity,
                    isDarkMode && { color: '#FFFFFF' }, // Color de la cantidad en modo oscuro
                ]}
            >
                x {item.cantidad}
            </Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity>
                    <Icon
                        name="pencil"
                        size={20}
                        color={isDarkMode ? '#374EA3' : '#374EA3'} // Icono ajustado al modo oscuro
                        onPress={() => handleEdit(item)}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon
                        name="trash"
                        size={20}
                        color={isDarkMode ? '#FF6F61' : '#F44336'} // Icono ajustado al modo oscuro
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
                    isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' }, // Fondo expandido en modo oscuro
                ]}
            >
                <Text
                    style={[
                        styles.expandedText,
                        isDarkMode && { color: '#CCCCCC' }, // Texto expandido en modo oscuro
                    ]}
                >
<<<<<<< HEAD
                    Info: Nuevo ingreso de comida con fecha: {item.fecha} a las {item.hora}{"\n"}
                    Se ingresaron: {item.cantidad} pollos, de tipo: {item.tipo}{"\n"}
=======
                    Info: Nuevo ingreso de comida con fecha: {item.fecha}{"\n"}
                    Se ingresaron: {item.cantidad} kilos de comida de tipo: {item.tipo}{"\n"}
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
                    {item.descripcion
                        ? `Descripción: ${item.descripcion}`
                        : 'Sin descripción'}
                </Text>
            </View>
        )}
    </View>
);

  

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
                        Avijuelas
                    </Text>
                </View>
            </View>
        </View>

        <View
            style={[
                styles.header,
                isDarkMode && { backgroundColor: '#121212' }, // Fondo del header en modo oscuro
            ]}
        >
            <Text
                style={[
                    styles.headerTitle,
                    isDarkMode && { color: '#FFFFFF' }, // Título en modo oscuro
                ]}
            >
                Registro Pollos
            </Text>
            <TouchableOpacity
                style={[
                    styles.addButton,
                    isDarkMode && { borderColor: '#374EA3' },
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    style={[
                        styles.addButtonText,
                        isDarkMode && { color: '#FFFFFF' },
                    ]}
                >
                    Registrar
                </Text>
            </TouchableOpacity>
        </View>
        <TextInput
            style={[
                styles.searchInput,
                isDarkMode && {
                    backgroundColor: '#333',
                    color: '#FFFFFF',
                    borderColor: '#555',
                },
            ]}
            placeholder="Buscar por Tipo de Pollo"
            placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
        />

        {/* Filters */}
        <View
            style={[
                styles.filtersContainer,
                isDarkMode && { backgroundColor: '#121212' },
            ]}
        >
            <View style={styles.filterRow}>
                <View style={styles.filterColumn}>
                    <Text
                        style={[
                            styles.filterLabel,
                            isDarkMode && { color: '#FFFFFF' },
                        ]}
                    >
                        Cantidad de Registros
                    </Text>
                    <Picker
                        selectedValue={itemsPerPage}
                        style={[
                            styles.picker,
                            isDarkMode && {
                                backgroundColor: '#333',
                                color: '#FFFFFF',
                            },
                        ]}
                        onValueChange={(value) => setItemsPerPage(value)}
                    >
                        <Picker.Item label="5" value={5} />
                        <Picker.Item label="10" value={10} />
                        <Picker.Item label="15" value={15} />
                        <Picker.Item label="20" value={20} />
                    </Picker>
                </View>

                <View style={styles.filterColumn}>
                    <Text
                        style={[
                            styles.filterLabel,
                            isDarkMode && { color: '#FFFFFF' },
                        ]}
                    >
                        Filtrar por
                    </Text>
                    <Picker
                        selectedValue={filterType}
                        style={[
                            styles.picker,
                            isDarkMode && {
                                backgroundColor: '#333',
                                color: '#FFFFFF',
                            },
                        ]}
                        onValueChange={(value) => setFilterType(value)}
                    >
                        <Picker.Item label="Tipo" value="tipo" />
                        <Picker.Item label="Cantidad" value="cantidad" />
                    </Picker>
                </View>

                <View style={styles.filterColumn}>
                    <Text
                        style={[
                            styles.filterLabel,
                            isDarkMode && { color: '#FFFFFF' },
                        ]}
                    >
                        Orden
                    </Text>
                    <Picker
                        selectedValue={order}
                        style={[
                            styles.picker,
                            isDarkMode && {
                                backgroundColor: '#333',
                                color: '#FFFFFF',
                            },
                        ]}
                        onValueChange={(value) => setOrder(value)}
                    >
                        <Picker.Item label="Ascendente" value="asc" />
                        <Picker.Item label="Descendente" value="desc" />
                    </Picker>
                </View>
            </View>
        </View>

        <FlatList
            data={paginatedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
                styles.listContainer,
                isDarkMode && { backgroundColor: '#121212' },
            ]}
        />

        {/* Pagination */}
        <View
            style={[
                styles.paginationContainer,
                isDarkMode && { backgroundColor: '#121212' },
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.paginationButton,
                    styles.previousButton,
                ]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <Icon name="chevron-left" size={20} color="#374EA3" />
            </TouchableOpacity>
            <Text
                style={[
                    styles.pageInfo,
                    isDarkMode && { color: '#FFFFFF' },
                ]}
            >
                {`${currentPage} / ${totalPages}`}
            </Text>
            <TouchableOpacity
                style={[
                    styles.paginationButton,
                    styles.nextButton,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
            >
                <Icon name="chevron-right" size={20} color="#374EA3" />
            </TouchableOpacity>
        </View>

        {/* Modales */}
        <RegistroPollosModal
<<<<<<< HEAD
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRegister={fetchComidaData}
        setIsBypassingPin={setIsBypassingPin} // Pasar bypass al modal
      />
=======
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onRegister={fetchComidaData}
            isDarkMode={isDarkMode} // Pasar modo oscuro
        />
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

        <EditPollosModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            onUpdate={fetchComidaData}
            itemToEdit={selectedItem}
            setItemToEdit={setSelectedItem}
            isDarkMode={isDarkMode} // Pasar modo oscuro
        />

        {/* Bottom Navigation */}
        <View
            style={[
                styles.navBar,
                isDarkMode && { backgroundColor: '#1E1E1E', borderTopColor: '#333' },
            ]}
        >
            {[
                { name: 'Main', icon: 'home', label: 'Inicio' },
                { name: 'Pollos', icon: 'leaf', label: 'Pollos' },
                { name: 'Comida', icon: 'cutlery', label: 'Comida' },
                { name: 'Analisis', icon: 'bar-chart', label: 'Análisis' },
                { name: 'Perfil', icon: 'user', label: 'Perfil' },
            ].map((item) => {
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
                            color={isActive ? (isDarkMode ? '#374EA3' : '#374EA3') : (isDarkMode ? '#AAAAAA' : '#aaa')}
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
  }
});

export default PollosScreen;
