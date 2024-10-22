import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const TemporizadorModal = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Temporizador</Text>
          <Text style={styles.description}>
            Selecciona la hora y el peso que deseas programar.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Seleccionar Hora</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Seleccionar Peso</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButtonClose} onPress={onClose}>
              <Text style={styles.footerButtonTextClose}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={onClose}>
              <Text style={styles.footerButtonText}>Programar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cambié a 50% de opacidad para ver mejor el fondo
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 10,
    textAlign: 'center', // Asegúrate de que el título esté centrado
  },
  description: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#384EA2',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerButtonClose: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D6D6D6', // Color de fondo del botón cerrar
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footerButtonTextClose: {
    color: '#384EA2', // Color del texto del botón cerrar
    fontSize: 16,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#384EA2', // Color de fondo del botón programar
    borderRadius: 5,
    marginHorizontal: 5,
  },
  footerButtonText: {
    color: '#fff', // Color del texto del botón programar
    fontSize: 16,
  },
});

export default TemporizadorModal;
