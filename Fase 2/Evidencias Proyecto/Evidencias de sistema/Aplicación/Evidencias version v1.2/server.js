const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To receive JSON bodies

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // MySQL password
    database: 'avijuelas' // Your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to register food
app.post('/api/comida', (req, res) => {
    try {
        const { cantidad, descripcion, tipo } = req.body;

        // Validate request data
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida o faltan datos requeridos' });
        }

        const fechaActual = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const horaActual = new Date().toISOString().split('T')[1].split('.')[0]; // Format: HH:MM:SS

        const query = 'INSERT INTO comida (cantidad, fecha, hora, descripcion, tipo) VALUES (?, ?, ?, ?, ?)';
        const params = [cantidad, fechaActual, horaActual, descripcion || null, tipo || null];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error inserting into database:', err.sqlMessage || err);
                return res.status(500).json({ error: 'Error al registrar la comida' });
            }

            return res.status(201).json({
                id: results.insertId,
                cantidad,
                fecha: fechaActual,
                hora: horaActual,
                descripcion,
                tipo
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected error' });
    }
});

// Endpoint to retrieve all food records
app.get('/api/comida', (req, res) => {
    db.query('SELECT * FROM comida ORDER BY fecha DESC, hora DESC', (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to delete a food record by ID
app.delete('/api/comida/:id', (req, res) => {
    const comidaId = req.params.id;

    const query = 'DELETE FROM comida WHERE id = ?';
    db.query(query, [comidaId], (err, results) => {
        if (err) {
            console.error('Error deleting from database:', err);
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        }
        return res.status(204).send(); // No content
    });
});

// Endpoint to update a food record by ID
app.put('/api/comida/:id', (req, res) => {
    const comidaId = req.params.id;
    const { cantidad, descripcion, tipo } = req.body;

    const query = 'UPDATE comida SET cantidad = ?, descripcion = ?, tipo = ? WHERE id = ?';
    const params = [cantidad, descripcion, tipo, comidaId];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating database:', err);
            return res.status(500).json({ error: 'Error al actualizar el registro' });
        }
        return res.status(200).json({ id: comidaId, cantidad, descripcion, tipo });
    });
});

// Endpoint to register chickens
app.post('/api/pollos', (req, res) => {
    try {
        const { cantidad, descripcion, tipo } = req.body;

        // Validate request data
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida o faltan datos requeridos' });
        }

        const fechaActual = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const horaActual = new Date().toISOString().split('T')[1].split('.')[0]; // Format: HH:MM:SS

        const query = 'INSERT INTO pollos (cantidad, fecha, hora, descripcion, tipo) VALUES (?, ?, ?, ?, ?)';
        const params = [cantidad, fechaActual, horaActual, descripcion || null, tipo || null];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error inserting into database:', err.sqlMessage || err);
                return res.status(500).json({ error: 'Error al registrar los pollos' });
            }

            return res.status(201).json({
                id: results.insertId,
                cantidad,
                fecha: fechaActual,
                hora: horaActual,
                descripcion,
                tipo
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Unexpected error' });
    }
});

// Endpoint to retrieve all chicken records
app.get('/api/pollos', (req, res) => {
    db.query('SELECT * FROM pollos ORDER BY fecha DESC, hora DESC', (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Endpoint to delete a chicken record by ID
app.delete('/api/pollos/:id', (req, res) => {
    const polloId = req.params.id;

    const query = 'DELETE FROM pollos WHERE id = ?';
    db.query(query, [polloId], (err, results) => {
        if (err) {
            console.error('Error deleting from database:', err);
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        }
        return res.status(204).send(); // No content
    });
});

// Endpoint to update a chicken record by ID
app.put('/api/pollos/:id', (req, res) => {
    const polloId = req.params.id;
    const { cantidad, descripcion, tipo } = req.body;

    const query = 'UPDATE pollos SET cantidad = ?, descripcion = ?, tipo = ? WHERE id = ?';
    const params = [cantidad, descripcion, tipo, polloId];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating database:', err);
            return res.status(500).json({ error: 'Error al actualizar el registro' });
        }
        return res.status(200).json({ id: polloId, cantidad, descripcion, tipo });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
