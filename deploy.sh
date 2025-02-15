#!/bin/bash

# === Конфигурация ===
SERVER_USER="root"                 # Пользователь на сервере
SERVER_IP="188.120.246.132"        # IP-адрес сервера
SERVER_PATH="/var/www/snova"       # Путь к папке с проектом на сервере
NGINX_CONF="/etc/nginx/sites-available/snova" # Путь к конфигу Nginx
VITE_PORT="5173"                   # Порт, на котором работает Vite
BACKEND_DIR="server"               # Локальная папка с бэкендом
FRONTEND_DIR="."                   # Фронтенд находится в текущей директории
REMOTE_BACKEND_DIR="$SERVER_PATH/server" # Папка бэкенда на сервере
REMOTE_FRONTEND_DIR="$SERVER_PATH/frontend" # Папка фронтенда на сервере

# === 1. Сборка фронтенда локально ===
echo "🛠  Собираем фронтенд..."
rm -rf dist
npm install && npm run build || { echo "❌ Ошибка сборки фронтенда"; exit 1; }

# === 2. Передача фронтенда на сервер ===
echo "🚀 Передача файлов фронтенда на сервер..."
rsync -avz --delete dist/ "$SERVER_USER@$SERVER_IP:$REMOTE_FRONTEND_DIR/" || { echo "❌ Ошибка передачи фронта"; exit 1; }

# === 3. Передача бэкенда на сервер (БЕЗ node_modules) ===
echo "🚀 Передача серверной части на сервер (без node_modules)..."
rsync -avz --delete --exclude "node_modules" "$BACKEND_DIR/" "$SERVER_USER@$SERVER_IP:$REMOTE_BACKEND_DIR/" || { echo "❌ Ошибка передачи бэка"; exit 1; }

# === 4. Разворачивание на сервере ===
echo "🔄 Перезапуск сервисов на сервере..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
  set -e
  echo "📦 Обновление прав на файлы..."
  chown -R www-data:www-data "$SERVER_PATH"

  echo "🛠 Установка зависимостей бэка на сервере..."
  cd "$REMOTE_BACKEND_DIR"
  rm -rf node_modules
  npm install --production || { echo "❌ Ошибка установки зависимостей"; exit 1; }

  echo "🔄 Остановка старого бэкенда (если запущен)..."
  pkill -f "node server.js" || echo "⚠️ Бэкенд не был запущен"

  echo "🛠 Запуск бэкенда напрямую через Node.js..."
  nohup node server.js > server.log 2>&1 &

  echo "🔧 Проверка и перезапуск Nginx..."
  nginx -t && systemctl restart nginx

  echo "✅ Деплой завершен! Фронтенд и бэкенд обновлены! 🎉"
EOF
