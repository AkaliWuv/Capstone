import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { DarkModeContext } from '../DarkModeContext';
import { API_BASE_URL } from '../config';


const RegistroPollosModal = ({ visible, onClose, onRegister, onReload, setIsBypassingPin }) => {
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [imagen, setImagen] = useState(null); // Estado para la imagen seleccionada
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  const getCurrentDateTime = () => {
    const currentDate = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
    const [date, time] = currentDate.split(', ');
    return { date, time };
  };

  useEffect(() => {
    const { date, time } = getCurrentDateTime();
    setFecha(date);
    setHora(time);
    const timerId = setInterval(() => {
      const { date, time } = getCurrentDateTime();
      setFecha(date);
      setHora(time);
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  const handleImagePick = async () => {
    try {
      // Activar bypass para evitar la solicitud del PIN
      if (setIsBypassingPin) setIsBypassingPin(true);

      // Pedir permisos para acceder a la galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se tiene permiso para acceder a la galería.');
        return;
      }

      // Abrir la galería para seleccionar una imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setImagen(imageUri);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
    } finally {
      // Desactivar bypass al cerrar la galería
      if (setIsBypassingPin) setIsBypassingPin(false);
    }
  };

  const handleRegister = () => {
    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida mayor que 0.');
      return;
    }

    const formData = new FormData();
    formData.append('cantidad', Number(cantidad));
    formData.append('descripcion', descripcion || '');
    formData.append('tipo', tipo || '');
    formData.append('fecha', fecha);
    formData.append('hora', hora);
    formData.append('utcDateTime', new Date().toISOString());

    if (imagen) {
      const uriParts = imagen.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('imagen', {
        uri: imagen,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    fetch(`${API_BASE_URL}/api/pollos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setSuccessModalVisible(true);
        clearFields();
        if (typeof onRegister === 'function') {
          onRegister(data);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'No se pudo registrar la información de pollos. Intenta nuevamente.');
        console.error('Error al registrar pollos:', error);
      });
  };

  const clearFields = () => {
    setCantidad('');
    setDescripcion('');
    setTipo('');
    setImagen(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    if (typeof onReload === 'function') {
      onReload();
    }
    onClose();
  };

    return (
        <View style={{ flex: 1 }}>
            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={[styles.overlay, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
                    <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
                        <Text
                            style={[styles.title, isDarkMode && { color: '#FFFFFF' }]}
                        >
                            Registrar Pollos
                        </Text>
                        <Text
                            style={[styles.description, isDarkMode && { color: '#AAAAAA' }]}
                        >
                            Ingresa la cantidad de Pollos.
                        </Text>
    
                        <View style={styles.inputContainer}>
                            <Icon name="fastfood" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Cantidad (Unidades)"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                keyboardType="numeric" // Asegura que el teclado sea numérico
                                value={cantidad}
                                onChangeText={(text) => {
                                    // Filtrar para permitir solo números
                                    const numericValue = text.replace(/[^0-9]/g, '');
                                    setCantidad(numericValue);
                                }}
                            />
                        </View>
    
                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Tipo de Pollo"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                value={tipo}
                                onChangeText={setTipo}
                            />
                        </View>
    
                        <View style={styles.dateTimeContainer}>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="calendar-today" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                                <TextInput
                                    style={[
                                        styles.readOnlyInput,
                                        isDarkMode && {
                                            backgroundColor: '#121212',
                                            color: '#FFFFFF',
                                        },
                                    ]}
                                    value={fecha}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="access-time" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                                <TextInput
                                    style={[
                                        styles.readOnlyInput,
                                        isDarkMode && {
                                            backgroundColor: '#121212',
                                            color: '#FFFFFF',
                                        },
                                    ]}
                                    value={hora}
                                    editable={false}
                                />
                            </View>
                        </View>
    
                        <View style={styles.inputContainer}>
                            <Icon name="description" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Descripción (opcional)"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>
    
                        <View style={styles.inputContainer}>
                            <TouchableOpacity
                                onPress={handleImagePick}
                                style={[
                                    styles.imageButton,
                                    isDarkMode && { backgroundColor: '#555' },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.imageButtonText,
                                        isDarkMode && { color: '#FFFFFF' },
                                    ]}
                                >
                                    {imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                                </Text>
                            </TouchableOpacity>
                        </View>
    
                        {imagen && (
                            <View style={styles.imagePreview}>
                                <Image source={{ uri: imagen }} style={styles.image} />
                            </View>
                        )}
    
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.footerButtonClose,
                                    isDarkMode && { backgroundColor: '#333' },
                                ]}
                                onPress={onClose}
                            >
                                <Text
                                    style={[
                                        styles.footerButtonTextClose,
                                        isDarkMode && { color: '#FFFFFF' },
                                    ]}
                                >
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.footerButton,
                                    isDarkMode && { backgroundColor: '#374EA3' },
                                ]}
                                onPress={handleRegister}
                            >
                                <Text
                                    style={[
                                        styles.footerButtonText,
                                        isDarkMode && { color: '#FFFFFF' },
                                    ]}
                                >
                                    Registrar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
    
            {/* Success Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={[styles.successOverlay, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
                    <View style={[styles.successContainer, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
                        <Text
                            style={[
                                styles.successTitle,
                                isDarkMode && { color: '#FFFFFF' },
                            ]}
                        >
                            Éxito
                        </Text>
                        <Text
                            style={[
                                styles.successMessage,
                                isDarkMode && { color: '#AAAAAA' },
                            ]}
                        >
                            Registro realizado correctamente.
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.successButton,
                                isDarkMode && { backgroundColor: '#333' },
                            ]}
                            onPress={closeSuccessModal}
                        >
                            <Text
                                style={[
                                    styles.successButtonText,
                                    isDarkMode && { color: '#FFFFFF' },
                                ]}
                            >
                                OK
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
    
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '80%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
    imageButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#384EA2',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',  // Asegura que el texto esté centrado verticalmente
        width: '100%',  // Asegura que el botón ocupe todo el ancho disponible
        textAlign: 'center',  // Centra el texto dentro del botón
    },
    
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',  // Centra el texto horizontalmente
    },
    
    imagePreview: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    readOnlyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    readOnlyInput: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#eaeaea',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    footerButton: {
        backgroundColor: '#384EA2',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    footerButtonClose: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footerButtonTextClose: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    successOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20,
        textAlign: 'center',
    },
    successButton: {
        backgroundColor: '#384EA2',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    successButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RegistroPollosModal;