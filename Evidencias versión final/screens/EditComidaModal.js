import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DarkModeContext } from '../DarkModeContext';
<<<<<<< HEAD
import { API_BASE_URL } from '../config';

=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4

const EditComidaModal = ({ visible, onClose, onUpdate, itemToEdit }) => {
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { isDarkMode } = useContext(DarkModeContext);
    

    useEffect(() => {
        if (itemToEdit) {
            setDescripcion(itemToEdit.descripcion || '');
            setFecha(itemToEdit.fecha || '');
            setHora(itemToEdit.hora || '');
        }
    }, [itemToEdit]);

    const handleEdit = async () => {
        try {
            if (!descripcion.trim()) {
                setErrorMessage('La descripción no puede estar vacía.');
                setErrorModalVisible(true);
                return;
            }
    
            const updatedData = { descripcion: descripcion.trim() };
    
            console.log('Enviando datos al servidor:', updatedData);
    
            // Cambiar al endpoint correcto para actualizar el campo descripción
<<<<<<< HEAD
            const response = await fetch(`${API_BASE_URL}/api/comida/${itemToEdit.id}`, {
=======
            const response = await fetch(`http://10.0.2.2:5000/api/comida/${itemToEdit.id}`, {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
    
            console.log('Respuesta del servidor:', response);
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorText}`);
            }
    
            const data = await response.json();
            console.log('Datos actualizados:', data);
    
            // Mostrar el modal de éxito antes de cerrar
            setSuccessModalVisible(true);
    
            onUpdate(); // Notificar al componente padre que los datos fueron actualizados
    
            // Cierra el modal principal después de mostrar el modal de éxito
            setTimeout(() => {
                setSuccessModalVisible(false); // Oculta el modal de éxito
                onClose(); // Cierra el modal de edición
            }, 1500); // Mantén el modal de éxito visible por 1.5 segundos
        } catch (error) {
            console.error('Error al actualizar:', error.message);
            setErrorMessage('No se pudo actualizar la descripción. Detalles: ' + error.message);
            setErrorModalVisible(true);
        }
    };
    
    

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        onClose();
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={onClose}
            >
                <View
                    style={[
                        styles.overlay,
                        isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                    ]}
                >
                    <View
                        style={[
                            styles.container,
                            isDarkMode && { backgroundColor: '#121212', borderColor: '#333' },
                        ]}
                    >
                        <Text
                            style={[
                                styles.title,
                                isDarkMode && { color: '#FFFFFF' },
                            ]}
                        >
                            Editar Descripción
                        </Text>
                        <Text
                            style={[
                                styles.description,
                                isDarkMode && { color: '#AAAAAA' },
                            ]}
                        >
                            Modifica la descripción del registro.
                        </Text>

                        {/* Campo de Fecha */}
                        <View style={styles.readOnlyContainer}>
                            <Icon
                                name="calendar-today"
                                size={20}
                                color={isDarkMode ? '#BBBBBB' : '#384EA2'}
                            />
                            <TextInput
                                style={[
                                    styles.readOnlyInput,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                value={fecha}
                                editable={false}
                            />
                        </View>

                        {/* Campo de Hora */}
                        <View style={styles.readOnlyContainer}>
                            <Icon
                                name="access-time"
                                size={20}
                                color={isDarkMode ? '#BBBBBB' : '#384EA2'}
                            />
                            <TextInput
                                style={[
                                    styles.readOnlyInput,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                value={hora}
                                editable={false}
                            />
                        </View>

                        {/* Campo de Descripción */}
                        <View style={styles.inputContainer}>
                            <Icon
                                name="description"
                                size={20}
                                color={isDarkMode ? '#BBBBBB' : '#384EA2'}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Descripción"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>

                        {/* Botones de acción */}
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
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.footerButton,
                                    isDarkMode && { backgroundColor: '#374EA3' },
                                ]}
                                onPress={handleEdit}
                            >
                                <Text
                                    style={[
                                        styles.footerButtonText,
                                        isDarkMode && { color: '#FFFFFF' },
                                    ]}
                                >
                                    Guardar Cambios
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de éxito */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.successOverlay}>
                    <View style={styles.successContainer}>
                        <Text style={styles.successTitle}>Éxito</Text>
                        <Text style={styles.successMessage}>Descripción actualizada correctamente.</Text>
                        <TouchableOpacity
                            style={styles.successButton}
                            onPress={closeSuccessModal}
                        >
                            <Text style={styles.successButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de error */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={errorModalVisible}
                onRequestClose={closeErrorModal}
            >
                <View style={styles.errorOverlay}>
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                        <TouchableOpacity
                            style={styles.errorButton}
                            onPress={closeErrorModal}
                        >
                            <Text style={styles.errorButtonText}>Cerrar</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
    readOnlyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    readOnlyInput: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#e0e0e0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    footerButton: {
        backgroundColor: '#384EA2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    footerButtonClose: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    footerButtonTextClose: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default EditComidaModal;
