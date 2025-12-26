const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'finance.db');
const db = new sqlite3.Database(dbPath);

// Inicializar DB
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            amount REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = {
    // Obtener todas las transacciones
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM transactions ORDER BY created_at DESC", [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    // Agregar transacción
    add: (text, amount) => {
        return new Promise((resolve, reject) => {
            db.run("INSERT INTO transactions (text, amount) VALUES (?, ?)", [text, amount], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, text, amount });
            });
        });
    },
    // Eliminar transacción
    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM transactions WHERE id = ?", [id], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};
