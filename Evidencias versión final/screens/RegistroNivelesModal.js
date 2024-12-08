import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DarkModeContext } from '../DarkModeContext';
<<<<<<< HEAD
import { API_BASE_URL } from '../config';

=======
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4


const RegistroNivelesModal = ({ visible, onClose, onRegister, onReload, route }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fechaCompra, setFechaCompra] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  const { isDarkMode, toggleTheme } = useContext(DarkModeContext);


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
<<<<<<< HEAD
            const response = await fetch(`${API_BASE_URL}/api/sacos_comida`, {
=======
            const response = await fetch('http://10.0.2.2:5000/api/sacos_comida', {
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
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
                <View
                    style={[
                        styles.overlay,
                        isDarkMode && { backgroundColor: 'rgba(18, 18, 18, 0.8)' }, // Fondo en modo oscuro
                    ]}
                >
                    <View
                        style={[
                            styles.container,
                            isDarkMode && { backgroundColor: '#121212' }, // Contenedor en modo oscuro
                        ]}
                    >
                        <Text
                            style={[
                                styles.title,
                                isDarkMode && { color: '#FFF' }, // Título en modo oscuro
                            ]}
                        >
                            Registrar Saco de Comida
                        </Text>
    
                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFF',
                                        borderColor: '#777',
                                    },
                                ]}
                                placeholder="Nombre del saco"
                                placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
                                value={nombre}
                                onChangeText={setNombre}
                            />
                        </View>
    
                        <View style={styles.inputContainer}>
<<<<<<< HEAD
    <Icon name="attach-money" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
    <TextInput
        style={[
            styles.input,
            isDarkMode && {
                backgroundColor: '#121212',
                color: '#FFF',
                borderColor: '#777',
            },
        ]}
        placeholder="Precio"
        placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
        keyboardType="numeric" // Abre un teclado numérico
        value={precio}
        onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9.]/g, ''); // Permite solo números y un punto decimal
            setPrecio(numericValue);
        }}
    />
</View>
=======
                            <Icon name="attach-money" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFF',
                                        borderColor: '#777',
                                    },
                                ]}
                                placeholder="Precio"
                                placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
                                keyboardType="numeric"
                                value={precio}
                                onChangeText={setPrecio}
                            />
                        </View>
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
    
                        <View style={styles.inputContainer}>
                            <Icon name="business" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFF',
                                        borderColor: '#777',
                                    },
                                ]}
                                placeholder="Proveedor (opcional)"
                                placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
                                value={proveedor}
                                onChangeText={setProveedor}
                            />
                        </View>
    
                        <View style={styles.inputContainer}>
<<<<<<< HEAD
    <Icon name="add-shopping-cart" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
    <TextInput
        style={[
            styles.input,
            isDarkMode && {
                backgroundColor: '#121212',
                color: '#FFF',
                borderColor: '#777',
            },
        ]}
        placeholder="Cantidad"
        placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
        keyboardType="numeric" // Abre un teclado numérico
        value={cantidad}
        onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, ''); // Permite solo números
            setCantidad(numericValue);
        }}
    />
</View>
=======
                            <Icon name="add-shopping-cart" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFF',
                                        borderColor: '#777',
                                    },
                                ]}
                                placeholder="Cantidad"
                                placeholderTextColor={isDarkMode ? '#AAA' : '#999'}
                                keyboardType="numeric"
                                value={cantidad}
                                onChangeText={setCantidad}
                            />
                        </View>
>>>>>>> bfe0fd5160965dc5d8eed485962d6d2f68d30bf4
    
                        <View style={styles.readOnlyContainer}>
                            <Icon name="calendar-today" size={20} color={isDarkMode ? '#AAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.readOnlyInput,
                                    isDarkMode && { backgroundColor: '#121212', color: '#FFF' },
                                ]}
                                value={fechaCompra}
                                editable={false}
                            />
                        </View>
    
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[
                                    styles.footerButtonClose,
                                    isDarkMode && { backgroundColor: '#333' }, // Botón cerrar en modo oscuro
                                ]}
                                onPress={onClose}
                            >
                                <Text
                                    style={[
                                        styles.footerButtonTextClose,
                                        isDarkMode && { color: '#FFF' }, // Texto en modo oscuro
                                    ]}
                                >
                                    Cerrar
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.footerButton,
                                    isDarkMode && { backgroundColor: '#374EA3' }, // Botón registrar en modo oscuro
                                ]}
                                onPress={handleRegister}
                            >
                                <Text
                                    style={[
                                        styles.footerButtonText,
                                        isDarkMode && { color: '#FFF' }, // Texto en modo oscuro
                                    ]}
                                >
                                    Registrar
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
                <View
                    style={[
                        styles.successOverlay,
                        isDarkMode && { backgroundColor: 'rgba(18, 18, 18, 0.8)' }, // Fondo del modal de éxito en modo oscuro
                    ]}
                >
                    <View
                        style={[
                            styles.successContainer,
                            isDarkMode && { backgroundColor: '#121212' }, // Contenedor en modo oscuro
                        ]}
                    >
                        <Text
                            style={[
                                styles.successTitle,
                                isDarkMode && { color: '#FFF' }, // Título en modo oscuro
                            ]}
                        >
                            Éxito
                        </Text>
                        <Text
                            style={[
                                styles.successMessage,
                                isDarkMode && { color: '#AAA' }, // Mensaje en modo oscuro
                            ]}
                        >
                            Registro realizado correctamente.
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.successButton,
                                isDarkMode && { backgroundColor: '#374EA3' },
                            ]}
                            onPress={closeSuccessModal}
                        >
                            <Text
                                style={[
                                    styles.successButtonText,
                                    isDarkMode && { color: '#FFF' },
                                ]}
                            >
                                OK
                            </Text>
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
                <View
                    style={[
                        styles.errorOverlay,
                        isDarkMode && { backgroundColor: 'rgba(18, 18, 18, 0.8)' }, // Fondo del modal de error en modo oscuro
                    ]}
                >
                    <View
                        style={[
                            styles.errorContainer,
                            isDarkMode && { backgroundColor: '#121212' }, // Contenedor en modo oscuro
                        ]}
                    >
                        <Text
                            style={[
                                styles.errorTitle,
                                isDarkMode && { color: '#FFF' }, // Título en modo oscuro
                            ]}
                        >
                            Error
                        </Text>
                        <Text
                            style={[
                                styles.errorMessage,
                                isDarkMode && { color: '#AAA' }, // Mensaje en modo oscuro
                            ]}
                        >
                            {errorMessage}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.errorButton,
                                isDarkMode && { backgroundColor: '#FF6F61' },
                            ]}
                            onPress={closeErrorModal}
                        >
                            <Text
                                style={[
                                    styles.errorButtonText,
                                    isDarkMode && { color: '#FFF' },
                                ]}
                            >
                                Cerrar
                            </Text>
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
