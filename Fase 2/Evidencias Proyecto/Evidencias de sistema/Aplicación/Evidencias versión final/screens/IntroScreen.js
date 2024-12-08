import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { DarkModeContext } from '../DarkModeContext';

const IntroScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);

  const handleGetStarted = () => {
    navigation.navigate('Register'); // Navegar a la pantalla de registro
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDarkMode && { backgroundColor: '#1E1E1E' }, // Fondo en modo oscuro
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
        Bienvenido a la App
      </Text>
      <Text
        style={[
          styles.description,
          isDarkMode && { color: '#AAAAAA' }, // Descripción en modo oscuro
        ]}
      >
        Gestiona pollos, comida y controla tus datos con gráficos. Optimiza tu negocio de manera simple y eficiente.
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          isDarkMode && { backgroundColor: '#374EA3' }, // Botón en modo oscuro
        ]}
        onPress={handleGetStarted}
      >
        <Text
          style={[
            styles.buttonText,
            isDarkMode && { color: '#FFFFFF' }, // Texto del botón en modo oscuro
          ]}
        >
          Comenzar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', // Fondo claro
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#374EA3',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#374EA3',
    borderRadius: 25,
    paddingVertical: 12,
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

export default IntroScreen;
