import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegistroComidaModal = ({ visible, onClose, onRegister }) => {
    const [cantidad, setCantidad] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false); // Estado para el modal de éxito

    useEffect(() => {
        const updateDateTime = () => {
            const currentDate = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
            const [date, time] = currentDate.split(', ');
            setFecha(date);
            setHora(time);
        };

        updateDateTime();
        const timerId = setInterval(updateDateTime, 60000);

        return () => clearInterval(timerId);
    }, []);

    const handleRegister = () => {
        if (!cantidad) {
            Alert.alert('Error', 'Por favor ingresa una cantidad válida.');
            return;
        }

        const registroData = {
            cantidad: cantidad,
            fecha: fecha,
            hora: hora,
            descripcion: descripcion,
        };

        console.log('Registro a enviar:', JSON.stringify(registroData));

        fetch('http://10.0.2.2:5000/api/comida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registroData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registro exitoso:', data);
                setSuccessModalVisible(true); // Muestra el modal de éxito
                onRegister(data); // Llama a la función onRegister pasada como prop
                // Cierra el modal original después de un breve retraso
                setTimeout(onClose, 1500);
            })
            .catch(error => {
                console.error('Error al registrar la comida:', error);
                Alert.alert('Error', 'No se pudo registrar la comida. Intenta nuevamente.');
            });
    };

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
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
                        <Text style={styles.title}>Registrar Comida</Text>
                        <Text style={styles.description}>Ingresa la cantidad de comida (kg).</Text>

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
        backgroundColor: '#E3E3E3',
        paddingVertical: 10,
        paddingLeft: 10,
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
        backgroundColor: '#D6D6D6',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    footerButtonTextClose: {
        color: '#384EA2',
        fontSize: 16,
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#384EA2',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    // Estilos para el modal de éxito
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
        alignItems: 'center',
        elevation: 5,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
    },
    successMessage: {
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },
    successButton: {
        backgroundColor: '#384EA2',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    successButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RegistroComidaModal;
