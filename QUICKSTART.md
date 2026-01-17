# 🚀 Guía Rápida - Setup y Deploy API Paraguay

## ⚡ Quick Start (5 minutos)

### Para Windows PowerShell:

#### 1. Navega al directorio
```powershell
cd C:\Users\ACER\Pictures\oo\api_postgres
```

#### 2. Instalar dependencias
```powershell
npm install
```
(Ya ejecutado ✅)

#### 3. Crear Base de Datos
**Opción A: Automático (fácil)**
```powershell
.\setup-db.ps1
```
Te pedirá credenciales PostgreSQL y creará todo.

**Opción B: Manual**
1. Abre pgAdmin o DBeaver
2. Crea BD nueva:
   ```sql
   CREATE DATABASE api_paraguay;
   ```
3. En la BD, ejecuta:
   - Copia contenido de `sql/create_tables.sql` → pega en consola SQL → ejecuta
   - Copia contenido de `sql/seed.sql` → pega en consola SQL → ejecuta

#### 4. Configurar `.env`
El archivo ya existe con valores por defecto. Si cambió tu contraseña de Postgres, edita:
```
PGUSER=postgres
PGPASSWORD=TU_CONTRASEÑA_REAL
PGDATABASE=api_paraguay
```

#### 5. Iniciar servidor
```powershell
npm run dev
```

Verás:
```
API running on port 4000
```

#### 6. Probar
Abre navegador: http://localhost:4000/api/locations/departments

Deberías ver JSON con lista de departamentos.

---

## 📦 Estructura Creada

```
api_postgres/
├── .env                    ✅ Configuración local
├── .env.example            ✅ Plantilla (no editar)
├── .gitignore              ✅ Para GitHub
├── package.json            ✅ Dependencias
├── setup-db.ps1            ✅ Script setup Windows
├── setup-db.sh             ✅ Script setup Linux/Mac
├── DEPLOY.md               ✅ Guía deploy Render
├── README.md               ✅ Resumen endpoints
├── sql/
│   ├── create_tables.sql   ✅ Esquema BD
│   └── seed.sql            ✅ Datos iniciales
└── src/
    ├── app.js              ✅ Servidor Express
    ├── db.js               ✅ Conexión Postgres
    ├── middleware/         ✅ Auth JWT
    ├── controllers/        ✅ Lógica API
    ├── routes/             ✅ Endpoints
    └── utils/              ✅ Helpers (distancia, teléfono)
```

---

## 🧪 Probar Endpoints (ejemplos)

### Listar departamentos
```powershell
curl http://localhost:4000/api/locations/departments
```

### Listar hospitales en Asunción
```powershell
curl "http://localhost:4000/api/locations/hospitals?department_id=18"
```

### Validar teléfono paraguayo
```powershell
curl -X POST http://localhost:4000/api/locations/validate/phone `
  -H "Content-Type: application/json" `
  -d '{"phone":"0981234567"}'
```

### Estimar traslado
```powershell
curl -X POST http://localhost:4000/api/locations/estimate `
  -H "Content-Type: application/json" `
  -d '{"from":{"hospital_id":1},"to":{"hospital_id":4},"service_type_id":1}'
```

### Registrar usuario
```powershell
curl -X POST http://localhost:4000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Juan","email":"juan@test.com","password":"123456"}'
```

---

## 🌐 Deploy en Render (10 minutos)

Lee [DEPLOY.md](./DEPLOY.md) para instrucciones completas.

**Resumen rápido:**
1. Push a GitHub
2. Crear BD PostgreSQL en Render
3. Crear Web Service en Render (conecta tu repo)
4. Agregar variables `.env` en Render
5. Deploy automático ✅

URL final: `https://api-paraguay-xxxxx.onrender.com`

---

## ❓ Troubleshooting

| Problema | Solución |
|----------|----------|
| `Cannot find module 'pg'` | `npm install` (ya hecho) |
| `connect ECONNREFUSED` | PostgreSQL no corre. Abre pgAdmin o inicia servicio. |
| `database does not exist` | Ejecuta `setup-db.ps1` o crea BD manualmente. |
| `relations "usuarios" does not exist` | Ejecuta `sql/create_tables.sql` en la BD. |
| Puerto 4000 en uso | `$env:PORT=5000; npm run dev` |

---

## 📱 Para tu app React/Flutter/Móvil

Usa esta URL base:
- **Local**: `http://localhost:4000/api`
- **Production (Render)**: `https://api-paraguay-xxxxx.onrender.com/api`

Ejemplo:
```javascript
// JavaScript
const response = await fetch('http://localhost:4000/api/locations/departments');
const data = await response.json();
console.log(data);
```

---

**¿Listo?** Ejecuta en PowerShell:
```powershell
cd C:\Users\ACER\Pictures\oo\api_postgres
.\setup-db.ps1
npm run dev
```

Luego prueba: http://localhost:4000/api/locations/departments

¡Deberías ver los 18 departamentos de Paraguay! 🇵🇾
