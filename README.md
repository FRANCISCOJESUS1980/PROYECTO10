# 📚 **Backend de Gestión de Eventos**

Este proyecto es una API RESTful desarrollada con **Node.js** y **Express** para la creación, actualización, eliminación y consulta de eventos. La aplicación permite a los usuarios autenticados gestionar eventos, subir imágenes a **Cloudinary**, y gestionar la autenticación mediante tokens **JWT**.

## 📋 **Características principales**

- 🔒 **Autenticación JWT** para proteger las rutas de la API.
- ☁️ **Subida de imágenes a Cloudinary**.
- 📄 **Validación de formularios** mediante middleware de validación.
- 📚 **Separación de responsabilidades** con controladores, rutas y middlewares organizados.
- 🔧 **Variables de entorno** gestionadas con **`.env`**.

---

## 📦 **Requisitos previos**

Asegúrate de tener instalados los siguientes componentes antes de continuar con la instalación:

- [Node.js](https://nodejs.org/) v16 o superior
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)
- Una cuenta en [Cloudinary](https://cloudinary.com/) para la gestión de imágenes

---

Rutas
Las rutas están separadas en controladores y se organizan en la carpeta /routes. Cada ruta llama a los métodos de los controladores correspondientes.

Rutas de usuarios (/routes/user.routes.js)
Rutas de eventos (/routes/event.routes.js)

Controladores
Los controladores están en la carpeta /controllers e implementan la lógica de negocio.

users.controller.js: Controla el registro, inicio de sesión, etc.
events.controller.js: Controla la creación, actualización, eliminación y obtención de eventos.

Middlewares
Los middlewares se encuentran en la carpeta /middlewares. Estos se utilizan para validar las solicitudes o proteger rutas.

authMiddleware.js: Protege las rutas que requieren autenticación.
registerValidation.js: Valida los datos de entrada para el registro de usuarios.

Cloudinary
Para la gestión de imágenes, se usa Cloudinary. La configuración se encuentra en el archivo /config/cloudinary.js y se conecta mediante las variables de entorno CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, y CLOUDINARY_API_SECRET.

Comandos de scripts
npm start: Inicia la aplicación en modo de producción.
npm run dev: Inicia la aplicación con nodemon para desarrollo.

Subida de imágenes
El sistema permite subir imágenes a Cloudinary. Para ello, se usa Cloudinary's API con la configuración de /config/cloudinary.js. Las imágenes se suben a la nube, y se almacena la URL de la imagen en la base de datos.

🛠️ Tecnologías usadas
Node.js
Express
MongoDB (a través de Mongoose)
JWT (para autenticación)
Cloudinary (para subida de imágenes)
Joi (para validación de entrada)
dotenv (para gestionar variables de entorno)

🤝 Contribuciones
Si deseas contribuir a este proyecto, ¡serás bienvenido! Por favor, sigue los siguientes pasos:

Haz un fork de este repositorio.
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
Realiza los cambios y haz commits.
Haz push a tu rama (git push origin feature/nueva-funcionalidad).
Abre un Pull Request.
📝 Licencia
Este proyecto está bajo la Licencia fjgv Puedes hacer lo que quieras con el código, pero no olvides dar crédito.
