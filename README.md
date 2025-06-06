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

Ejecuta la aplicación:
npm start
La API quedará disponible en http://localhost:3000

Credenciales de administrador para pruebas

Correo: admin3@ejemplo.com
Password: Admin3
Obtener token JWT (login)

🔐 Credenciales de administrador para pruebas

⚠️ El fogueo del login y el registro fue realizado desde Postman usando la URL de producción (https://hojas-de-vida.onrender.com/api). Puedes registrar un nuevo usuario desde /auth/register y luego obtener el token desde /auth/login.
Credenciales de ejemplo:

Correo: admin@ejemplo.com
Password: Admin
## 🔑 Obtener token JWT (login)

Para autenticarte y obtener el token JWT:

curl -X POST https://hojas-de-vida.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@ejemplo.com","password":"Admin"}'
🔁 También puedes registrar un nuevo usuario con:
curl -X POST https://hojas-de-vida.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@ejemplo.com","password":"123456", "nombre":"Usuario Demo"}'
  
✅ Respuesta esperada:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "abc123...",
    "correo": "admin@ejemplo.com",
    "nombre": "Admin"
  }
}
📡 Uso del token para consumir la API

Ejemplo para consultar hojas de vida usando el token:

curl -X GET https://hojas-de-vida.onrender.com/api/hojas \
  -H "Authorization: Bearer <tu_token_aqui>"
🔁 Reemplaza <tu_token_aqui> por el token recibido al autenticarte.
Madeleine Fonseca - 2025
