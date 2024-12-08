import React, { useState, useContext } from 'react';
<<<<<<< HEAD
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';
import { API_BASE_URL } from '../config';

=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
<<<<<<< HEAD
  const [modalVisible, setModalVisible] = useState(false);
  const [recoverName, setRecoverName] = useState('');
  const [recoverPhone, setRecoverPhone] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [newPin, setNewPin] = useState('');
=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  const { isDarkMode } = useContext(DarkModeContext);

  const handleLogin = async () => {
    if (!name || !pin) {
      Alert.alert('Error', 'Por favor ingrese su nombre y PIN');
      return;
    }

    try {
      if (!/^\d+$/.test(pin)) {
        Alert.alert('Error', 'El PIN debe contener solo números');
        return;
      }

<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/api/login`, {
=======
      const response = await fetch('http://10.0.2.2:5000/api/login', {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin }),
      });
      const data = await response.json();

      if (response.ok) {
        AsyncStorage.setItem('userName', name);
        AsyncStorage.setItem('userPin', pin);
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.error || 'Usuario o PIN incorrecto');
      }
    } catch (error) {
      console.error('Error al intentar hacer login:', error);
      Alert.alert('Error', 'Hubo un problema al intentar hacer login');
    }
  };

<<<<<<< HEAD
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!/^\+\d{11}$/.test(recoverPhone)) {
      Alert.alert('Error', 'El teléfono debe comenzar con "+" seguido de 10 dígitos (11 caracteres en total).');
      return;
    }

    try {
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

  
const handlePhoneChange = (value) => {
  // Asegurar que comience con "+" y limitar a 10 números después del "+"
  let numericValue = value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
  if (value.startsWith('+')) {
    setRecoverPhone(`+${numericValue.slice(0, 11)}`); // Mantener el "+" y limitar a 10 números
  } else {
    setRecoverPhone(`+${numericValue.slice(0, 11)}`); // Agregar "+" si no está presente
  }
};

  const handleNavigateToRegister = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          Alert.alert(
            'Información',
            'Lamentamos lo sucedido, pero ya hay un registro en esta aplicación.'
          );
        } else {
          navigation.navigate('Intro');
        }
      } else {
        Alert.alert('Error', 'Hubo un problema al verificar el registro.');
      }
    } catch (error) {
      console.error('Error al verificar el registro:', error);
      Alert.alert('Error', 'No se pudo verificar el registro. Inténtalo más tarde.');
    }
  };

=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#1E1E1E' }, // Fondo del contenedor en modo oscuro
      ]}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text
        style={[
          styles.title,
          isDarkMode && { color: '#FFFFFF' }, // Título en modo oscuro
        ]}
      >
        Iniciar Sesión
      </Text>

      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#333',
            color: '#FFFFFF',
            borderColor: '#555',
          },
        ]}
        placeholder="Introduce tu Nombre"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#333',
            color: '#FFFFFF',
            borderColor: '#555',
          },
        ]}
        placeholder="Introduce tu PIN"
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[
          styles.button,
          isDarkMode && { backgroundColor: '#374EA3' },
        ]}
        onPress={handleLogin}
      >
        <Text
          style={[
            styles.buttonText,
            isDarkMode && { color: '#FFFFFF' },
          ]}
        >
          Ingresar
        </Text>
      </TouchableOpacity>

<<<<<<< HEAD
      <TouchableOpacity onPress={handleNavigateToRegister}>
=======
      <TouchableOpacity onPress={() => navigation.navigate('Intro')}>
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
        <Text
          style={[
            styles.signUpText,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          ¿No tienes una Cuenta? Registrate
        </Text>
      </TouchableOpacity>
<<<<<<< HEAD

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text
          style={[
            styles.resetPinText,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          ¿Olvidaste tu PIN? Recuperalo aquí.
        </Text>
      </TouchableOpacity>

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
              placeholder="No olvides agregar +569"
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
=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
  title: {
    color: '#374EA3',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
<<<<<<< HEAD
    marginBottom: 10,
=======
    marginBottom: 20,
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  },
  button: {
    backgroundColor: '#374EA3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
<<<<<<< HEAD
    marginBottom: 10,
=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpText: {
    textAlign: 'center',
    color: '#374EA3',
    fontSize: 16,
    marginTop: 10,
  },
<<<<<<< HEAD
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
=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
});
