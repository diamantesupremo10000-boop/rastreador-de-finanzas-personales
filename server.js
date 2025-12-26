const express = require('express');
const db = require('./database');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// --- API Endpoints ---

// 1. Obtener transacciones
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await db.getAll();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. Agregar transacción
app.post('/api/transactions', async (req, res) => {
    try {
        const { text, amount } = req.body;
        if (!text || amount === undefined) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }
        const newTransaction = await db.add(text, amount);
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 3. Eliminar transacción
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        await db.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Finance Tracker corriendo en puerto ${PORT}`);
});
