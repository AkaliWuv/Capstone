import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return '¡Buenos días!';
    } else if (hour < 18) {
      return '¡Buenas tardes!';
    } else {
      return '¡Buenas noches!';
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 

    return () => clearInterval(timerId); 
  }, []);

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Santiago',
  };
  
  const timeString = new Intl.DateTimeFormat('es-CL', options).format(currentTime);
  const dateString = currentTime.toLocaleDateString('es-CL');

  const opacity = new Animated.Value(0); 

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [timeString]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('./assets/logo 1.png')}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Animated.View style={{ opacity }}>
          <Text style={styles.time}>{timeString}</Text>
        </Animated.View>
        <Text style={styles.date}>{dateString}</Text>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.button}>
          <Icon name="clock-o" size={120} color="#384EA2" style={styles.icon} />
          <Text style={styles.buttonText}>Temporizador</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
      
      <View style={styles.rectangle}>
        <Text style={styles.sectionTitle}>Opciones</Text>
        <TouchableOpacity style={styles.rectButton}>
          <View style={styles.iconContainer}>
            <Icon name="cutlery" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Cantidad de Pollos</Text>
            <Text style={styles.rectButtonDescription}>Cantidad total de pollos en el corral.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectButton}>
          <View style={styles.iconContainer}>
            <Icon name="cutlery" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Cantidad de Comida</Text>
            <Text style={styles.rectButtonDescription}>Total de comida disponible para los pollos.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectButton}>
          <View style={styles.iconContainer}>
            <Icon name="bar-chart" size={24} color="#384EA2" />
          </View>
          <View style={styles.buttonContent}>
            <Text style={styles.rectButtonText}>Análisis de Datos</Text>
            <Text style={styles.rectButtonDescription}>Análisis estadístico de los datos recolectados.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 30,
    color: '#384EA2',
    marginBottom: 10,
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#384EA2',
    marginBottom: 20,
  },
  spacer: {
    height: 20,
  },
  button: {
    width: 210,
    height: 210,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#384EA2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 20,
    color: '#384EA2',
    textAlign: 'center',
    marginTop: 5,
  },
  icon: {
    marginBottom: 5,
  },
  rectangle: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#384EA2',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  rectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  buttonContent: {
    marginLeft: 10,
    flex: 1,
  },
  rectButtonText: {
    fontSize: 18,
    color: '#384EA2',
    fontWeight: 'bold',
  },
  rectButtonDescription: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  iconContainer: {
    backgroundColor: '#E3E3E3',
    borderRadius: 50,
    padding: 5,
  },
});
