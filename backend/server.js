const express = require('express'); //  Підключення бібліотеки для роботи з сервером
const cors = require('cors'); // Підключення бібліотеки для роботи з CORS
const bodyParser = require('body-parser'); // Підключення бібліотеки для роботи з JSON
const { Database } = require('sqlite3'); // Підключення бібліотеки для роботи з базою даних SQLite

const app = express(); // Створення сервера
const port = 5000;
const db = new Database('database.db'); // Підключення бази даних SQLite

// Підключення cors (для уникнення помилок при виклику API з іншого домену)
app.use(cors());
app.use(bodyParser.json()); // Підключення bodyParser для роботи з JSON

// Створення таблиці для зберігання опитувань та відповідей
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS questionnaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        questions TEXT,
        completions INTEGER DEFAULT 0
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionnaire_id INTEGER,
        answers TEXT,
        completion_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Перевірка роботи сервера
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Отримати опитування
app.get('/api/questionnaires', (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    'SELECT * FROM questionnaires LIMIT ? OFFSET ?',
    [parseInt(limit), parseInt(offset)],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get('SELECT COUNT(*) AS count FROM questionnaires', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ data: rows, total: result.count });
      });
    }
  );
});

// Отримати відповіді
app.get('/api/responses', (req, res) => {
  db.all('SELECT * FROM responses', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    rows.forEach((row) => {
      row.answers = JSON.parse(row.answers);
    });

    res.json(rows);
  });
});

// Видалити всі відповіді
app.delete('/api/responses', (req, res) => {
  db.run('DELETE FROM responses', [], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Всі відповіді видалено' });
  });
});


app.get('/api/questionnaires/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM questionnaires WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Опитування не знайдено' });

    row.questions = JSON.parse(row.questions);
    res.json(row);
  });
});

// Додавання опитування
app.post('/api/questionnaires', (req, res) => {
  const { name, description, questions } = req.body;

  if (!name || !description || !questions) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  db.run(
    'INSERT INTO questionnaires (name, description, questions) VALUES (?, ?, ?)',
    [name, description, JSON.stringify(questions)],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID });
      }
    }
  );
});

// Отримати опитування за ID
app.post('/api/responses', (req, res) => {
  const { questionnaire_id, answers } = req.body;

  if (!questionnaire_id || !answers) {
    return res.status(400).json({ error: 'Не всі поля заповнені' });
  }

  db.run(
    'INSERT INTO responses (questionnaire_id, answers) VALUES (?, ?)',
    [questionnaire_id, JSON.stringify(answers)],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Оновлюємо кількість проходжень у таблиці questionnaires
      db.run(
        'UPDATE questionnaires SET completions = completions + 1 WHERE id = ?',
        [questionnaire_id]
      );

      res.json({ id: this.lastID });
    }
  );
});

// Оновлення опитування
app.put('/api/questionnaires/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, questions } = req.body;

  if (!name || !description || !questions) {
    return res.status(400).json({ error: 'Не всі поля заповнені' });
  }

  db.run(
    'UPDATE questionnaires SET name = ?, description = ?, questions = ? WHERE id = ?',
    [name, description, JSON.stringify(questions), id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Опитування оновлено' });
    }
  );
});

// Видалення опитування
app.delete('/api/questionnaires/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM questionnaires WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Опитування видалене' });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
