import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegistroNivelesModal = ({ visible, onClose, onRegister, onReload }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };

    useEffect(() => {
        const currentDate = getCurrentDate();
        setFechaCompra(currentDate);
    }, []);

    const showError = (message) => {
        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const handleRegister = async () => {
        // Validar que todos los campos requeridos estén llenos
        if (!nombre || isNaN(precio) || precio <= 0 || isNaN(cantidad) || cantidad <= 0) {
            showError('Por favor ingresa datos válidos para todos los campos.');
            return;
        }

        const registroData = {
            nombre,
            precio: Number(precio),
            proveedor: proveedor || null,
            cantidad: Number(cantidad),
            fecha_compra: fechaCompra,
        };

        try {
            const response = await fetch('http://10.0.2.2:5000/api/sacos_comida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registroData),
            });

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setSuccessModalVisible(true);
            clearFields();
            setTimeout(() => {
                if (typeof onRegister === 'function') {
                    onRegister(data);
                }
            }, 1500);
        } catch (error) {
            showError('No se pudo registrar el saco de comida. Intenta nuevamente. Detalles: ' + error.message);
        }
    };

    const clearFields = () => {
        setNombre('');
        setPrecio('');
        setProveedor('');
        setCantidad('');
    };

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        if (typeof onReload === 'function') {
            onReload();
        }
        onClose();
    };

    const closeErrorModal = () => {
        setErrorModalVisible(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Registrar Saco de Comida</Text>

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
                            <TouchableOpacity style={styles.footerButton} onPress={handleRegister}>
                                <Text style={styles.footerButtonText}>Registrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                transparent={true}
                animationType="slide"
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={styles.successOverlay}>
                    <View style={styles.successContainer}>
                        <Text style={styles.successTitle}>Éxito</Text>
                        <Text style={styles.successMessage}>Registro realizado correctamente.</Text>
                        <TouchableOpacity style={styles.successButton} onPress={closeSuccessModal}>
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
        backgroundColor: '#e0e0e0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    footerButtonClose: {
        flex: 1,
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    footerButton: {
        flex: 1,
        backgroundColor: '#384EA2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    footerButtonTextClose: {
        color: '#000',
        fontWeight: 'bold',
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    },
    successMessage: {
        fontSize: 16,
        marginVertical: 10,
    },
    successButton: {
        backgroundColor: '#384EA2',
        padding: 10,
        borderRadius: 5,
    },
    successButtonText: {
        color: '#fff',
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
        color: 'red',
    },
    errorMessage: {
        fontSize: 16,
        marginVertical: 10,
    },
    errorButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    errorButtonText: {
        color: '#fff',
    },
});

export default RegistroNivelesModal;
