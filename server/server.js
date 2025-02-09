const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";

app.use(express.json());
app.use(cors());

// Подключение к базе данных SQLite
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Ошибка подключения к базе данных:", err.message);
  else console.log("✅ Подключено к базе данных SQLite");
});

// Создание таблицы пользователей
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    avatar TEXT
  )`
);

// Проверка токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Нет токена" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Токен недействителен" });
    req.user = user;
    next();
  });
};

// Регистрация пользователя
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)" ,
    [username, email, hashedPassword, ""],
    function (err) {
      if (err) return res.status(400).json({ error: "Ошибка регистрации" });
      res.json({ message: "Регистрация успешна" });
    }
  );
});

// Вход в систему
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Неверные учетные данные" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Неверный пароль" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  });
});

// Получение данных аккаунта
app.get("/api/account", authenticateToken, (req, res) => {
  db.get("SELECT username, email, avatar FROM users WHERE id = ?", [req.user.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Пользователь не найден" });
    res.json(row);
  });
});

// Обновление данных аккаунта
app.post("/api/account", authenticateToken, async (req, res) => {
  const { username, email, password, avatar } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  db.run(
    `UPDATE users SET username = ?, email = ?, password = COALESCE(?, password), avatar = ? WHERE id = ?`,
    [username, email, hashedPassword, avatar, req.user.id],
    function (err) {
      if (err) return res.status(400).json({ error: "Ошибка обновления данных" });
      res.json({ message: "Данные успешно обновлены" });
    }
  );
});

// Настройки для загрузки аватаров
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/api/upload-avatar", authenticateToken, upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Ошибка загрузки аватара" });

  const avatarUrl = `/uploads/${req.file.filename}`;
  db.run("UPDATE users SET avatar = ? WHERE id = ?", [avatarUrl, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: "Ошибка сохранения аватара" });
    res.json({ url: avatarUrl });
  });
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
