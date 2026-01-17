# api_paraguay

API Express que se conecta a Postgres y expone endpoints para gestión de traslados, emergencias y hospitales en Paraguay.

## Quick Start

1. **Instalar dependencias**: `npm install`
2. **Configurar BD**: Crear BD en Postgres y ejecutar `sql/create_tables.sql` + `sql/seed.sql`
3. **Configurar `.env`**: Editar con credenciales de BD (`.env` ya existe con defaults)
4. **Iniciar**: `npm run dev` (desarrollo) o `npm start` (producción)
5. **Acceder**: http://localhost:4000

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas de setup local y deployment en Render.

## 🌐 Deploy en Render

Sigue la guía en [DEPLOY.md](./DEPLOY.md) para subir la API a Render (hosting gratuito).

## Endpoints

### Auth (público)
- POST /api/auth/register {name,email,password}
- POST /api/auth/login {email,password} → {token}

### Usuarios (protegido)
- GET /api/users  (admin only)
- GET /api/users/:id  (admin o usuario mismo)

### Localizaciones (público)
- GET /api/locations/departments
- GET /api/locations/hospitals?department_id=&q=  (autocomplete)
- GET /api/locations/hospitals/:id
- GET /api/locations/addresses?department_id=&q=
- GET /api/locations/emergencies
- POST /api/locations/validate/phone { phone }
- POST /api/locations/whatsapp/share { phone, message }
- POST /api/locations/estimate { from, to, service_type_id }  (calcula distancia y ETA)

### Órdenes (protegido)
- POST /api/orders { items: [{product_id, quantity}] }  (usuario autenticado)
- GET /api/orders/:id  (admin o dueño)

### Productos (mixto)
- GET /api/products (público)
- GET /api/products/:id (público)
- POST /api/products {name,description,price,stock,category_id}  (admin only)

---

Nota: envía token JWT en header `Authorization: Bearer <token>` para endpoints protegidos.
