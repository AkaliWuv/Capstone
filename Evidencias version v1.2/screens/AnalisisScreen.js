import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importa el Picker desde @react-native-picker/picker
import { BarChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ANALYSIS_OPTIONS = [
  { label: 'Gráfico de Barras', value: 'bar' },
  { label: 'Gráfico de Torta', value: 'pie' },
];

function AnalisisScreen() {
  const navigation = useNavigation();
  const [pollosData, setPollosData] = useState([]);
  const [comidaData, setComidaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState('bar');
  const [selectedChickenType, setSelectedChickenType] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.headerTitle}>Análisis de Datos</Text>
      ),
      headerTitleAlign: 'center',
      headerTintColor: '#384EA2',
    });

    const fetchData = async () => {
      try {
        const pollosResponse = await axios.get('http://10.0.2.2:5000/api/pollos');
        const comidaResponse = await axios.get('http://10.0.2.2:5000/api/comida');
        
        setPollosData(pollosResponse.data);
        setComidaData(comidaResponse.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigation]);

  const filterData = () => {
    const filteredPollos = selectedChickenType
      ? pollosData.filter(p => p.tipo === selectedChickenType)
      : pollosData;

    const filteredComida = selectedFoodType
      ? comidaData.filter(c => c.tipo === selectedFoodType)
      : comidaData;

    return {
      pollos: filteredPollos,
      comida: filteredComida,
    };
  };

  const { pollos, comida } = filterData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#384EA2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los datos: {error}. Por favor, intenta de nuevo.</Text>
      </View>
    );
  }

  // Data for charts
  const barChartData = {
    labels: ['Pollos', 'Comida'],
    datasets: [
      {
        data: [pollos.length, comida.length],
      },
    ],
  };

  const pieChartData = [
    {
      name: 'Pollos',
      population: pollos.length,
      color: '#384EA2',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Comida',
      population: comida.length,
      color: '#FF6384',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo 1.png')} style={styles.logo} />
        <TouchableOpacity>
          <Icon name="search" size={30} color="#384EA2" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Tipo de Gallinas:</Text>
        <Picker
          selectedValue={selectedChickenType}
          onValueChange={(itemValue) => setSelectedChickenType(itemValue)}
        >
          <Picker.Item label="Seleccione" value="" />
          {pollosData.map((pollo) => (
            <Picker.Item key={pollo.id} label={pollo.tipo} value={pollo.tipo} />
          ))}
        </Picker>

        <Text style={styles.filterLabel}>Tipo de Comida:</Text>
        <Picker
          selectedValue={selectedFoodType}
          onValueChange={(itemValue) => setSelectedFoodType(itemValue)}
        >
          <Picker.Item label="Seleccione" value="" />
          {comidaData.map((comida) => (
            <Picker.Item key={comida.id} label={comida.tipo} value={comida.tipo} />
          ))}
        </Picker>

        <Text style={styles.filterLabel}>Tipo de Gráfico:</Text>
        <Picker
          selectedValue={selectedChartType}
          onValueChange={(itemValue) => setSelectedChartType(itemValue)}
        >
          {ANALYSIS_OPTIONS.map(option => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.analysisContainer}>
        <Text style={styles.analysisText}>Análisis de Datos</Text>
        {selectedChartType === 'bar' ? (
          <BarChart
            data={barChartData}
            width={350}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <PieChart
            data={pieChartData}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        )}
      </View>
    </View>
  );
}

export default AnalisisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#384EA2',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 60,
    resizeMode: 'contain',
  },
  filterContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    color: '#384EA2',
    fontWeight: 'bold',
  },
  analysisContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  analysisText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 10,
  },
});
