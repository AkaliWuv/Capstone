import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegistroComidaModal = ({ visible, onClose, onRegister, onReload }) => {
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idSaco, setIdSaco] = useState(''); // Cambié 'tipo' por 'idSaco'
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false); // Nuevo estado para el modal de error
    const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error
    const [tiposComida, setTiposComida] = useState([]);

    const getCurrentDateTime = () => {
        const currentDate = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
        const [date, time] = currentDate.split(', ');
        return { date, time };
    };

    const fetchTiposComida = async () => {
        try {
            const response = await fetch('http://10.0.2.2:5000/api/sacos_comida');
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            const data = await response.json();
            setTiposComida(data);
        } catch (error) {
            console.error('Error fetching tipos de comida:', error);
            showError('No se pudo obtener los tipos de comida. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        const { date, time } = getCurrentDateTime();
        setFecha(date);
        setHora(time);
        fetchTiposComida();

        const timerId = setInterval(() => {
            const { date, time } = getCurrentDateTime();
            setFecha(date);
            setHora(time);
        }, 60000);

        return () => clearInterval(timerId);
    }, []);

    const showError = (message) => {
        setErrorMessage(message);
        setErrorModalVisible(true); // Mostrar el modal de error
    };

    const handleRegister = async () => {
        if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            showError('Por favor ingresa una cantidad válida mayor que 0.');
            return;
        }

        // Verificar la cantidad disponible del saco seleccionado
        if (idSaco) {
            try {
                const response = await fetch(`http://10.0.2.2:5000/api/sacos_comida/${idSaco}`);
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                const saco = await response.json();

                // Comprobar si la cantidad que se desea registrar excede la cantidad disponible
                if (Number(cantidad) > saco.cantidad) {
                    const cantidadRestante = saco.cantidad; // Captura la cantidad restante
                    showError(`La cantidad a registrar excede la cantidad disponible en el saco seleccionado. 
                        
Cantidad disponible: ${cantidadRestante} kg.`);
                    return;
                }
            } catch (error) {
                console.error('Error verificando la cantidad disponible:', error);
                showError('No se pudo verificar la cantidad disponible. Intenta nuevamente. Detalles: ' + error.message);
                return;
            }
        } else {
            showError('Por favor selecciona un tipo de saco.');
            return;
        }

        const registroData = {
            cantidad: Number(cantidad),
            descripcion: descripcion || null,
            id_saco: idSaco || null,
            fecha,
            hora,
            utcDateTime: new Date().toISOString(),
        };

        fetch('http://10.0.2.2:5000/api/comida', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                setTimeout(() => {
                    if (typeof onRegister === 'function') {
                        onRegister(data);
                    }
                }, 1500);
            })
            .catch(error => {
                showError('No se pudo registrar la comida. Intenta nuevamente. Detalles: ' + error.message);
            });
    };

    const clearFields = () => {
        setCantidad('');
        setDescripcion('');
        setIdSaco(''); // Cambié 'tipo' por 'idSaco'
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

                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color="#384EA2" />
                            <Picker
                                selectedValue={idSaco} // Cambié 'tipo' por 'idSaco'
                                style={styles.picker}
                                onValueChange={(itemValue) => setIdSaco(itemValue)} // Cambié 'setTipo' por 'setIdSaco'
                            >
                                <Picker.Item label="Selecciona un tipo" value="" />
                                {tiposComida.map((saco) => (
                                    <Picker.Item key={saco.id} label={saco.nombre} value={saco.id} /> // Cambié 'saco.tipo' a 'saco.nombre'
                                ))}
                            </Picker>
                        </View>

                        <View style={styles.dateTimeContainer}>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="calendar-today" size={20} color="#384EA2" />
                                <TextInput style={styles.readOnlyInput} value={fecha} editable={false} />
                            </View>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="access-time" size={20} color="#384EA2" />
                                <TextInput style={styles.readOnlyInput} value={hora} editable={false} />
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
    // ... otros estilos ...
    errorOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    errorContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374EA3',
    },
    errorMessage: {
        fontSize: 16,
        marginVertical: 10,
    },
    errorButton: {
        backgroundColor: '#374EA3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    errorButtonText: {
        color: '#fff',
        fontSize: 16,
    },
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
    picker: {
        flex: 1,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    readOnlyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 5,
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
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#384EA2',
        marginBottom: 10,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 20,
        textAlign: 'center',
    },
    successButton: {
        backgroundColor: '#384EA2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    successButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RegistroComidaModal;
