import PushNotification from 'react-native-push-notification';

// Configuración inicial
PushNotification.configure({
  onNotification: function (notification) {
    console.log('Notificación recibida:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

// Función para mostrar una notificación
export const showNotification = (title, message, image) => {
  PushNotification.localNotification({
    title: title,
    message: message,
    bigPictureUrl: image, // Imagen grande (para Android)
    largeIconUrl: image, // Icono grande
    smallIcon: 'ic_notification', // Asegúrate de agregar un icono en res/drawable
    priority: 'high',
  });
};
