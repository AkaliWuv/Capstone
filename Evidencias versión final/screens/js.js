import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker'; // Usando el Picker correcto
import { PieChart, LineChart, BarChart  } from 'react-native-chart-kit'; // Mantén PieChart y LineChart

function AnalisisScreen() {
  const [cantidadPollos, setCantidadPollos] = useState(null);
  const [tiposPollos, setTiposPollos] = useState([]);
  const [gastosComida, setGastosComida] = useState(null);
  const [tipoComida, setTipoComida] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [sacosComida, setSacosComida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024'); // Año seleccionado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollosResponse = await axios.get('http://10.0.2.2:5000/api/cantidad_pollos');
        const tiposResponse = await axios.get('http://10.0.2.2:5000/api/tipos_pollos');
        const gastosResponse = await axios.get(`http://10.0.2.2:5000/api/gastos_comida_mes?year=${selectedYear}`);
        const tipoComidaResponse = await axios.get('http://10.0.2.2:5000/api/tipo_comida_mas_consumida');
        const proveedoresResponse = await axios.get('http://10.0.2.2:5000/api/proveedores_bolsas');
        const sacosResponse = await axios.get('http://10.0.2.2:5000/api/tipo_comida_mas_consumida');
  
        setCantidadPollos(pollosResponse.data.total_pollos);
        setTiposPollos(tiposResponse.data || []);
        setGastosComida(gastosResponse.data.total_gasto);
        setTipoComida(tipoComidaResponse.data);
        setProveedores(proveedoresResponse.data || []);
        setSacosComida(sacosResponse.data || []);
  
        // Completar los meses faltantes para los gastos mensuales
        const mesesConDatos = gastosResponse.data;
        const meses = [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
          "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const gastosCompleto = meses.map((mes, index) => {
          const mesData = gastosResponse.data.find((item) => item.mes === index + 1);
          return {
            mes,
            total: mesData ? parseInt(mesData.total_gasto, 10) : 0,
          };
        });
        setGastosMensuales(gastosCompleto);
        
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false); // Marcar que la carga ha terminado
      }
    };
  
    fetchData();
  }, [selectedYear]);
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require('../assets/logo.png')} // Local image path
          style={styles.loadingImage} // Add styling for centering and sizing
        />
      </View>
    );
  }
  

  // Crear el KPI para los pollos
  const renderKPI = () => {
    return (
      <View style={styles.kpiContainer}>
        <Text style={styles.kpiTitle}>KPI: Análisis de Pollos</Text>
        <Text style={styles.kpiTotal}>Total de Pollos: {cantidadPollos}</Text>
        <View style={styles.kpiDetails}>
          {tiposPollos.map((item, index) => (
            <Text key={index} style={styles.kpiDetail}>
              {item.tipo}: {item.percentage}% ({item.total} Pollos)
            </Text>
          ))}
        </View>
      </View>
    );
  };

  
  

  const KPI = ({ title, data }) => (
    <View style={styles.kpiContainer}>
      <Text style={styles.kpiTitle}>{title}</Text>
      {data.map((item, index) => (
        <Text key={index} style={styles.kpiDetail}>
          {item.name}: {item.value}
        </Text>
      ))}
    </View>
  );

  const renderGastosComidaKPI = () => {
    const totalGastoAnual = gastosMensuales.reduce((acc, mes) => acc + mes.total, 0);
    return (
      <View style={styles.kpiContainer}>
        <Text style={styles.kpiTitle}>KPI: Gastos de Comida</Text>
        <Text style={styles.kpiTotal}>Total Gastos Anuales: ${totalGastoAnual}</Text>
        <View style={styles.kpiDetails}>
          {gastosMensuales.map((mes, index) => (
            <Text key={index} style={styles.kpiDetail}>
              {mes.mes}: ${mes.total}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderTipoComidaKPI = () => (
    <View style={styles.kpiContainer}>
      <Text style={styles.kpiTitle}>KPI: Tipo de Comida Más Consumida</Text>
      <Text style={styles.kpiTotal}>
        {tipoComida?.nombre}: {tipoComida?.total} Kilos
      </Text>
    </View>
  );

  const renderProveedoresKPI = () => {
    const totalProveedores = proveedores.reduce((acc, proveedor) => acc + proveedor.total, 0);
    return (
      <View style={styles.kpiContainer}>
        <Text style={styles.kpiTitle}>KPI: Proveedores Activos</Text>
        <Text style={styles.kpiTotal}>Total Proveedores: {totalProveedores}</Text>
        <View style={styles.kpiDetails}>
          {proveedores.map((proveedor, index) => (
            <Text key={index} style={styles.kpiDetail}>
              {proveedor.proveedor}: {proveedor.total} bolsas
            </Text>
          ))}
        </View>
      </View>
    );
  };
  

  return (
    
    <ScrollView contentContainerStyle={styles.container1}>
      <View style={styles.headerContainer}></View>

      {/* Sección de Análisis de Pollos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Análisis de Pollos</Text>
        <Text>Cantidad Total de Pollos: {cantidadPollos}</Text>

        {/* Gráfico de Tipos de Pollos */}
        {Array.isArray(tiposPollos) && tiposPollos.length > 0 && (
          <PieChart
            data={tiposPollos.map((item, index) => ({
              name: item.tipo,
              population: parseInt(item.total),
              label: `${item.percentage}%`,
              color: `hsl(${(index * 60) % 360}, 50%, 60%)`,
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

      {/* KPI de Pollos */}
      {renderKPI()}

        {/* Sección de Gastos de Comida */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gastos de Comida</Text>
        

        {Array.isArray(gastosMensuales) && gastosMensuales.length > 0 && (
          <ScrollView horizontal={true}>
          <View style={[styles.kpiContainer, { padding: 0, alignItems: 'center' }]}>
            <BarChart
              data={{
                labels: gastosMensuales.map((item) => item.mes),
                datasets: [
                  {
                    data: gastosMensuales.map((item) => item.total),
                    color: () => '#374EA3', // Ensure bars have no opacity
                  },
                ],
              }}
              width={1200} // Adjust for scrolling
              height={300} // Match height of KPI container
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#f7f7f7',
                backgroundGradientTo: '#f7f7f7',
                color: () => `#374EA3`, // Y-axis and labels color
                labelColor: () => `#374EA3`, // Label color
                yAxisLabel: '$',
                yAxisSuffix: ' CLP',
                decimalPlaces: 0, // No decimals in Y-axis values
                yAxisInterval: 25000, // Step every 25,000
              }}
              yAxisMax={200000} // Set max value to 200,000
              fromZero={true}
              barPercentage={0.5}
              showValuesOnTopOfBars={true}
              verticalLabelRotation={0}
              style={{
                borderRadius: 8,
                marginVertical: 10,
              }}
            />
          </View>
        </ScrollView>
     
       
       







)}



        
        {/* Filtro de Año (debajo del gráfico) */}
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="2024" value="2024" />
          <Picker.Item label="2023" value="2023" />
        </Picker>
        {renderGastosComidaKPI()}
      {renderTipoComidaKPI()}
      </View>

      

      {/* Gráfico de Proveedores */}
      <Text style={styles.sectionTitle}>Proveedores</Text>

      {Array.isArray(proveedores) && proveedores.length > 0 && (
  <PieChart
    data={proveedores.map((item, index) => ({
      name: item.proveedor,
      population: parseInt(item.total, 10), // Ensure it's a number
      color: `hsl(${(index * 60) % 360}, 50%, 60%)`, // Same color logic as 'tiposPollos'
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
    paddingLeft="15"
  />
)}





      {renderProveedoresKPI()}

        
    
    </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,  // Ocupa todo el espacio disponible
    justifyContent: 'center',  // Centra verticalmente
    alignItems: 'center',  // Centra horizontalmente
  },

  loadingImage: {
    width: 250,  // Ajusta el tamaño según lo necesites
    height: 250,  // Ajusta el tamaño según lo necesites
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    width: '100%',  // Usar el ancho completo disponible
    height: 300,    // Ajustar la altura para mayor visibilidad
  },
  
  container1: {
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
  
  picker: {
    height: 50,
    marginVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  kpiContainer: {
    marginTop: 20,
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  kpiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#384EA2',
  },
  kpiTotal: {
    fontSize: 16,
    marginVertical: 5,
  },
  kpiDetails: {
    marginTop: 10,
  },
  kpiDetail: {
    fontSize: 14,
    color: '#555',
  },
});

export default AnalisisScreen;
