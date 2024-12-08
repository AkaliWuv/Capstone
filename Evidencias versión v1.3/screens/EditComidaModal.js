import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditComidaModal = ({ visible, onClose, onUpdate, itemToEdit }) => {
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Prefill the form with the item's existing data when the modal opens
    useEffect(() => {
        if (itemToEdit) {
            setCantidad(itemToEdit.cantidad.toString());
            setDescripcion(itemToEdit.descripcion || '');
            setTipo(itemToEdit.tipo || '');
            setFecha(itemToEdit.fecha);
            setHora(itemToEdit.hora);
        }
    }, [itemToEdit]);

    const handleEdit = () => {
        if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            setErrorMessage('Por favor ingresa una cantidad válida mayor que 0.');
            setErrorModalVisible(true);
            return;
        }

        const updatedData = {
            cantidad: Number(cantidad),
            descripcion: descripcion || null,
            tipo: tipo || null,
            fecha: fecha,
            hora: hora,
        };

        // API call to update food entry
        fetch(`http://10.0.2.2:5000/api/comida/${itemToEdit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            setSuccessModalVisible(true);
            onUpdate(); // Notify parent component to reload data
            setTimeout(onClose, 1500); // Close the modal after a short delay
        })
        .catch(error => {
            setErrorMessage('No se pudo actualizar el registro. Intenta nuevamente. Detalles: ' + error.message);
            setErrorModalVisible(true);
        });
    };

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        onClose(); // Close the modal
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
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Editar Comida</Text>
                        <Text style={styles.description}>Modifica los detalles de la comida.</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="fastfood" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Cantidad (kg)"
                                keyboardType="numeric"
                                value={cantidad}
                                onChangeText={setCantidad}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Tipo (ej. alimento, suplemento)"
                                value={tipo}
                                onChangeText={setTipo}
                            />
                        </View>

                        <View style={styles.dateTimeContainer}>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="calendar-today" size={20} color="#384EA2" />
                                <TextInput
                                    style={styles.readOnlyInput}
                                    value={fecha}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="access-time" size={20} color="#384EA2" />
                                <TextInput
                                    style={styles.readOnlyInput}
                                    value={hora}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="description" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Descripción (opcional)"
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.footerButtonClose} onPress={onClose}>
                                <Text style={styles.footerButtonTextClose}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerButton} onPress={handleEdit}>
                                <Text style={styles.footerButtonText}>Guardar Cambios</Text>
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
                <View style={styles.successOverlay}>
                    <View style={styles.successContainer}>
                        <Text style={styles.successTitle}>Éxito</Text>
                        <Text style={styles.successMessage}>Registro actualizado correctamente.</Text>
                        <TouchableOpacity style={styles.successButton} onPress={closeSuccessModal}>
                            <Text style={styles.successButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Error Modal */}
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
                        <TouchableOpacity style={styles.errorButton} onPress={closeErrorModal}>
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
    },
    errorOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    errorContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF3D00', // Error color
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorButton: {
        backgroundColor: '#FF3D00', // Error button color
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    errorButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditComidaModal;
