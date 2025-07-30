# BlogTheChollos

Repositorio monorepo con el **frontend** (React/JS) y el **backend** (Node.js/Express + SQL Server) de la aplicación BlogTheChollos.

## Estructura del proyecto

BlogTheChollos/
backend/ # API y lógica de datos (Node.js + Express + SQL Server)
frontend-blog/ # Web app con React, Tailwind, etc.


## Requisitos previos

- Node.js (versión 16+ recomendada)
- npm o yarn
- Base de datos SQL Server para el backend

## Instalación

1. **Clonar el repositorio:**

git clone https://github.com/xatrix666/BlogTheChollos.git
cd BlogTheChollos

2. **Instalar dependencias del backend:**

cd backend
npm install

3. **Instalar dependencias del frontend:**

cd ../frontend-blog
npm install

## Cómo ejecutar el proyecto en local

Abre dos terminales:

- **Terminal 1:** (levanta el backend)

cd backend
npm start # O node server.js según configuración


- **Terminal 2:** (levanta el frontend)

cd frontend-blog
npm run dev # O npm start según configuración


La aplicación se abrirá (por defecto) en http://localhost:5173 (o el puerto que uses para frontend).

## Variables de entorno

Recuerda crear un archivo `.env` en la carpeta **backend** con la configuración de la base de datos y otros datos sensibles, por ejemplo:

DB_NAME=mini_blog
DB_SERVER=localhost
ADMIN_TOKEN=loquetuquieras

## Despliegue

- Para **frontend** (Vercel, Netlify, etc.): selecciona como carpeta de build `/frontend-blog`.
- Para **backend** (Railway, Render, Fly.io o VPS): selecciona `/backend` como raíz para arrancar la API Node.

Consulta la documentación de cada plataforma para detalles de despliegue.

## Scripts útiles

Si quieres arrancar ambos proyectos con un solo comando, puedes usar una herramienta como `concurrently` desde la raíz.

## Estructura recomendada .gitignore (ya configurado)

El repo ignora los `node_modules` y carpetas de build tanto de backend como frontend.

## Créditos

Desarrollado por [xatrix666](https://github.com/xatrix666).  
Si tienes sugerencias o quieres contribuir, ¡pull requests bienvenidas!
