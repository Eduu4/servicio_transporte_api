# API Paraguay - Guía de Setup y Deployment

API Express + Postgres para traslados, emergencias y gestión hospitalaria en Paraguay.

## 🚀 Setup Local

### Requisitos
- Node.js v18+
- PostgreSQL 12+
- npm o yarn

### Pasos

#### 1. Clonar/Descargar el proyecto
```bash
cd c:\Users\ACER\Pictures\oo\api_postgres
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Configurar Base de Datos
- Abre pgAdmin o conexión a PostgreSQL
- Crea una nueva BD:
  ```sql
  CREATE DATABASE api_paraguay;
  ```

#### 4. Ejecutar scripts SQL
En pgAdmin (consola SQL) o terminal:
```bash
psql -U tu_usuario -d api_paraguay -f sql/create_tables.sql
psql -U tu_usuario -d api_paraguay -f sql/seed.sql
```

#### 5. Configurar .env
El archivo `.env` ya está creado con valores por defecto. Edítalo si necesario:
```
PORT=4000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=tu_contraseña
PGDATABASE=api_paraguay
JWT_SECRET=tu_secreto_aleatorio_largo_min_32_caracteres
NODE_ENV=development
```

#### 6. Iniciar servidor local
```bash
npm run dev
```

Verás: `API running on port 4000`

---

## 🌐 Deploy en Render.com

### Pasos

#### 1. Preparar GitHub
- Crea un repositorio GitHub (privado o público)
- Añade `.gitignore` (ya existe en el proyecto)
- Haz push del código:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/tu_usuario/api_paraguay.git
  git push -u origin main
  ```

#### 2. Crear BD en Render
- Dirígete a https://render.com
- Login con GitHub
- En Dashboard → New → PostgreSQL
  - Name: `api-paraguay-db`
  - Region: Closest to users
  - PostgreSQL Version: Latest
  - Crear DB
- Espera a que se provisionione (5-10 min)
- Copia la `External Database URL` (será `DATABASE_URL`)

#### 3. Ejecutar scripts SQL en BD remota
- En Render BD → Connect
- Usa la URL para conectar con un cliente PostgreSQL (DBeaver, pgAdmin, etc.)
- Ejecuta `sql/create_tables.sql` y `sql/seed.sql`

#### 4. Crear servicio Web en Render
- Render → New → Web Service
- Conectar repo GitHub (selecciona `api_paraguay`)
- Configuración:
  - Name: `api-paraguay`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Region: Closest
  
#### 5. Agregar variables de entorno
En Render → tu servicio Web → Environment:
```
PORT=4000
PGHOST=<host de la BD de Render>
PGPORT=<puerto de la BD>
PGUSER=<usuario BD Render>
PGPASSWORD=<contraseña BD Render>
PGDATABASE=api_paraguay
JWT_SECRET=<genera una cadena aleatoria larga>
NODE_ENV=production
```

Obtén estos datos de la URL de conexión de tu BD en Render: `postgresql://user:password@host:port/db`

#### 6. Deploy
- Haz push a GitHub → Render detecta automáticamente
- Espera build (2-5 min)
- Si ve green ✅, tu API está live en: `https://api-paraguay-xxxx.onrender.com`

---

## 📡 Endpoints Disponibles

### Auth (público)
- **POST** `/api/auth/register` — Registrar usuario
- **POST** `/api/auth/login` — Login y recibir JWT token

### Usuarios (protegido)
- **GET** `/api/users` — Listar usuarios (admin only)
- **GET** `/api/users/:id` — Obtener usuario (admin o el mismo usuario)

### Localizaciones (público)
- **GET** `/api/locations/departments` — Listar departamentos
- **GET** `/api/locations/hospitals` — Buscar hospitales (query: `?department_id=&q=`)
- **GET** `/api/locations/hospitals/:id` — Detalle hospital
- **GET** `/api/locations/addresses` — Direcciones (query: `?department_id=&q=`)
- **GET** `/api/locations/emergencies` — Números de emergencia
- **POST** `/api/locations/validate/phone` — Validar teléfono paraguayo
- **POST** `/api/locations/whatsapp/share` — Generar link WhatsApp
- **POST** `/api/locations/estimate` — Calcular distancia y ETA

### Órdenes (protegido)
- **POST** `/api/orders` — Crear orden (usuario autenticado)
- **GET** `/api/orders/:id` — Obtener orden (admin o dueño)

### Productos (mixto)
- **GET** `/api/products` — Listar productos (público)
- **GET** `/api/products/:id` — Detalle producto (público)
- **POST** `/api/products` — Crear producto (admin only)

---

## 🧪 Pruebas rápidas

### Registrar usuario
```bash
curl -X POST https://api-paraguay-xxxx.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Perez","email":"juan@example.com","password":"123456"}'
```

### Login
```bash
curl -X POST https://api-paraguay-xxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"123456"}'
```

### Listar departamentos
```bash
curl https://api-paraguay-xxxx.onrender.com/api/locations/departments
```

### Buscar hospitales en Asunción
```bash
curl "https://api-paraguay-xxxx.onrender.com/api/locations/hospitals?department_id=18"
```

### Estimar traslado
```bash
curl -X POST https://api-paraguay-xxxx.onrender.com/api/locations/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "from": {"hospital_id": 1},
    "to": {"hospital_id": 4},
    "service_type_id": 1
  }'
```

---

## 📝 Notas Importantes

- **JWT_SECRET**: Genera uno seguro: `openssl rand -hex 32` o usa un generador online
- **Base de datos**: Los datos de seed incluyen 18 departamentos, hospitales principales y números de emergencia
- **Límites Render Free**: 0.5 CPU, 512 MB RAM, 100 GB datos/mes. Si crece, upgrade a pago
- **Node en Render**: Detecta automáticamente Node por `package.json`
- **Logs**: En Render → tu servicio → Logs para debugging

---

## 🛠️ Estructura del Proyecto

```
api_postgres/
├── src/
│   ├── app.js                 (servidor Express)
│   ├── db.js                  (conexión Postgres)
│   ├── middleware/
│   │   └── auth.js            (JWT auth)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── locationsController.js
│   │   ├── usersController.js
│   │   ├── productsController.js
│   │   └── ordersController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── locations.js
│   │   ├── users.js
│   │   ├── products.js
│   │   └── orders.js
│   └── utils/
│       ├── phoneValidator.js
│       └── distance.js
├── sql/
│   ├── create_tables.sql      (esquema)
│   └── seed.sql               (datos iniciales)
├── .env                       (variables de entorno)
├── .env.example               (plantilla)
├── .gitignore                 (git ignore)
├── package.json
├── package-lock.json
└── README.md

---

¿Necesitas ayuda con algún paso específico? Dime cuál y te lo aclaro.
