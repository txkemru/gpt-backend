# Dockerfile
FROM node:18

# Установим ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Создаём рабочую директорию
WORKDIR /app

# Копируем файлы
COPY . .

# Устанавливаем зависимости
RUN npm install

# Указываем порт
EXPOSE 10000

# Запуск сервера
CMD ["node", "server.js"]
