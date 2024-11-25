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
        const { cantidad, descripcion, id_saco } = req.body; // Change 'tipo' to 'id_saco'

        // Validate request data
        if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ error: 'Cantidad inválida o faltan datos requeridos' });
        }

        const fechaActual = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const horaActual = new Date().toISOString().split('T')[1].split('.')[0]; // Format: HH:MM:SS

        const query = 'INSERT INTO comida (cantidad, fecha, hora, descripcion, id_saco) VALUES (?, ?, ?, ?, ?)'; // Change 'tipo' to 'id_saco'
        const params = [cantidad, fechaActual, horaActual, descripcion || null, id_saco || null];

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
                id_saco // Change 'tipo' to 'id_saco'
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

// Endpoint para registrar un saco de comida
// Endpoint para registrar un saco de comida
app.post('/api/sacos_comida', (req, res) => {
    const { nombre, precio, proveedor, cantidad, fecha_compra } = req.body;

    // Validar los datos de la solicitud
    if (!nombre || isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 0 || !fecha_compra) {
        return res.status(400).json({ error: 'Datos inválidos o faltan datos requeridos' });
    }

    const query = 'INSERT INTO sacos_comida (nombre, precio, proveedor, cantidad, fecha_compra) VALUES (?, ?, ?, ?, ?)';
    const params = [nombre, precio, proveedor, cantidad, fecha_compra];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err.sqlMessage || err);
            return res.status(500).json({ error: 'Error al registrar el saco de comida' });
        }

        return res.status(201).json({
            id: results.insertId,
            nombre,
            precio,
            proveedor,
            cantidad,
            fecha_compra
        });
    });
});



// Endpoint para recuperar todos los sacos de comida
app.get('/api/sacos_comida', (req, res) => {
    db.query('SELECT * FROM sacos_comida ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error al recuperar datos:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



// Endpoint para actualizar un saco de comida por ID
app.put('/api/sacos_comida/:id', (req, res) => {
    const sacoId = req.params.id;
    const { nombre, precio, proveedor, cantidad, fecha_compra } = req.body;

    // Validar los datos de la solicitud
    if (!nombre || isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 0 || !fecha_compra) {
        return res.status(400).json({ error: 'Datos inválidos o faltan datos requeridos' });
    }

    const query = 'UPDATE sacos_comida SET nombre = ?, precio = ?, proveedor = ?, cantidad = ?, fecha_compra = ? WHERE id = ?';
    const params = [nombre, precio, proveedor, cantidad, fecha_compra, sacoId];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al actualizar la base de datos:', err);
            return res.status(500).json({ error: 'Error al actualizar el registro' });
        }
        return res.status(200).json({ id: sacoId, nombre, precio, proveedor, cantidad, fecha_compra });
    });
});



// Endpoint para eliminar un saco de comida por ID
app.delete('/api/sacos_comida/:id', (req, res) => {
    const sacoId = req.params.id;

    const query = 'DELETE FROM sacos_comida WHERE id = ?';
    db.query(query, [sacoId], (err, results) => {
        if (err) {
            console.error('Error al eliminar de la base de datos:', err);
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        }
        return res.status(204).send(); // Sin contenido
    });
});


// Endpoint to retrieve a specific food sack by ID
app.get('/api/sacos_comida/:id', (req, res) => {
    const sacoId = req.params.id;

    const query = 'SELECT * FROM sacos_comida WHERE id = ?';
    db.query(query, [sacoId], (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Saco de comida no encontrado' });
        }

        res.json(results[0]);
    });
});

app.get('/api/sacos_comida/alerts', async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT nombre, cantidad 
        FROM sacos_comida 
        WHERE cantidad <= 10
      `);
      const count = results.length;
      res.json({ count, alerts: results });
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });


//   apartado para el analisis de datos
// Endpoint para contar tipos de pollos
app.get('/api/pollos/count', (req, res) => {
    const query = `
        SELECT tipo, COUNT(*) as cantidad 
        FROM pollos 
        GROUP BY tipo
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error counting chickens:', err);
            return res.status(500).json({ error: 'Error al contar los pollos' });
        }
        res.json(results);
    });
});

// Endpoint para contar la cantidad de sacos de comida
app.get('/api/sacos_comida/count', (req, res) => {
    const query = 'SELECT COUNT(*) as total FROM sacos_comida';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error counting food sacks:', err);
            return res.status(500).json({ error: 'Error al contar los sacos de comida' });
        }
        res.json({ total: results[0].total });
    });
});

// Endpoint para obtener el tipo de comida más consumido
app.get('/api/comida/most_consumed', (req, res) => {
    const query = `
        SELECT descripcion, SUM(cantidad) as total_consumido 
        FROM comida 
        GROUP BY descripcion 
        ORDER BY total_consumido DESC 
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching most consumed food:', err);
            return res.status(500).json({ error: 'Error al obtener el tipo de comida más consumido' });
        }
        res.json(results[0] || { descripcion: null, total_consumido: 0 });
    });
});

  
  app.get('/api/cantidad_pollos', (req, res) => {
    db.query('SELECT SUM(cantidad) AS total_pollos FROM pollos', (err, results) => {
      if (err) {
        console.error('Error al recuperar datos:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]);
    });
  });
  app.get('/api/tipos_pollos', (req, res) => {
    db.query('SELECT tipo, SUM(cantidad) AS total FROM pollos GROUP BY tipo', (err, results) => {
      if (err) {
        console.error('Error al recuperar datos:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
   app.get('/api/gastos_comida_mes', (req, res) => {
    const { month, year } = req.query; // Suponiendo que recibimos el mes y año en los parámetros
  
    // Consulta SQL modificada para solo sumar la columna 'precio'
    db.query(
      `SELECT SUM(precio) AS total_gasto FROM sacos_comida WHERE MONTH(fecha_compra) = ? AND YEAR(fecha_compra) = ?`,
      [month, year],
      (err, results) => {
        if (err) {
          console.error('Error al recuperar datos:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(results[0] || { total_gasto: 0 }); // Si no hay resultados, devolver 0
      }
    );
  });
  app.get('/api/tipo_comida_mas_consumida', (req, res) => {
    db.query(
      'SELECT nombre, SUM(cantidad) AS total FROM sacos_comida GROUP BY nombre ORDER BY total DESC LIMIT 1',
      (err, results) => {
        if (err) {
          console.error('Error al recuperar datos:', err);
          return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
      }
    );
  });
  app.get('/api/proveedores_bolsas', (req, res) => {
    db.query('SELECT proveedor, COUNT(*) AS total FROM sacos_comida GROUP BY proveedor', (err, results) => {
      if (err) {
        console.error('Error al recuperar datos:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
    

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
