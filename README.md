
# 📧 Proyecto MERN - Campaña de Correos

Este es un sistema completo de envío masivo de correos con subida de archivos CSV, selección de plantillas, envío con colas (Bull + Redis) y un panel de monitoreo. El stack utilizado es **MERN** (MongoDB no se usa en este caso, pero el concepto se mantiene: **MySQL, Express, React, Node.js**).

## 🌐 Demo en línea
👉 [https://proyecto-mern-de-campa-a-de-correos.onrender.com](https://proyecto-mern-de-campa-a-de-correos.onrender.com)

---

## 📁 Estructura del proyecto

```
📦 Proyecto-MERN-de-campa-a-de-correos
├── client/                # Frontend en React + Vite
│   └── src/
│       └── components/
├── server/                # Backend en Express
│   ├── controllers/
│   ├── routes/
│   ├── jobs/
│   └── app.js
├── uploads/               # Imágenes cargadas por el usuario
├── .env
├── README.md
└── package.json
```

---

## 🚀 Cómo ejecutar localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/santiagoJordan01/Proyecto-MERN-de-campa-a-de-correos.git
cd Proyecto-MERN-de-campa-a-de-correos
```

### 2. Instala dependencias

```bash
npm install
cd client
npm install
cd ..
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379

MAILJET_API_KEY=TU_API_KEY
MAILJET_SECRET_KEY=TU_SECRET_KEY
```

> Asegúrate de tener una instancia de Redis corriendo localmente o en la nube.

---

### 4. Ejecuta la aplicación

#### Para desarrollo:

```bash
npm run dev
```

#### Para producción (con build):

```bash
npm run client-install
npm run client-build
npm start
```

---

## 🧪 Funcionalidades

- ✅ Subida de correos en formato CSV
- ✅ Adjuntar imagen personalizada al correo
- ✅ Vista previa del envío
- ✅ Envío en background usando colas (Bull)
- ✅ Monitor de envíos con BullBoard (`/admin/queues`)
- ✅ Visualización del estado de cada campaña

---

## ⚙️ Tecnologías usadas

- **Frontend:** React 19 + Vite
- **Backend:** Express.js + MySQL
- **Email:** Mailjet
- **Colas:** Bull + Redis
- **Despliegue:** Render (backend) + Vercel (opcional para frontend)

---

## 🧑‍💻 Autor

**Santiago Jordan Vargas**  
[GitHub](https://github.com/santiagoJordan01)

---

## 📝 Licencia

Este proyecto es de uso educativo y libre. Puedes adaptarlo para pruebas técnicas o proyectos personales.
