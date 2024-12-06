import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';


const PinLoginScreen = ({ navigation, route }) => {
  const [pin, setPin] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null); // Declarar el estado para rastrear el índice actual
  const { action } = route.params || {}; // Recibir la acción
  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);


    
  const handleLogin = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('userPin');
      if (pin === storedPin) {
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
});

export default PinLoginScreen;
