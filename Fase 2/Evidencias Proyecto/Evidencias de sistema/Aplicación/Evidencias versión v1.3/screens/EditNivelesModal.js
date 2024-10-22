import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditNivelesModal = ({ visible, onClose, onUpdate, itemToEdit }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Prefill the form with the item's existing data when the modal opens
    useEffect(() => {
        if (itemToEdit) {
            setNombre(itemToEdit.nombre || '');
            setPrecio(itemToEdit.precio.toString() || '');
            setProveedor(itemToEdit.proveedor || '');
            setCantidad(itemToEdit.cantidad.toString() || '');
            setFechaCompra(itemToEdit.fecha_compra || '');
        }
    }, [itemToEdit]);

    const handleEdit = () => {
        // Validación de campos
        if (!nombre || !precio || isNaN(precio) || Number(precio) <= 0 || !cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            setErrorMessage('Por favor completa todos los campos válidos.');
            setErrorModalVisible(true);
            return;
        }

        const registroData = {
            nombre,
            precio: Number(precio),
            proveedor: proveedor || null,
            cantidad: Number(cantidad),
            fecha_compra: fechaCompra,
        };

        // API call to update food entry
        fetch(`http://10.0.2.2:5000/api/sacos_comida/${itemToEdit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registroData),
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
                        <Text style={styles.title}>Editar Saco de Comida</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del saco"
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="attach-money" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Precio"
                                keyboardType="numeric"
                                value={precio}
                                onChangeText={setPrecio}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="business" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Proveedor (opcional)"
                                value={proveedor}
                                onChangeText={setProveedor}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="add-shopping-cart" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Cantidad"
                                keyboardType="numeric"
                                value={cantidad}
                                onChangeText={setCantidad}
                            />
                        </View>

                        <View style={styles.readOnlyContainer}>
                            <Icon name="calendar-today" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.readOnlyInput}
                                value={fechaCompra}
                                editable={false}
                            />
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.footerButtonClose} onPress={onClose}>
                                <Text style={styles.footerButtonTextClose}>Cerrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerButton} onPress={handleEdit}>
                                <Text style={styles.footerButtonText}>Registrar</Text>
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
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374EA3',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    successButton: {
        backgroundColor: '#374EA3',
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
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF3D00',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorButton: {
        backgroundColor: '#FF3D00',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    errorButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditNivelesModal;
