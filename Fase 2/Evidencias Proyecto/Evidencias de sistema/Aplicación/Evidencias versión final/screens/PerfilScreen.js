import React, { useState, useEffect, useContext  } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DarkModeContext } from '../DarkModeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';


export default function PerfilScreen({ navigation, route }) {
  const [modalPinVisible, setModalPinVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);
  const [campoEditado, setCampoEditado] = useState(''); // Campo que estamos editando
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [newPin, setNewPin] = useState(''); // Nuevo PIN// Almacenaremos el ID del usuario aquí



  // Obtener el ID del usuario cuando el componente se monta
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Hacer la llamada a la API para obtener el ID
        const response = await fetch(`${API_BASE_URL}/api/user`);
        const data = await response.json();
        if (response.ok) {
          setUserId(data.id); // Guardamos el ID en el estado
        } else {
          Alert.alert('Error', 'No se pudo obtener el ID del usuario');
        }
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
      }
    };

    fetchUserId(); // Llamar a la función para obtener el ID
  }, []);



  // Función para cambiar el PIN
  const handleChangePin = async () => {
    if (newPin.length !== 4) {
      Alert.alert('Error', 'El PIN debe tener exactamente 4 dígitos.');
      return;
    }

    try {
      await AsyncStorage.setItem('userPin', newPin);
      Alert.alert('Éxito', 'PIN actualizado correctamente.');
      setModalPinVisible(false); // Cierra el modal correcto
      setNewPin(''); // Limpia el campo
    } catch (error) {
      console.error('Error al cambiar el PIN:', error);
      Alert.alert('Error', 'No se pudo cambiar el PIN.');
    }
  };


  useEffect(() => {
    if (route.params?.showChangePinModal) {
      setModalPinVisible(true); // Mostrar modal de cambiar PIN
      navigation.setParams({ showChangePinModal: false }); // Limpiar parámetro
    }
  }, [route.params]);



  const handleUpdateData = async (campo) => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el ID del usuario');
      return;
    }

    let response;

    if (campo === 'name' && name) {
      response = await fetch(`${API_BASE_URL}/api/user/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name }),
      });
    } else if (campo === 'phone' && phone) {
      response = await fetch(`${API_BASE_URL}/api/user/phone`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, phone }),
      });
    } else if (campo === 'email' && email) {
      response = await fetch(`${API_BASE_URL}/api/user/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, email }),
      });
    }

    if (response?.ok) {
      Alert.alert('Éxito', `${campo} actualizado correctamente`);
      setModalEditVisible(false); // Cierra el modal correcto
    } else {
      Alert.alert('Error', `Hubo un problema al actualizar el ${campo}`);
    }
  };


  
  // Función para cerrar sesión
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            try {
              // Eliminar los datos del usuario del AsyncStorage
              await AsyncStorage.removeItem('userId');
              await AsyncStorage.removeItem('userPin');
              Alert.alert('Éxito', 'Sesión cerrada correctamente');
              navigation.replace('LoginScreen'); // Redirigir a LoginScreen, no 'Login'
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'Hubo un problema al cerrar sesión');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Opciones disponibles en el perfil
  const opciones = [
    {
      id: '1',
      icon: 'key-outline',
      titulo: 'Cambiar PIN',
      descripcion: 'Actualiza tu PIN de seguridad',
      textoBoton: 'Actualizar',
      onPress: () => navigation.navigate('PinLogin', { action: 'changePin' }),

    },
    {
      id: '2',
      icon: 'person-outline',
      titulo: 'Datos Personales',
      descripcion: 'Edita tu información personal',
      textoBoton: 'Editar',
      onPress: () => setModalEditVisible(true), // Abre modal de edición
    },
    {
      id: '3',
      icon: 'moon-outline',
      titulo: 'Modo Oscuro',
      descripcion: 'Activa o desactiva el modo oscuro',
      textoBoton: isDarkMode ? 'Desactivar' : 'Activar',
      onPress: toggleTheme, // Actualiza el contexto global
    },
    
    {
      id: '4',
      icon: 'log-out-outline',
      titulo: 'Cerrar sesión',
      descripcion: 'Salir de tu cuenta',
      textoBoton: 'Cerrar sesión',
      onPress: handleLogout, // Aquí está la referencia correcta para cerrar sesión
    },
  ];

  const renderItem = ({ item }) => (
    <View style={[
      styles.tarjeta,
      isDarkMode && { backgroundColor: '#333', borderColor: '#555' },
    ]}>
      <View style={[
        styles.contenedorIcono,
        isDarkMode && { backgroundColor: '#555' },
      ]}>
        <Ionicons name={item.icon}
          size={24}
          color={isDarkMode ? '#99A499' : '#374EA3'} />
      </View>
      <View style={styles.contenedorTexto}>
        <Text style={[styles.titulo, isDarkMode && { color: '#99A499' },]}>{item.titulo}</Text>
        <Text style={[ styles.descripcion, isDarkMode && { color: '#DDD' },]}>{item.descripcion}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.boton,
          isDarkMode && { backgroundColor: '#99A499' },
        ]}
        onPress={
          item.id === '2' ? () => setModalEditVisible(true) : item.onPress
        }
      >
        <Text  style={[
            styles.textoBoton,
            isDarkMode && { color: '#333' },
          ]}>{item.textoBoton}</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View  style={[
      styles.container,
      isDarkMode && { backgroundColor: '#121212' },
    ]}>
       <StatusBar style="dark" />

{/* Header */}
<View
  style={[
    styles.header,
    isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
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


      <FlatList
        data={opciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contenedor}
      />

    {/* Modal para cambiar PIN */}
<Modal
  visible={modalPinVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalPinVisible(false)}
>
  <View style={[styles.modalBackground, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
    <View style={[styles.modalContent, isDarkMode && { backgroundColor: '#333' }]}>
      <Text style={[styles.modalTitle, isDarkMode && { color: '#DDD' }]}>Cambiar PIN</Text>
      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#555',
            color: '#DDD',
            borderColor: '#777',
          },
        ]}
        placeholder="Ingrese nuevo PIN"
        placeholderTextColor={isDarkMode ? '#AAA' : '#666'}
        keyboardType="numeric"
        secureTextEntry={true}
        maxLength={4}
        value={newPin}
        onChangeText={setNewPin}
      />
      <TouchableOpacity
        style={[styles.button, isDarkMode && { backgroundColor: '#99A499' }]}
        onPress={handleChangePin}
      >
        <Text style={[styles.buttonText, isDarkMode && { color: '#333' }]}>Actualizar PIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          styles.cancelButton,
          isDarkMode && { backgroundColor: '#555' },
        ]}
        onPress={() => setModalPinVisible(false)}
      >
        <Text
          style={[
            styles.buttonText,
            styles.cancelButtonText,
            isDarkMode && { color: '#DDD' },
          ]}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Modal para editar los datos personales */}
<Modal
  visible={modalEditVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalEditVisible(false)}
>
  <View style={[styles.modalBackground, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
    <View style={[styles.modalContent, isDarkMode && { backgroundColor: '#333' }]}>
      <Text style={[styles.modalTitle, isDarkMode && { color: '#DDD' }]}>Editar Datos Personales</Text>
      
      {/* Campo de Nombre */}
      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#555',
            color: '#DDD',
            borderColor: '#777',
          },
        ]}
        placeholder="Nuevo Nombre"
        placeholderTextColor={isDarkMode ? '#AAA' : '#666'}
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity
        style={[styles.button, isDarkMode && { backgroundColor: '#99A499' }]}
        onPress={() => {
          if (!name.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
          }
          handleUpdateData('name');
        }}
      >
        <Text style={[styles.buttonText, isDarkMode && { color: '#333' }]}>Actualizar Nombre</Text>
      </TouchableOpacity>

      {/* Campo de Teléfono */}
      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#555',
            color: '#DDD',
            borderColor: '#777',
          },
        ]}
        placeholder="+569XXXXXXXX"
        placeholderTextColor={isDarkMode ? '#AAA' : '#666'}
        value={phone}
        onChangeText={(text) => {
          // Asegura que siempre inicie con el prefijo +569
          if (!text.startsWith('+569')) {
            text = `+569${text.replace(/\D/g, '')}`;
          }
          // Limitar a +569 seguido de 8 dígitos
          const limitedPhone = text.slice(0, 12);
          setPhone(limitedPhone);
        }}
        keyboardType="numeric"
        maxLength={12} // +569 y 8 dígitos
      />
      <TouchableOpacity
        style={[styles.button, isDarkMode && { backgroundColor: '#99A499' }]}
        onPress={() => {
          if (!phone.startsWith('+569') || phone.length !== 12) {
            Alert.alert('Error', 'El número debe contener exactamente 8 dígitos después del prefijo +569');
            return;
          }
          handleUpdateData('phone', phone); // Envía el número completo con prefijo
        }}
      >
        <Text style={[styles.buttonText, isDarkMode && { color: '#333' }]}>Actualizar Teléfono</Text>
      </TouchableOpacity>

      {/* Campo de Correo Electrónico */}
      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#555',
            color: '#DDD',
            borderColor: '#777',
          },
        ]}
        placeholder="Nuevo Correo"
        placeholderTextColor={isDarkMode ? '#AAA' : '#666'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.button, isDarkMode && { backgroundColor: '#99A499' }]}
        onPress={() => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
            return;
          }
          handleUpdateData('email');
        }}
      >
        <Text style={[styles.buttonText, isDarkMode && { color: '#333' }]}>Actualizar Correo</Text>
      </TouchableOpacity>

      {/* Botón Cancelar */}
      <TouchableOpacity
        style={[
          styles.button,
          styles.cancelButton,
          isDarkMode && { backgroundColor: '#555' },
        ]}
        onPress={() => setModalEditVisible(false)}
      >
        <Text
          style={[
            styles.buttonText,
            styles.cancelButtonText,
            isDarkMode && { color: '#DDD' },
          ]}
        >
          Cancelar
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10,
    paddingTop: 20, },
  contenedor: {
    padding: 10,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  contenedorIcono: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C4CAE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorTexto: {
    flex: 1,
    marginLeft: 15,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  descripcion: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#374EA3',
  },
  textoBoton: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#374EA3',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#374EA3',
  },
  // nav
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});
