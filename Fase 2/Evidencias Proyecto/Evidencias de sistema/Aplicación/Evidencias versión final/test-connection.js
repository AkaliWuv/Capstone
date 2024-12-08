const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '35.227.7.77', // IP de tu VPS
    user: 'melgue',      // Usuario MySQL
    password: 'avijuelas1', // Contraseña MySQL
    database: 'avijuelas',  // Base de datos a la que te conectas
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.code, err.message, err.stack);
        return;
    }
    console.log('Connected to MySQL successfully!');
    db.end(); // Cierra la conexión después de probarla
});
