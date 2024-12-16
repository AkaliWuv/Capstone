import React, { useEffect, useState, useContext  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Print from 'expo-print';
import { DarkModeContext } from '../DarkModeContext';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';


function AnalisisScreen({ navigation, route }) {
  const [cantidadPollos, setCantidadPollos] = useState(null);
  const [tiposPollos, setTiposPollos] = useState([]);
  const [gastosComida, setGastosComida] = useState(null);
  const [tipoComida, setTipoComida] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [sacosComida, setSacosComida] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024'); 
  const { isDarkMode } = useContext(DarkModeContext); 
  const [isSharing, setIsSharing] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollosResponse = await axios.get(`${API_BASE_URL}/api/cantidad_pollos`);
        const tiposResponse = await axios.get(`${API_BASE_URL}/api/tipos_pollos`);
        const gastosResponse = await axios.get(`${API_BASE_URL}/api/gastos_comida_mes?year=${selectedYear}`);
        const tipoComidaResponse = await axios.get(`${API_BASE_URL}/api/tipo_comida_mas_consumida`);
        const proveedoresResponse = await axios.get(`${API_BASE_URL}/api/proveedores_bolsas`);
        const sacosResponse = await axios.get(`${API_BASE_URL}/api/tipo_comida_mas_consumida`);
  
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
    const { isDarkMode } = useContext(DarkModeContext); // Acceder al estado global del modo oscuro
  
    return (
      <View
        style={[
          styles.loadingContainer,
          isDarkMode && { backgroundColor: '#121212' }, // Fondo oscuro si está activado
        ]}
      >
        <Image
          source={require('../assets/logo.png')} // Ruta local de la imagen
          style={styles.loadingImage}
        />
        <Text
          style={[
            styles.loadingText,
            isDarkMode && { color: '#AAAAAA' }, // Cambiar color del texto en modo oscuro
          ]}
        >
         
        </Text>
      </View>
    );
  }

  
  const renderKPI = () => {
    return (
      <View
        style={[
          styles.kpiContainer,
          isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Fondo y borde en modo oscuro
        ]}
      >
        <Text
          style={[
            styles.kpiTitle,
            isDarkMode && { color: '#FFFFFF' }, // Título en modo oscuro
          ]}
        >
          KPI: Análisis de Pollos
        </Text>
        <Text
          style={[
            styles.kpiTotal,
            isDarkMode && { color: '#AAAAAA' }, // Texto principal en modo oscuro
          ]}
        >
          Total de Pollos: {cantidadPollos}
        </Text>
        <View style={styles.kpiDetails}>
          {tiposPollos.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.kpiDetail,
                isDarkMode && { color: '#CCCCCC' }, // Detalles en modo oscuro
              ]}
            >
              {item.tipo}: {item.percentage}% ({item.total} Pollos)
            </Text>
          ))}
        </View>
      </View>
    );
  };
  
  const renderGastosComidaKPI = () => {
    const totalGastoAnual = gastosMensuales.reduce((acc, mes) => acc + mes.total, 0);
    return (
      <View
        style={[
          styles.kpiContainer,
          isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Fondo y borde en modo oscuro
        ]}
      >
        <Text
          style={[
            styles.kpiTitle,
            isDarkMode && { color: '#FFFFFF' },
          ]}
        >
          KPI: Gastos de Comida
        </Text>
        <Text
          style={[
            styles.kpiTotal,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          Total Gastos Anuales: ${totalGastoAnual}
        </Text>
        <View style={styles.kpiDetails}>
          {gastosMensuales.map((mes, index) => (
            <Text
              key={index}
              style={[
                styles.kpiDetail,
                isDarkMode && { color: '#CCCCCC' },
              ]}
            >
              {mes.mes}: ${mes.total}
            </Text>
          ))}
        </View>
      </View>
    );
  };
  
  const renderTipoComidaKPI = () => (
    <View
      style={[
        styles.kpiContainer,
        isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Fondo y borde en modo oscuro
      ]}
    >
      <Text
        style={[
          styles.kpiTitle,
          isDarkMode && { color: '#FFFFFF' },
        ]}
      >
        KPI: Tipo de Comida Más Consumida
      </Text>
      <Text
        style={[
          styles.kpiTotal,
          isDarkMode && { color: '#AAAAAA' },
        ]}
      >
        {tipoComida?.nombre}: {tipoComida?.total} Kilos
      </Text>
    </View>
  );
  
  const renderProveedoresKPI = () => {
    const totalProveedores = proveedores.reduce((acc, proveedor) => acc + proveedor.total, 0);
    return (
      <View
        style={[
          styles.kpiContainer,
          isDarkMode && { backgroundColor: '#333', borderColor: '#555' }, // Fondo y borde en modo oscuro
        ]}
      >
        <Text
          style={[
            styles.kpiTitle,
            isDarkMode && { color: '#FFFFFF' },
          ]}
        >
          KPI: Proveedores Activos
        </Text>
        <Text
          style={[
            styles.kpiTotal,
            isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          Total Proveedores: {totalProveedores}
        </Text>
        <View style={styles.kpiDetails}>
          {proveedores.map((proveedor, index) => (
            <Text
              key={index}
              style={[
                styles.kpiDetail,
                isDarkMode && { color: '#CCCCCC' },
              ]}
            >
              {proveedor.proveedor}: {proveedor.total} bolsas
            </Text>
          ))}
        </View>
      </View>
    );
  };
  

  const generatePDF = async () => {
    // Evitar generar PDF si no hay datos disponibles
    if (!gastosMensuales || gastosMensuales.length === 0) {
      console.error('Gastos mensuales data is not available.');
      return;
    }
  
    // Calcular el total anual de gastos
    const totalGastoAnual = gastosMensuales.reduce((acc, mes) => acc + mes.total, 0);
  
    // Configuración de colores basada en el modo oscuro
    const backgroundColor = isDarkMode ? '#121212' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';
    const tableHeaderColor = isDarkMode ? '#333333' : '#CCCCCC';
  
    // Generar contenido HTML para el PDF
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: ${backgroundColor};
              color: ${textColor};
            }
            h1 {
              text-align: center;
              color: #384EA2;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: ${textColor};
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background-color: ${backgroundColor};
              color: ${textColor};
            }
            table, th, td {
              border: 1px solid ${tableHeaderColor};
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: ${tableHeaderColor};
            }
          </style>
        </head>
        <body>
          <h1>Análisis de Datos</h1>
  
          <!-- Sección de Pollos -->
          <div class="section">
            <h2 class="section-title">Análisis de Pollos</h2>
            <p>Cantidad Total de Pollos: ${cantidadPollos || 0}</p>
            <table>
              <tr>
                <th>Tipo</th>
                <th>Porcentaje</th>
                <th>Total</th>
              </tr>
              ${
                tiposPollos && tiposPollos.length > 0
                  ? tiposPollos
                      .map(
                        (item) => `
                          <tr>
                            <td>${item.tipo || 'N/A'}</td>
                            <td>${item.percentage || 0}%</td>
                            <td>${item.total || 0}</td>
                          </tr>
                        `
                      )
                      .join('')
                  : '<tr><td colspan="3">No hay datos disponibles</td></tr>'
              }
            </table>
          </div>
  
          <!-- Gastos de Comida -->
          <div class="section">
            <h2 class="section-title">Gastos de Comida</h2>
            <p>Total Gastos Anuales: $${totalGastoAnual}</p>
            <table>
              <tr>
                <th>Mes</th>
                <th>Gasto</th>
              </tr>
              ${
                gastosMensuales.map(
                  (mes) => `
                    <tr>
                      <td>${mes.mes || 'N/A'}</td>
                      <td>$${mes.total || 0}</td>
                    </tr>
                  `
                ).join('')
              }
            </table>
          </div>
  
          <!-- KPI: Tipo de Comida Más Consumida -->
          <div class="section">
            <h2 class="section-title">Tipo de Comida Más Consumida</h2>
            <p>${tipoComida?.nombre || 'N/A'}: ${tipoComida?.total || 0} Kilos</p>
          </div>
  
          <!-- KPI: Proveedores -->
          <div class="section">
            <h2 class="section-title">Proveedores</h2>
            <table>
              <tr>
                <th>Proveedor</th>
                <th>Total Bolsas</th>
              </tr>
              ${
                proveedores && proveedores.length > 0
                  ? proveedores
                      .map(
                        (prov) => `
                          <tr>
                            <td>${prov.proveedor || 'N/A'}</td>
                            <td>${prov.total || 0}</td>
                          </tr>
                        `
                      )
                      .join('')
                  : '<tr><td colspan="2">No hay datos disponibles</td></tr>'
              }
            </table>
          </div>
        </body>
      </html>
    `;
  
    try {
      // Generar PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('PDF generado en:', uri);
  
      // Compartir el PDF generado
      await shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir Análisis de Datos',
        UTI: 'com.adobe.pdf',
      });
  
      console.log('PDF compartido exitosamente');
    } catch (err) {
      console.error('Error al generar o compartir el PDF:', err.message);
    }
  };
  
  
  
  

  return (
    <View
      style={[
        styles.container,
        isDarkMode && { backgroundColor: '#121212' }, // Fondo en modo oscuro
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          isDarkMode && { backgroundColor: '#121212' }, // Fondo del header en modo oscuro
        ]}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.headerSubText,
              isDarkMode && { color: '#AAAAAA' }, // Texto secundario en modo oscuro
            ]}
          >
            Bienvenido
          </Text>
          <View style={styles.locationRow}>
            <Text
              style={[
                styles.headerMainText,
                isDarkMode && { color: '#FFFFFF' }, // Texto principal en modo oscuro
              ]}
            >
              Avijaulas
            </Text>
          </View>
        </View>
      </View>
  
      {/* Contenido principal */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDarkMode && { backgroundColor: '#121212' }, // Fondo del scroll container en modo oscuro
        ]}
      >
        <View style={styles.headerContainer}></View>
  
        <TouchableOpacity
          style={[
            styles.footerButton,
            isDarkMode && { backgroundColor: '#333', borderColor: '#555' },
          ]}
          onPress={generatePDF}
        >
          <Text
            style={[
              styles.footerButtonText,
              isDarkMode && { color: '#FFF' },
            ]}
          >
            Generar PDF
          </Text>
        </TouchableOpacity>
  
        {/* Sección de Análisis de Pollos */}
        <View
          style={[
            styles.section,
            isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' }, // Fondo y borde en modo oscuro
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              isDarkMode && { color: '#FFFFFF' }, // Título de sección en modo oscuro
            ]}
          >
            Análisis de Pollos
          </Text>
          <Text
            style={[
              styles.text,
              isDarkMode && { color: '#AAAAAA' }, // Texto en modo oscuro
            ]}
          >
            Cantidad Total de Pollos: {cantidadPollos}
          </Text>
  
          {/* Gráfico de Tipos de Pollos */}
          {Array.isArray(tiposPollos) && tiposPollos.length > 0 && (
            <PieChart
              data={tiposPollos.map((item, index) => ({
                name: item.tipo,
                population: parseInt(item.total),
                label: `${item.percentage}%`,
                color: `hsl(${(index * 60) % 360}, 50%, 60%)`,
                legendFontColor: isDarkMode ? '#FFFFFF' : '#7F7F7F', // Colores de leyenda
                legendFontSize: 15,
              }))}
              width={350}
              height={220}
              chartConfig={{
                backgroundColor: isDarkMode ? '#121212' : '#FFFFFF', // Fondo del gráfico
                color: (opacity = 1) =>
                  isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
            />
          )}
        </View>
  
        {/* KPI de Pollos */}
        {renderKPI()}
  
        {/* Sección de Gastos de Comida */}
        <View
          style={[
            styles.section,
            isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              isDarkMode && { color: '#FFFFFF' },
            ]}
          >
            Gastos de Comida
          </Text>
  
          {Array.isArray(gastosMensuales) && gastosMensuales.length > 0 && (
            <ScrollView horizontal={true}>
              <View
                style={[
                  styles.kpiContainer,
                  isDarkMode && { backgroundColor: '#333', borderColor: '#555' },
                ]}
              >
                <BarChart
                  data={{
                    labels: gastosMensuales.map((item) => item.mes),
                    datasets: [
                      {
                        data: gastosMensuales.map((item) => item.total),
                        color: () => (isDarkMode ? '#FFFFFF' : '#374EA3'),
                      },
                    ],
                  }}
                  width={1200}
                  height={300}
                  chartConfig={{
                    backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
                    backgroundGradientFrom: isDarkMode ? '#121212' : '#f7f7f7',
                    backgroundGradientTo: isDarkMode ? '#121212' : '#f7f7f7',
                    color: () => (isDarkMode ? '#FFFFFF' : '#374EA3'),
                    labelColor: () => (isDarkMode ? '#AAAAAA' : '#374EA3'),
                    yAxisLabel: '$',
                    yAxisSuffix: ' CLP',
                  }}
                  fromZero={true}
                  style={{
                    borderRadius: 8,
                    marginVertical: 10,
                  }}
                />
              </View>
            </ScrollView>
          )}
  
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={[
              styles.picker,
              isDarkMode && { backgroundColor: '#333', color: '#FFFFFF' },
            ]}
          >
            <Picker.Item label="2024" value="2024" />
            <Picker.Item label="2023" value="2023" />
          </Picker>
          {renderGastosComidaKPI()}
          {renderTipoComidaKPI()}
        </View>
  
        {/* Gráfico de Proveedores */}
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode && { color: '#FFFFFF' },
          ]}
        >
          Proveedores
        </Text>
  
        {Array.isArray(proveedores) && proveedores.length > 0 && (
          <PieChart
            data={proveedores.map((item, index) => ({
              name: item.proveedor,
              population: parseInt(item.total, 10),
              color: `hsl(${(index * 60) % 360}, 50%, 60%)`,
              legendFontColor: isDarkMode ? '#FFFFFF' : '#7F7F7F',
              legendFontSize: 15,
            }))}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
              color: (opacity = 1) =>
                isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
          />
        )}
        {renderProveedoresKPI()}
      </ScrollView>
  
      {/* Bottom Navigation */}
      <View
  style={[
    styles.navBar,
    isDarkMode && { backgroundColor: '#1E1E1E', borderTopColor: '#333' }, // Fondo y borde en modo oscuro
  ]}
>
  {[
    { name: 'Main', icon: 'home', label: 'Inicio' },
    { name: 'Pollos', icon: 'leaf', label: 'Pollos' },
    { name: 'Comida', icon: 'cutlery', label: 'Comida' },
    { name: 'Analisis', icon: 'bar-chart', label: 'Análisis' },
    { name: 'Perfil', icon: 'user', label: 'Perfil' },
  ].map((item) => {
    // Determina si la pestaña actual es la activa
    const isActive = route.name === item.name;

    return (
      <TouchableOpacity
        key={item.name}
        style={styles.navItem}
        onPress={() => navigation.navigate(item.name)}
      >
        <Icon
          name={item.icon}
          size={24}
          color={isActive ? (isDarkMode ? '#374EA3' : '#374EA3') : (isDarkMode ? '#AAAAAA' : '#aaa')}
        />
        <Text
          style={[
            styles.navText,
            isActive
              ? [styles.navTextActive, isDarkMode && { color: '#374EA3' }]
              : isDarkMode && { color: '#AAAAAA' },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10,
    paddingTop: 20, },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerSubText: {
    fontSize: 12,
    color: '#888',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer:  {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#aaa' },
  navTextActive: { fontSize: 12, color: '#384EA1' },

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
    color: '#555', // Color predeterminado para el texto
  },
  kpiDetails: {
    marginTop: 10,
  },
  kpiDetail: {
    fontSize: 14,
    color: '#777', // Color predeterminado para los detalles
  },
  footerButton: {
    backgroundColor: '#384EA2', // Example color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -20,
    marginBottom: 10,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AnalisisScreen;
