import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { isDarkMode } = useContext(DarkModeContext);

  const handlePhoneChange = (text) => {
    const onlyNumbers = text.replace(/\D/g, ''); // Elimina caracteres no numéricos
    const maxDigits = onlyNumbers.slice(0, 8); // Limita a 8 dígitos
    setPhone(maxDigits); // Actualiza solo los 8 dígitos
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida el formato de un correo electrónico
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (phone.length !== 8) {
      Alert.alert('Error', 'El teléfono debe contener 8 dígitos después del prefijo +569');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    try {
      // Guardar datos del usuario localmente
      await AsyncStorage.setItem('userDetails', JSON.stringify({ name, phone: `+569${phone}`, email }));

      // Navegar a la pantalla de crear PIN
      navigation.replace('CreatePin'); // Navegar a la creación de PIN
    } catch (error) {
      console.error('Error guardando datos del usuario:', error);
      Alert.alert('Error', 'No se pudo guardar el registro');
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#1E1E1E' }, // Fondo en modo oscuro
      ]}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text
        style={[
          styles.text,
          isDarkMode && { color: '#FFFFFF' }, // Título en modo oscuro
        ]}
      >
        Registro
      </Text>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#333',
            color: '#FFFFFF',
            borderColor: '#555',
          }, // Input en modo oscuro
        ]}
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'} // Placeholder dinámico
      />
      <View style={styles.phoneInputContainer}>
  <View style={styles.prefixContainer}>
    <Text style={styles.prefix}>+569</Text>
  </View>
  <TextInput
    placeholder="Número de teléfono"
    value={phone}
    onChangeText={handlePhoneChange}
    style={[
      styles.phoneInput,
      isDarkMode && {
        backgroundColor: '#333',
        color: '#FFFFFF',
        borderColor: '#555',
      },
    ]}
    placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'} // Placeholder dinámico
    keyboardType="phone-pad"
    maxLength={8} // Limita a 8 dígitos
  />
</View>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          isDarkMode && {
            backgroundColor: '#333',
            color: '#FFFFFF',
            borderColor: '#555',
          }, // Input en modo oscuro
        ]}
        placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'} // Placeholder dinámico
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[
          styles.button,
          isDarkMode && { backgroundColor: '#374EA3' }, // Botón en modo oscuro
        ]}
        onPress={handleRegister}
      >
        <Text
          style={[
            styles.buttonText,
            isDarkMode && { color: '#FFFFFF' }, // Texto del botón en modo oscuro
          ]}
        >
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8', // Fondo claro
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    color: '#374EA3',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    
    overflow: 'hidden', // Para evitar que los bordes sobresalgan
  },
  prefixContainer: {
    backgroundColor: '#fffc', // Fondo del prefijo
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefix: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1, // Toma el espacio restante
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff', // Fondo del input
  },
  
  button: {
    backgroundColor: '#374EA3',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
