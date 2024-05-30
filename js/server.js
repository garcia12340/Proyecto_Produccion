const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database configuration
const dbConfig = {
    user: 'sa',
    password: 'admin1234',
    server: 'DESKTOP-AU7RE1H',
    database: 'Proyecto',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    }
};

// Connect to the database
sql.connect(dbConfig).catch(err => console.error('Database connection failed:', err));

// GET all records
app.get('/api/records', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM CantidadPedido');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST a new record
app.post('/api/records', async (req, res) => {
    const { Demanda, costoOrden, costoMantenimiento, Eoq, Analisis } = req.body;
    try {
        await sql.query`INSERT INTO CantidadPedido (Demanda, costoOrden, costoMantenimiento, Eoq, Analisis) VALUES (${Demanda}, ${costoOrden}, ${costoMantenimiento}, ${Eoq}, ${Analisis})`;
        res.status(201).send('Record added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT to update a record
app.put('/api/records/:id', async (req, res) => {
    const { id } = req.params;
    const { Demanda, costoOrden, costoMantenimiento, Eoq, Analisis } = req.body;
    try {
        await sql.query`UPDATE CantidadPedido SET Demanda = ${Demanda}, costoOrden = ${costoOrden}, costoMantenimiento = ${costoMantenimiento}, Eoq = ${Eoq}, Analisis = ${Analisis} WHERE IdCantidadPedido = ${id}`;
        res.send('Record updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE a record
app.delete('/api/records/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM CantidadPedido WHERE IdCantidadPedido = ${id}`;
        res.send('Record deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
