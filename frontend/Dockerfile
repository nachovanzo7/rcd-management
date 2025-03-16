# frontend/Dockerfile

# Etapa 1: Construir la aplicación con Node (Vite)
FROM node:18-alpine as build

WORKDIR /app

# Copia el package.json (y package-lock.json si existe)
COPY package.json ./
# COPY package-lock.json ./

# Instala las dependencias
RUN npm install

# Fuerza la reconstrucción de esbuild
RUN npm rebuild esbuild

# Copia el resto del código fuente
COPY . .

# Ejecuta el build (esto generará la carpeta "dist" con index.html y los assets)
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Elimina el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copia los archivos generados en la carpeta "dist" al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
