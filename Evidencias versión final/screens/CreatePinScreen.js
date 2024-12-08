import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext'; // Importa el contexto de modo oscuro
<<<<<<< HEAD
import { API_BASE_URL } from '../config';

=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

const CreatePinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null); // Para saber qué índice estamos editando
  const [timer, setTimer] = useState(null); // Para manejar el tiempo del PIN
  const [completedPin, setCompletedPin] = useState(false); // Para saber si el PIN está completo

  const { isDarkMode } = useContext(DarkModeContext); // Accede al estado del modo oscuro

  const handlePinCreation = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'El PIN debe tener 4 dígitos');
      return;
    }

    setLoading(true);

    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (!userDetails) {
        throw new Error('No se encontraron datos del usuario');
      }

      const { name, phone, email } = JSON.parse(userDetails);

<<<<<<< HEAD
      const response = await fetch(`${API_BASE_URL}/register`, {
=======
      const response = await fetch('http://10.0.2.2:5000/register', {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, pin }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userPin', pin);
        navigation.replace('Main');
      } else {
        Alert.alert('Error', data.error || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (digit) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setCurrentIndex(newPin.length);

      if (newPin.length === 4) {
        setCompletedPin(true);
        clearTimeout(timer);
      } else {
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
          if (newPin.length < 4) {
            const updatedPin = newPin.split('').map(() => '•').join('');
            setPin(updatedPin);
          }
        }, 2000);
        setTimer(newTimer);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setCurrentIndex(pin.length - 1);
    setCompletedPin(false);
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
      ]}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text
        style={[
          styles.text,
          isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
        ]}
      >
        Crea tu PIN
      </Text>

      <View style={styles.pinContainer}>
        {pin.split('').map((digit, index) => (
          <View
            key={index}
            style={[
              styles.pinBox,
              currentIndex === index && { backgroundColor: isDarkMode ? '#555' : '#D6D6D6' },
              isDarkMode && { borderColor: '#888' }, // Borde en modo oscuro
            ]}
          >
            <Text
              style={[
                styles.pinText,
                isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
              ]}
            >
              {digit}
            </Text>
          </View>
        ))}
        {pin.length < 4 &&
          Array.from({ length: 4 - pin.length }).map((_, index) => (
            <View
              key={`empty-${index}`}
              style={[
                styles.pinBox,
                isDarkMode && { borderColor: '#888' }, // Borde en modo oscuro
              ]}
            />
          ))}
      </View>

      <View style={styles.keyboardContainer}>
        {[...Array(3)].map((_, rowIndex) => (
          <View key={rowIndex} style={styles.keyboardRow}>
            {[...Array(3)].map((_, colIndex) => {
              const digit = rowIndex * 3 + colIndex + 1;
              return (
                <TouchableOpacity
                  key={digit}
                  style={[
                    styles.key,
                    isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
                  ]}
                  onPress={() => handleKeyPress(digit)}
                >
                  <Text
                    style={[
                      styles.keyText,
                      isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
                    ]}
                  >
                    {digit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <View style={styles.keyboardRow}>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#333' }, // Fondo en modo oscuro
            ]}
            onPress={handleDelete}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
              ]}
            >
              Borrar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
            ]}
            onPress={() => handleKeyPress(0)}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
              ]}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.key,
              isDarkMode && { backgroundColor: '#374EA3' }, // Fondo en modo oscuro
            ]}
            onPress={handlePinCreation}
          >
            <Text
              style={[
                styles.keyText,
                isDarkMode && { color: '#FFFFFF' }, // Texto en modo oscuro
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

export default CreatePinScreen;
