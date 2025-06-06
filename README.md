# Hojas de Vida - Automatización de gestión de hojas de vida

## Descripción

Esta aplicación backend está diseñada para automatizar la gestión de hojas de vida de personal. Permite crear, consultar, editar y eliminar hojas de vida, así como filtrar información por perfiles o habilidades.

## Tecnologías usadas

- Node.js con Express
- MongoDB para persistencia de datos
- JWT para autenticación y autorización
- Deploy en la nube (Render / Heroku / local)

## Instalación y ejecución local

1. Clona el repositorio:

bash
git clone git@github.com:MadeleFonB/Hojas-de-vida.git

cd Hojas-de-vida/backend
Instala las dependencias:
npm install
Crea un archivo .env con las variables necesarias (ejemplo):
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tuDB
JWT_SECRET=clave_supersecreta
Ejecuta la aplicación:
npm start
La API quedará disponible en http://localhost:3000

Credenciales de administrador para pruebas

Correo: admin@ejemplo.com
Password: Admin
Obtener token JWT (login)

Para autenticarte y obtener el token, ejecuta:

curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"correo":"admin@ejemplo.com","password":"Admin"}'
Respuesta esperada:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Uso del token para consumir API

Ejemplo para consultar hojas de vida usando el token:

curl -X GET http://localhost:3000/api/hojasdevida \
-H "Authorization: Bearer <tu_token_aqui>"
Notas

Recuerda reemplazar <tu_token_aqui> por el token recibido en el login.
Para mayor detalle sobre los endpoints consultar la documentación interna o Swagger (si aplica).
Cualquier duda o problema, contacta al equipo de desarrollo.

Madeleine Fonseca - 2025
