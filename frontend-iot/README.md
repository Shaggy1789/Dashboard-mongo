# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
# Dashboard Vue + MongoDB

Dashboard desarrollado con Vue.js (Vite) para visualizar datos almacenados en MongoDB Atlas mediante un backend Node.js + Express.

## Requisitos

* Node.js 20 LTS
* npm 10 o superior
* Conexión a Internet
* MongoDB Atlas configurado

> Se recomienda usar Node.js 20 LTS. Versiones más recientes como Node 24 pueden causar problemas con dependencias nativas de Vite.

---

## Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/Dashboard-vue.git
cd Dashboard-vue
```

---

# Configuración del Frontend

Entrar a la carpeta:

```bash
cd frontend-iot
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

# Configuración del Backend

Abrir otra terminal y entrar a:

```bash
cd backend-mongo
```

Instalar dependencias:

```bash
npm install
```

Ejecutar servidor:

```bash
node server.js
```

El backend estará disponible en:

```text
http://localhost:3001
```

Endpoint principal:

```text
http://localhost:3001/api/dashboard
```

---

# MongoDB Atlas

Actualizar la cadena de conexión dentro de:

```text
backend-mongo/server.js
```

Ejemplo:

```js
const uri =
"mongodb+srv://usuario:contraseña@cluster.mongodb.net/SensoresDb?retryWrites=true&w=majority";
```

Además, en MongoDB Atlas:

1. Ir a Network Access.
2. Agregar la IP actual o:

   ```text
   0.0.0.0/0
   ```
3. Verificar que el usuario tenga permisos en Database Access.

---

# Estructura del Proyecto

```text
Dashboard-vue
│
├── backend-mongo
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── frontend-iot
    ├── src
    ├── public
    ├── package.json
    ├── vite.config.js
    └── README.md
```

---

# Solución de Problemas

### Error: vite no se reconoce

Instalar dependencias:

```bash
npm install
```

### Error: Cannot find native binding

Eliminar dependencias e instalar nuevamente:

PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Error: MongoServerSelectionError ETIMEDOUT

Verificar:

* Conexión a Internet.
* Network Access en MongoDB Atlas.
* Usuario y contraseña correctos.
* Cluster activo.

---

# Tecnologías Utilizadas

* Vue.js
* Vite
* Node.js
* Express
* MongoDB Atlas
* JavaScript

---

# Autor

Proyecto desarrollado para visualización de datos de sensores IoT almacenados en MongoDB Atlas.
