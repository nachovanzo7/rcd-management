# frontend/Dockerfile

# Etapa 1: Construir la aplicación con Node
FROM node:18-alpine as build

WORKDIR /app

# Copia el package.json y package-lock.json (si existe)
COPY package.json ./
# COPY package-lock.json ./

# Instala las dependencias
RUN npm install

# Fuerza la reconstrucción de esbuild
RUN npm rebuild esbuild

# Copia el resto del código fuente
COPY . .

# Construye la aplicación (esto generará la carpeta "dist")
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
