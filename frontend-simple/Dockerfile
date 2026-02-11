FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Expose port
EXPOSE 5173

# Запуск dev server
CMD ["npm", "run", "dev", "--", "--host"]