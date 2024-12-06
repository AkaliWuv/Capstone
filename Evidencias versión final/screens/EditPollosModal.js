import React, { useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { DarkModeContext } from '../DarkModeContext';


const EditComidaModal = ({ visible, onClose, onUpdate, itemToEdit }) => {
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [imageUri, setImageUri] = useState(null); // Estado para almacenar la imagen seleccionada
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { isDarkMode, toggleTheme } = useContext(DarkModeContext);


    // Prefill the form with the item's existing data when the modal opens
    useEffect(() => {
        if (itemToEdit) {
            setCantidad(itemToEdit.cantidad.toString());
            setDescripcion(itemToEdit.descripcion || '');
            setTipo(itemToEdit.tipo || '');
            setFecha(itemToEdit.fecha);
            setHora(itemToEdit.hora);
            setImageUri(itemToEdit.imagen || null); // Asigna la imagen si ya existe
        }
    }, [itemToEdit]);

    // Función para seleccionar una imagen desde la galería (sin permitir edición)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri); // Accede correctamente a la URI
            console.log('Imagen seleccionada:', result.assets[0].uri);
        } else {
            console.log('No se seleccionó imagen');
        }
    };
    
    

    const handleEdit = () => {
        if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
            setErrorMessage('Por favor ingresa una cantidad válida mayor que 0.');
            setErrorModalVisible(true);
            return;
        }
    
        // Crear un nuevo FormData para enviar la imagen y los demás campos
        const updatedData = new FormData();
        updatedData.append('cantidad', Number(cantidad));
        updatedData.append('descripcion', descripcion || null);
        updatedData.append('tipo', tipo || null);
        updatedData.append('fecha', fecha);
        updatedData.append('hora', hora);
    
        if (imageUri) {
            updatedData.append('imagen', {
                uri: imageUri,
                type: 'image/jpeg', // Ajusta el tipo MIME según corresponda
                name: `image_${Date.now()}.jpg`, // Nombre único para la imagen
            });
        }
    
        fetch(`http://10.0.2.2:5000/api/pollos/${itemToEdit.id}`, {
            method: 'PUT',
            body: updatedData,
        })
        .then(response => response.json())
        .then(data => {
            setSuccessModalVisible(true);
            onUpdate(); // Notificar al componente padre para recargar los datos
            setTimeout(onClose, 1500); // Cerrar el modal después de un breve retraso
        })
        .catch(error => {
            setErrorMessage('No se pudo actualizar el registro. Intenta nuevamente. Detalles: ' + error.message);
            setErrorModalVisible(true);
        });
    };
    

    const closeSuccessModal = () => {
        setSuccessModalVisible(false);
        onClose(); // Cerrar el modal
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
                <View style={[styles.overlay, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
                    <View style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
                        <Text style={[styles.title, isDarkMode && { color: '#FFFFFF' }]}>
                            Editar Pollos
                        </Text>
                        <Text style={[styles.description, isDarkMode && { color: '#AAAAAA' }]}>
                            Modifica los detalles de los pollos.
                        </Text>
    
                        {/* Imagen */}
                        <View style={styles.imageContainer}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                            ) : (
                                <Text
                                    style={[
                                        styles.noImageText,
                                        isDarkMode && { color: '#AAAAAA' },
                                    ]}
                                >
                                    No se ha seleccionado imagen
                                </Text>
                            )}
                            <TouchableOpacity
                                onPress={pickImage}
                                style={[
                                    styles.imageButton,
                                    isDarkMode && { backgroundColor: '#555' },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.imageButtonText,
                                        isDarkMode && { color: '#FFFFFF' },
                                    ]}
                                >
                                    Seleccionar Imagen
                                </Text>
                            </TouchableOpacity>
                        </View>
    
                        <View style={styles.inputContainer}>
                            <Icon name="fastfood" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Cantidad (kg)"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                keyboardType="numeric"
                                value={cantidad}
                                onChangeText={setCantidad}
                            />
                        </View>
    
                        <View style={styles.inputContainer}>
                            <Icon name="label" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Tipo (ej. alimento, suplemento)"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                value={tipo}
                                onChangeText={setTipo}
                            />
                        </View>
    
                        <View style={styles.dateTimeContainer}>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="calendar-today" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                                <TextInput
                                    style={[
                                        styles.readOnlyInput,
                                        isDarkMode && {
                                            backgroundColor: '#121212',
                                            color: '#FFFFFF',
                                        },
                                    ]}
                                    value={fecha}
                                    editable={false}
                                />
                            </View>
                            <View style={styles.readOnlyContainer}>
                                <Icon name="access-time" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                                <TextInput
                                    style={[
                                        styles.readOnlyInput,
                                        isDarkMode && {
                                            backgroundColor: '#121212',
                                            color: '#FFFFFF',
                                        },
                                    ]}
                                    value={hora}
                                    editable={false}
                                />
                            </View>
                        </View>
    
                        <View style={styles.inputContainer}>
                            <Icon name="description" size={20} color={isDarkMode ? '#AAAAAA' : '#384EA2'} />
                            <TextInput
                                style={[
                                    styles.input,
                                    isDarkMode && {
                                        backgroundColor: '#121212',
                                        color: '#FFFFFF',
                                        borderColor: '#555',
                                    },
                                ]}
                                placeholder="Descripción (opcional)"
                                placeholderTextColor={isDarkMode ? '#AAAAAA' : '#999'}
                                value={descripcion}
                                onChangeText={setDescripcion}
                            />
                        </View>
    
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
    
            {/* Success Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={successModalVisible}
                onRequestClose={closeSuccessModal}
            >
                <View style={[styles.successOverlay, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
                    <View style={[styles.successContainer, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
                        <Text
                            style={[
                                styles.successTitle,
                                isDarkMode && { color: '#FFFFFF' },
                            ]}
                        >
                            Éxito
                        </Text>
                        <Text
                            style={[
                                styles.successMessage,
                                isDarkMode && { color: '#AAAAAA' },
                            ]}
                        >
                            Registro actualizado correctamente.
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.successButton,
                                isDarkMode && { backgroundColor: '#333' },
                            ]}
                            onPress={closeSuccessModal}
                        >
                            <Text
                                style={[
                                    styles.successButtonText,
                                    isDarkMode && { color: '#FFFFFF' },
                                ]}
                            >
                                OK
                            </Text>
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
                <View style={[styles.errorOverlay, isDarkMode && { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
                    <View style={[styles.errorContainer, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
                        <Text
                            style={[
                                styles.errorTitle,
                                isDarkMode && { color: '#FFFFFF' },
                            ]}
                        >
                            Error
                        </Text>
                        <Text
                            style={[
                                styles.errorMessage,
                                isDarkMode && { color: '#AAAAAA' },
                            ]}
                        >
                            {errorMessage}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.errorButton,
                                isDarkMode && { backgroundColor: '#333' },
                            ]}
                            onPress={closeErrorModal}
                        >
                            <Text
                                style={[
                                    styles.errorButtonText,
                                    isDarkMode && { color: '#FFFFFF' },
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
    // Estilos para el modal y el diseño
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
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 10,
    },
    noImageText: {
        fontSize: 16,
        color: '#7D7D7D',
        marginBottom: 10,
    },
    imageButton: {
        backgroundColor: '#384EA2',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    imageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
