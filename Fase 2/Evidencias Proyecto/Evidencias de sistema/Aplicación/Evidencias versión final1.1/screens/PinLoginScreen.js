import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';
import { API_BASE_URL } from '../config';
import { BackHandler } from 'react-native';



const PinLoginScreen = ({ navigation, route, setShouldRequestPin }) => {
  const [pin, setPin] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null); // Declarar el estado para rastrear el índice actual
  const { action } = route.params || {}; // Recibir la acción
  const { isDarkMode } = useContext(DarkModeContext);

  // Estados para el modal de recuperación de PIN
  const [modalVisible, setModalVisible] = useState(false);
  const [recoverName, setRecoverName] = useState('');
  const [recoverPhone, setRecoverPhone] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleLogin = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('userPin');
      if (pin === storedPin) {
        if (route.params?.setShouldRequestPin) {
          route.params.setShouldRequestPin(false); // Desactivar la solicitud de PIN
        }
        if (action === 'changePin') {
          navigation.replace('Perfil', { showChangePinModal: true }); // Redirigir a perfil con el modal activo
        } else {
          navigation.replace('Main'); // Redirigir a MainScreen
        }
      } else {
        Alert.alert('Error', 'PIN incorrecto');
      }
    } catch (error) {
      console.error('Error al verificar el PIN:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
    }
  };
  
  
  
  useEffect(() => {
    const backHandler = () => {
      return true; // Bloquear retroceso
    };
  
    const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);
  
    return () => subscription.remove();
  }, []);
  
  

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (value) => {
    let numericValue = value.replace(/[^0-9]/g, '');
    if (value.startsWith('+')) {
      setRecoverPhone(`+${numericValue.slice(0, 11)}`);
    } else {
      setRecoverPhone(`+${numericValue.slice(0, 11)}`);
    }
  };

  const handleResetPin = async () => {
    if (!recoverName || !recoverPhone || !recoverEmail || !newPin) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
  
    if (!validateEmail(recoverEmail)) {
      Alert.alert('Error', 'Por favor ingrese un correo válido.');
      return;
    }
  
    try {
      // Enviar solicitud para cambiar el PIN (esto es solo una simulación)
      const response = await fetch(`${API_BASE_URL}/api/reset-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recoverName,
          phone: recoverPhone,
          email: recoverEmail,
          newPin,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Actualizamos AsyncStorage con el nuevo PIN
        await AsyncStorage.setItem('userPin', newPin);
        Alert.alert('Éxito', 'PIN actualizado correctamente.');
        setModalVisible(false); // Cerrar el modal
      } else {
        Alert.alert('Error', data.error || 'No se pudo actualizar el PIN.');
      }
    } catch (error) {
      console.error('Error al actualizar el PIN:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el PIN.');
    }
  };

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setCurrentIndex(newPin.length - 1); // Actualizar el índice actual
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1)); // Eliminar el último dígito
      setCurrentIndex(pin.length - 2); // Actualizar el índice actual
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo del contenedor en modo oscuro
      ]}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text
        style={[
          styles.text,
          isDarkMode && { color: '#FFFFFF' }, // Texto principal en modo oscuro
        ]}
      >
        Ingrese su PIN
      </Text>

      {/* Cada dígito en su propio rectángulo */}
      <View style={styles.pinContainer}>
        {pin.split('').map((digit, index) => (
          <View
            key={index}
            style={[
              styles.pinBox,
              isDarkMode && { backgroundColor: '#333' }, // Fondo de las cajas en modo oscuro
              currentIndex === index && { backgroundColor: isDarkMode ? '#555' : '#D6D6D6' }, // Rectángulo actual
            ]}
          >
            <Text
              style={[
                styles.pinText,
                isDarkMode && { color: '#FFFFFF' }, // Texto del PIN en modo oscuro
              ]}
            >
              {digit}
            </Text>
          </View>
        ))}
        {/* Espacios vacíos para los dígitos restantes */}
        {pin.length < 4 &&
          Array.from({ length: 4 - pin.length }).map((_, index) => (
            <View
              key={`empty-${index}`}
              style={[
                styles.pinBox,
                isDarkMode && { backgroundColor: '#333' }, // Cajas vacías en modo oscuro
              ]}
            />
          ))}
      </View>
        {/* Botón de "¿Olvidaste tu PIN?" */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.resetPinButton}>
        <Text
          style={[
            styles.resetPinText,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          ¿Olvidaste tu PIN? Recuperalo aquí.
        </Text>
      </TouchableOpacity>

      {/* Teclado numérico */}
      <View style={styles.keyboardContainer}>
        {[1, 2, 3].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {[1, 2, 3]
              .map((digit) => digit + rowIndex * 3)
              .map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={[
                    styles.key,
                    isDarkMode && { backgroundColor: '#121212', borderColor: '#555' }, // Tecla en modo oscuro
                  ]}
                  onPress={() => handleKeyPress(digit)}
                >
                  <Text
                    style={[
                      styles.keyText,
                      isDarkMode && { color: '#FFFFFF' }, // Texto de la tecla en modo oscuro
                    ]}
                  >
                    {digit}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
        <View style={styles.keyboardRow}>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Tecla de borrar en modo oscuro
            ]}
            onPress={handleDelete}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto de borrar en modo oscuro
              ]}
            >
              Borrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#121212', borderColor: '#555' }, // Tecla "0" en modo oscuro
            ]}
            onPress={() => handleKeyPress(0)}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto de "0" en modo oscuro
              ]}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#374EA3', borderColor: '#555' }, // Tecla "Ok" en modo oscuro
            ]}
            onPress={handleLogin}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto de "Ok" en modo oscuro
              ]}
            >
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>

     

      {/* Modal para recuperación de PIN */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar PIN</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#999"
              value={recoverName}
              onChangeText={setRecoverName}
            />

            <TextInput
              style={styles.input}
              placeholder="Teléfono"
              placeholderTextColor="#999"
              value={recoverPhone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor="#999"
              value={recoverEmail}
              onChangeText={setRecoverEmail}
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Nuevo PIN"
              placeholderTextColor="#999"
              value={newPin}
              onChangeText={setNewPin}
              secureTextEntry={true}
              maxLength={4}
            />

            <TouchableOpacity
              style={[styles.button, isDarkMode && { backgroundColor: '#374EA3' }]}
              onPress={handleResetPin}
            >
              <Text style={styles.buttonText}>Actualizar PIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isDarkMode && { backgroundColor: '#FF4444' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  text: {
    color: '#374EA3',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: '80%',
    marginTop: 30,
  },
  pinBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#374EA3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pinText: {
    fontSize: 32,
    color: '#374EA3',
    fontWeight: 'bold',
  },
  keyboardContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    marginTop: 20,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  key: {
    width: '30%',
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 0, // Eliminamos el espacio entre las teclas
  },
  keyText: {
    color: '#374EA3',
    fontSize: 28,
    fontWeight: 'bold',
  },
  resetPinText: {
    textAlign: 'center',
    color: '#374EA3',
    fontSize: 16,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#374EA3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PinLoginScreen;
