const pool = require('./db');

async function testConnection() {
  try {
    console.log("Пытаемся выполнить запрос...");
    const result = await pool.query('SELECT NOW()');
    console.log('Подключение успешно. Текущее время на сервере БД:', result.rows[0].now);
  } catch (error) {
    console.error('Ошибка подключения:', error);
  } finally {
    await pool.end();
    console.log("Соединение закрыто");
  }
}

testConnection();
