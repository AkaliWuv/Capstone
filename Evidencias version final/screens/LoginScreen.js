import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
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

      const response = await fetch('http://10.0.2.2:5000/api/login', {
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

      <TouchableOpacity onPress={() => navigation.navigate('Intro')}>
        <Text
          style={[
            styles.signUpText,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          ¿No tienes una Cuenta? Registrate
        </Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#374EA3',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
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
});
