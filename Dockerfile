# Usar una imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto que la app usará
EXPOSE 4000

# Crear un usuario no root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar el propietario de los archivos
USER nodejs

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
