const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer only once
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: '34.23.23.59',
  user: 'melgue',
  password: 'avijuelas1',
  database: 'avijuelas',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/home/melguetavi/uploads/'; // Ensure this folder exists on your VPS
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage }); // Configure multer only once

// Serve static files from the uploads directory
app.use('/uploads', express.static('/home/melguetavi/uploads'));

// Routes
app.post('/api/pollos', upload.single('imagen'), (req, res) => {
  try {
    const { cantidad, descripcion, tipo } = req.body;

    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({ error: 'Cantidad inválida o faltan datos requeridos.' });
    }

    const fechaActual = new Date().toISOString().split('T')[0];
    const horaActual = new Date().toISOString().split('T')[1].split('.')[0];
    const imagenRuta = req.file ? `/uploads/${req.file.filename}` : null;

    const query = 'INSERT INTO pollos (cantidad, fecha, hora, descripcion, tipo, imagen) VALUES (?, ?, ?, ?, ?, ?)';
    const params = [cantidad, fechaActual, horaActual, descripcion || null, tipo || null, imagenRuta];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Error inserting into database:', err.sqlMessage || err);
        return res.status(500).json({ error: 'Error al registrar los pollos.' });
      }

      res.status(201).json({
        id: results.insertId,
        cantidad,
        fecha: fechaActual,
        hora: horaActual,
        descripcion,
        tipo,
        imagen: imagenRuta,
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected error.' });
  }
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

app.put('/api/comida/:id', (req, res) => {
  const comidaId = req.params.id;
  const { descripcion } = req.body;

  // Validar que la descripción esté presente
  if (!descripcion) {
      return res.status(400).json({ error: 'La descripción es requerida.' });
  }

  const query = 'UPDATE comida SET descripcion = ? WHERE id = ?';
  const params = [descripcion, comidaId];

  db.query(query, params, (err, results) => {
      if (err) {
          console.error('Error updating database:', err);
          return res.status(500).json({ error: 'Error al actualizar el registro' });
      }

      // Comprobar si se afectaron filas (por si el ID no existe)
      if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Registro no encontrado.' });
      }

      return res.status(200).json({ id: comidaId, descripcion });
  });
});

// Configuración para analizar el cuerpo de la solicitud (body)



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

// Endpoint para actualizar un pollo con imagen
app.put('/api/pollos/:id', upload.single('imagen'), (req, res) => {
  const polloId = req.params.id;
  const { cantidad, descripcion, tipo } = req.body;

  // Si se ha subido una imagen, obtenemos su ruta
  let imagePath = null;
  if (req.file) {
      // Asegurarse de que la ruta tenga el prefijo adecuado
      imagePath = '/uploads/' + req.file.filename; // Usa 'filename' en lugar de 'path' para la ruta relativa
  }

  // Consulta SQL para actualizar el pollo
  const query = 'UPDATE pollos SET cantidad = ?, descripcion = ?, tipo = ?, imagen = ? WHERE id = ?';
  const params = [cantidad, descripcion, tipo, imagePath, polloId];

  db.query(query, params, (err, results) => {
      if (err) {
          console.error('Error updating database:', err);
          return res.status(500).json({ error: 'Error al actualizar el registro' });
      }
      return res.status(200).json({ id: polloId, cantidad, descripcion, tipo, imagen: imagePath });
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

// pollos analisis
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


app.get('/api/cantidad_pollos', (req, res) => {
  const query = `
    SELECT IFNULL(SUM(cantidad), 0) AS total_pollos 
    FROM pollos
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al recuperar datos:', err);
      return res.status(500).json({ error: 'Error al recuperar los datos' });
    }
    res.json({ total_pollos: results[0].total_pollos });
  });
});

app.get('/api/tipos_pollos', (req, res) => {
  // Primero, obtenemos la suma total de pollos en la tabla
  db.query('SELECT SUM(cantidad) AS total_general FROM pollos', (err, totalResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Luego, obtenemos el total por tipo de pollo
    db.query('SELECT tipo, SUM(cantidad) AS total FROM pollos GROUP BY tipo', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Si tenemos el total general, calculamos el porcentaje de cada tipo
      const totalGeneral = totalResult[0].total_general;
      if (totalGeneral && results.length > 0) {
        const resultsWithPercentage = results.map(item => {
          const percentage = ((item.total / totalGeneral) * 100).toFixed(2);
          return {
            tipo: item.tipo,
            total: item.total,
            percentage: percentage // Porcentaje de cada tipo
          };
        });

        res.json(resultsWithPercentage); // Devolvemos los resultados con porcentaje
      } else {
        res.json([]); // No hay datos para mostrar
      }
    });
  });
});

// termino pollos analisis

app.get('/api/gastos_comida_mes', (req, res) => {
  const { year } = req.query; // Ahora solo recibimos el año en los parámetros

  console.log("Año recibido:", year); // Log para verificar el año recibido

  // Consulta SQL para obtener la suma de los gastos de cada mes del año
  db.query(
    `SELECT 
      m.mes,
      COALESCE(SUM(sc.precio), 0) AS total_gasto
    FROM 
      (SELECT 1 AS mes UNION ALL 
       SELECT 2 UNION ALL 
       SELECT 3 UNION ALL 
       SELECT 4 UNION ALL 
       SELECT 5 UNION ALL 
       SELECT 6 UNION ALL 
       SELECT 7 UNION ALL 
       SELECT 8 UNION ALL 
       SELECT 9 UNION ALL 
       SELECT 10 UNION ALL 
       SELECT 11 UNION ALL 
       SELECT 12) AS m
    LEFT JOIN 
      sacos_comida sc ON MONTH(sc.fecha_compra) = m.mes AND YEAR(sc.fecha_compra) = ?
    GROUP BY 
      m.mes
    ORDER BY
      m.mes`,
    [year],
    (err, results) => {
      if (err) {
        console.error('Error al recuperar datos:', err);
        return res.status(500).json({ error: err.message });
      }

      // Log para ver los resultados
      console.log("Resultados de la consulta:", results);

      // Devolvemos los resultados
      res.json(results);
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
  console.log('Solicitud recibida para /api/proveedores_bolsas');
  
  db.query('SELECT proveedor, COUNT(*) AS total FROM sacos_comida GROUP BY proveedor', (err, results) => {
    if (err) {
      console.error('Error al recuperar datos de la base de datos:', err);
      return res.status(500).json({ error: err.message });
    }

    // Log de los resultados de la consulta
    console.log('Resultados obtenidos de la base de datos:', results);

    // Verificar el formato de los resultados antes de enviarlos
    if (!Array.isArray(results) || results.length === 0) {
      console.warn('No se encontraron datos para /api/proveedores_bolsas');
    } else {
      console.log(`Se encontraron ${results.length} registros`);
    }

    // Enviar los datos al cliente
    res.json(results);
  });
});


// fin analisis


  app.get('/api/cantidad_comida', (req, res) => {
    const query = 'SELECT SUM(cantidad) AS total_comida FROM sacos_comida';
  
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error ejecutando la consulta:', err);
        return res.status(500).json({ error: 'Error al obtener los datos.' });
      }
  
      // Devuelve el total de comida
      const totalComida = result[0].total_comida || 0; // Si es null, devuelve 0
      res.json({ total_comida: totalComida });
    });
  });

  
    
// RUTA: Registrar usuario
app.post('/register', async (req, res) => {
    const { name, phone, email, pin } = req.body;
  
    if (!pin) {
      return res.status(400).json({ error: 'El PIN es obligatorio' });
    }
  
    try {
      // Hashear el PIN
      const hashedPin = await bcrypt.hash(pin, 10);
  
      // Insertar datos en la tabla `avijuelas`
      const query = `
        INSERT INTO avijuelas (name, phone, email, pin)
        VALUES (?, ?, ?, ?)
      `;
      db.query(query, [name || null, phone || null, email || null, hashedPin], (err, result) => {
        if (err) {
          console.error('Error al insertar usuario:', err.message);
          return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
  
        res.status(201).json({
          message: 'Usuario registrado con éxito',
          userId: result.insertId,
        });
      });
    } catch (error) {
      console.error('Error al hashear el PIN:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

  
  // RUTA: Verificar PIN
  app.post('/login', async (req, res) => {
    const { pin } = req.body;
  
    if (!pin) {
      return res.status(400).json({ error: 'El PIN es obligatorio' });
    }
  
    try {
      // Buscar usuario con el PIN en la tabla `avijuelas`
      const query = 'SELECT * FROM avijuelas WHERE pin = ?';
      db.query(query, [pin], async (err, results) => {
        if (err) {
          console.error('Error al buscar el PIN:', err.message);
          return res.status(500).json({ error: 'Error al buscar el PIN' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        // Verificar el PIN hasheado
        const isMatch = await bcrypt.compare(pin, results[0].pin);
        if (!isMatch) {
          return res.status(401).json({ error: 'PIN incorrecto' });
        }
  
        res.status(200).json({
          message: 'Acceso concedido',
          user: results[0],
        });
      });
    } catch (error) {
      console.error('Error al verificar el PIN:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // RUTA: Obtener el ID del primer usuario
app.get('/api/user', (req, res) => {
  const query = 'SELECT id FROM avijuelas LIMIT 1'; // Solo devolver el primer usuario
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err.message);
      return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontró ningún usuario' });
    }
    
    // Enviar el ID del primer usuario
    res.status(200).json({ id: results[0].id });
  });
});


  app.put('/api/user/name', (req, res) => {
    const { id, name } = req.body;
  
    if (!id || !name) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
  
    const query = 'UPDATE avijuelas SET name = ? WHERE id = ?';
    db.query(query, [name, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar el nombre:', err);
        return res.status(500).json({ error: 'Error al actualizar el nombre' });
      }
      res.status(200).json({ message: 'Nombre actualizado correctamente' });
    });
  });
  
  // Endpoint para actualizar el teléfono del usuario
  app.put('/api/user/phone', (req, res) => {
    const { id, phone } = req.body;
  
    if (!id || !phone) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
  
    const query = 'UPDATE avijuelas SET phone = ? WHERE id = ?';
    db.query(query, [phone, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar el teléfono:', err);
        return res.status(500).json({ error: 'Error al actualizar el teléfono' });
      }
      res.status(200).json({ message: 'Teléfono actualizado correctamente' });
    });
  });
  
  // Endpoint para actualizar el correo del usuario
  app.put('/api/user/email', (req, res) => {
    const { id, email } = req.body;
  
    if (!id || !email) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
  
    const query = 'UPDATE avijuelas SET email = ? WHERE id = ?';
    db.query(query, [email, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar el correo:', err);
        return res.status(500).json({ error: 'Error al actualizar el correo' });
      }
      res.status(200).json({ message: 'Correo actualizado correctamente' });
    });
  });

  // RUTA: Eliminar usuario por ID
app.delete('/api/user/delete', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'El ID es obligatorio' });
  }

  const query = 'DELETE FROM avijuelas WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err.message);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  });
});

app.post('/api/login', async (req, res) => {
  const { name, pin } = req.body;

  if (!name || !pin) {
    return res.status(400).json({ error: 'El nombre y el PIN son obligatorios' });
  }

  try {
    // Buscar al usuario en la base de datos por el nombre
    const query = 'SELECT * FROM avijuelas WHERE name = ?';
    db.query(query, [name], async (err, results) => {
      if (err) {
        console.error('Error al buscar el usuario:', err);
        return res.status(500).json({ error: 'Error al buscar el usuario' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = results[0];

      // Verificar si el PIN ingresado coincide con el PIN de la base de datos
      const isMatch = await bcrypt.compare(pin, user.pin); // Comparar el PIN hasheado
      if (!isMatch) {
        return res.status(401).json({ error: 'PIN incorrecto' });
      }

      // Responder con los datos del usuario si todo es correcto
      res.status(200).json({
        message: 'Usuario encontrado y PIN correcto',
        user: user,
      });
    });
  } catch (error) {
    console.error('Error al verificar el nombre de usuario y PIN:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/check-user', async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS count FROM avijuelas';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al verificar el usuario:', err.message);
        return res.status(500).json({ error: 'Hubo un error al verificar el usuario' });
      }

      const count = results[0].count;
      if (count > 0) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    res.status(500).json({ error: 'Hubo un error al verificar el usuario' });
  }
});

app.post('/api/reset-pin', async (req, res) => {
  const { name, phone, email, newPin } = req.body;

  if (!name || !phone || !email || !newPin) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Buscar al usuario con los datos proporcionados
    const query = 'SELECT * FROM avijuelas WHERE name = ? AND phone = ? AND email = ?';
    db.query(query, [name, phone, email], async (err, results) => {
      if (err) {
        console.error('Error al buscar el usuario:', err);
        return res.status(500).json({ error: 'Error al buscar el usuario' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Hashear el nuevo PIN
      const hashedPin = await bcrypt.hash(newPin, 10);

      // Actualizar el PIN del usuario
      const updateQuery = 'UPDATE avijuelas SET pin = ? WHERE name = ? AND phone = ? AND email = ?';
      db.query(updateQuery, [hashedPin, name, phone, email], (err, updateResults) => {
        if (err) {
          console.error('Error al actualizar el PIN:', err);
          return res.status(500).json({ error: 'Error al actualizar el PIN' });
        }

        res.status(200).json({ message: 'PIN actualizado correctamente' });
      });
    });
  } catch (error) {
    console.error('Error interno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

  
  // RUTA: Obtener todos los usuarios (solo para pruebas)
  app.get('/users', (req, res) => {
    db.query('SELECT * FROM avijuelas', (err, results) => {
      if (err) {
        console.error('Error al obtener los usuarios:', err.message);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
      }
  
      res.status(200).json(results);
    });
  });

  app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Server running at http://34.23.23.59:${PORT}`);
});
