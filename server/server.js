const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

app.use(express.json());
app.use(cors());

// Подключение к базе данных SQLite
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("Ошибка подключения к базе данных:", err.message);
  else console.log("✅ Подключено к базе данных SQLite");
});

// Создание таблицы refresh_tokens
db.run("CREATE TABLE IF NOT EXISTS refresh_tokens (token TEXT UNIQUE)");

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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (user) {
      return res.status(400).json({ error: "Email уже используется" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ error: "Ошибка при регистрации" });
      }

      const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token });
    });
  });
});

// Вход в систему по email
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Неверные учетные данные" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Неверный пароль" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "7d" });
    
    db.run("INSERT INTO refresh_tokens (token) VALUES (?)", [refreshToken]);
    res.json({ token, refreshToken });
  });
});

// Обновление токена
app.post("/api/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Нет refresh токена" });

  db.get("SELECT * FROM refresh_tokens WHERE token = ?", [refreshToken], (err, token) => {
    if (err || !token) return res.status(403).json({ error: "Недействительный refresh токен" });

    jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Refresh токен недействителен" });

      const newToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ token: newToken });
    });
  });
});

// Выход из системы (удаление refresh токена)
app.post("/api/logout", (req, res) => {
  const { refreshToken } = req.body;
  db.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken], (err) => {
    if (err) return res.status(500).json({ error: "Ошибка при выходе" });
    res.json({ message: "Выход выполнен успешно" });
  });
});

// Получение данных аккаунта
app.get("/api/account", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.get("SELECT email, avatar FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ error: "Ошибка сервера" });
    }
    res.json(user);
  });
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
