import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegistroPollosModal = ({ visible, onClose, onRegister, onReload }) => {
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    // Helper function to get the current date and time
    const getCurrentDateTime = () => {
        const currentDate = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
        const [date, time] = currentDate.split(', ');
        return { date, time };
    };

    // Setting up the current date and time
    useEffect(() => {
        const { date, time } = getCurrentDateTime();
        setFecha(date);
        setHora(time);
        const timerId = setInterval(() => {
            const { date, time } = getCurrentDateTime();
            setFecha(date);
            setHora(time);
        }, 60000);

        return () => clearInterval(timerId);
    }, []);

    const handleRegister = () => {
        if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            Alert.alert('Error', 'Por favor ingresa una cantidad válida mayor que 0.');
            return;
        }

        const registroData = {
            cantidad: Number(cantidad),
            descripcion: descripcion || null, // null if empty
            tipo: tipo || null,               // null if empty
            fecha: fecha,                     // Fecha en formato "dd/MM/yyyy"
            hora: hora,                       // Hora en formato "HH:mm:ss"
            // Agregar la fecha y hora en formato UTC para el registro
            utcDateTime: new Date().toISOString(), // Esto genera la fecha y hora en UTC
        };

        // API call to register food
        fetch('http://10.0.2.2:5000/api/pollos', {
            method: 'POST',
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
            clearFields(); 

            // Wait a bit before closing the modal
            setTimeout(() => {
                if (typeof onRegister === 'function') {
                    onRegister(data); // Call onRegister with the registration data only if it is a function
                } else {
                    console.error('onRegister is not a function', onRegister);
                }
            }, 1500);
        })
        .catch(error => {
            Alert.alert('Error', 'No se pudo registrar la información de pollos. Intenta nuevamente. Detalles: ' + error.message);
        });
    };

    // Reset input fields
    const clearFields = () => {
        setCantidad('');
        setDescripcion('');
        setTipo('');
    };
    
    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        if (typeof onReload === 'function') {
            onReload();  // Call the function to reload the screen
        }
        onClose();   // Close the original modal
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
                        <Text style={styles.title}>Registrar Pollos</Text>
                        <Text style={styles.description}>Ingresa la cantidad de Pollos .</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="fastfood" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Cantidad (Unidades)"
                                keyboardType="numeric"
                                value={cantidad}
                                onChangeText={setCantidad}
                            />
                        </View>

                        {/* Campo "Tipo" movido aquí */}
                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color="#384EA2" />
                            <TextInput
                                style={styles.input}
                                placeholder="Tipo de Pollo"
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
                                <Text style={styles.footerButtonTextClose}>Cerrar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerButton} onPress={handleRegister}>
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
                        <Text style={styles.successMessage}>Registro realizado correctamente.</Text>
                        <TouchableOpacity style={styles.successButton} onPress={closeSuccessModal}>
                            <Text style={styles.successButtonText}>OK</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20,
        textAlign: 'center',
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
        textAlign: 'center',
    },
});

export default RegistroPollosModal;
