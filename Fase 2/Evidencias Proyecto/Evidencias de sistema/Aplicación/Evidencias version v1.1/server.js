const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Para poder recibir JSON

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost', // Cambia si no es localhost
    user: 'root', // Usuario de MySQL
    password: '', // Contraseña de MySQL
    database: 'avijuelas' // Nombre de tu base de datos
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Endpoint para registrar comida
app.post('/api/comida', (req, res) => {
    const { cantidad, descripcion } = req.body; // Extraer también la descripción
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const horaActual = new Date().toLocaleTimeString('es-CL'); // Hora actual en formato español

    // Verificar que cantidad no sea undefined o null
    if (!cantidad) {
        return res.status(400).json({ error: 'Cantidad es requerida.' });
    }

    // La descripción puede ser opcional, así que la manejamos como tal
    db.query('INSERT INTO comida (cantidad, fecha, hora, descripcion) VALUES (?, ?, ?, ?)', [cantidad, fechaActual, horaActual, descripcion || null], (err, results) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, cantidad, fecha: fechaActual, hora: horaActual, descripcion: descripcion || null });
    });
    
});

//read comida:
app.get('/api/comida', (req, res) => {
    db.query('SELECT * FROM comida', (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // Devuelve los resultados como un array
    });
});



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
