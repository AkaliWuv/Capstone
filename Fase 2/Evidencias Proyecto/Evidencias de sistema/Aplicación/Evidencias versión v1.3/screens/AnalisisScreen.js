import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Usando el Picker correcto
import { PieChart, LineChart } from 'react-native-chart-kit'; // Mantén PieChart y LineChart

function AnalisisScreen() {
  const [cantidadPollos, setCantidadPollos] = useState(null);
  const [tiposPollos, setTiposPollos] = useState([]);
  const [gastosComida, setGastosComida] = useState(null);
  const [tipoComida, setTipoComida] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [sacosComida, setSacosComida] = useState([]); // Para los sacos de comida
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('1'); // Mes seleccionado
  const [selectedYear, setSelectedYear] = useState('2024'); // Año seleccionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consultas a la API
        const pollosResponse = await axios.get('http://10.0.2.2:5000/api/cantidad_pollos');
        const tiposResponse = await axios.get('http://10.0.2.2:5000/api/tipos_pollos');
        const gastosResponse = await axios.get(`http://10.0.2.2:5000/api/gastos_comida_mes?month=${selectedMonth}&year=${selectedYear}`);
        const tipoComidaResponse = await axios.get('http://10.0.2.2:5000/api/tipo_comida_mas_consumida');
        const proveedoresResponse = await axios.get('http://10.0.2.2:5000/api/proveedores_bolsas');
        const sacosResponse = await axios.get('http://10.0.2.2:5000/api/tipo_comida_mas_consumida'); // La API para los sacos de comida

        // Verificamos que los datos sean arrays antes de asignarlos
        setCantidadPollos(pollosResponse.data.total_pollos);
        setTiposPollos(Array.isArray(tiposResponse.data) ? tiposResponse.data : []);
        setGastosComida(gastosResponse.data.total_gasto);
        setGastosMensuales(Array.isArray(gastosResponse.data.mensuales) ? gastosResponse.data.mensuales : []);
        setTipoComida(tipoComidaResponse.data);
        setProveedores(Array.isArray(proveedoresResponse.data) ? proveedoresResponse.data : []);
        setSacosComida(Array.isArray(sacosResponse.data) ? sacosResponse.data : []); // Los datos de los sacos
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return <ActivityIndicator size="large" color="#384EA2" />;
  }

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.headerContainer}></View>
       <Image source={require('../assets/logo 1.png')} style={styles.logo} />
     
      {/* Sección de Análisis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Análisis de Pollos</Text>
        <Text>Cantidad Total de Pollos: {cantidadPollos}</Text>

        {/* Gráfico de Tipos de Pollos */}
        {Array.isArray(tiposPollos) && tiposPollos.length > 0 && (
          <PieChart
            data={tiposPollos.map((item) => ({
              name: item.tipo,
              population: item.total,
              color: '#384EA2',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            }))}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
          />
        )}
      </View>

      {/* Sección de Comida */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gastos de Comida</Text>
        <Text>Gastos del Mes en Comida: ${gastosComida}</Text>
        <Text>Comida Más Consumida: {tipoComida?.nombre}</Text>
        
        {/* Selectores de Mes y Año */}
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Enero" value="1" />
          <Picker.Item label="Febrero" value="2" />
          <Picker.Item label="Marzo" value="3" />
          <Picker.Item label="Abril" value="4" />
          <Picker.Item label="Mayo" value="5" />
          <Picker.Item label="Junio" value="6" />
          <Picker.Item label="Julio" value="7" />
          <Picker.Item label="Agosto" value="8" />
          <Picker.Item label="Septiembre" value="9" />
          <Picker.Item label="Octubre" value="10" />
          <Picker.Item label="Noviembre" value="11" />
          <Picker.Item label="Diciembre" value="12" />
        </Picker>

        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="2024" value="2024" />
          <Picker.Item label="2023" value="2023" />
        </Picker>

        {/* Gráfico de Proveedores */}
        <Text>Proveedores</Text>
        {Array.isArray(proveedores) && proveedores.length > 0 && (
          <PieChart
            data={proveedores.map((item) => ({
              name: item.proveedor,
              population: item.total,
              color: '#A384EA',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            }))}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
          />
        )}
      </View>

      {/* Gráfico de Gastos Mensuales (Gráfico de Puntos) */}
      {Array.isArray(gastosMensuales) && gastosMensuales.length > 0 && (
        <LineChart
          data={{
            labels: gastosMensuales.map(item => item.mes), // Meses
            datasets: [
              {
                data: gastosMensuales.map(item => item.total), // Gastos
                strokeWidth: 2,
              },
            ],
          }}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      )}

      {/* Gráfico de Sacos de Comida */}
      {/* <Text>Tipos de Sacos de Comida</Text> */}
      {Array.isArray(sacosComida) && sacosComida.length > 0 && (
        <PieChart
          data={sacosComida.map((item) => ({
            name: item.nombre,
            population: item.total,
            color: '#FF6347',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          }))}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  logo: {
    width: 250,
    height: 60,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#384EA2',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  picker: {
    height: 50,
    marginVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

export default AnalisisScreen;
