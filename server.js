// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the tasks database.');
});

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    date TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Created tasks table.');
});

// Resto do código...
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { task, date } = req.body;
  db.run(`INSERT INTO tasks(task, date) VALUES(?, ?)`, [task, date], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: this.lastID, task, date });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});