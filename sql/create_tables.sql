-- Tablas en español para Paraguay (nombres y columnas en español)

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(255) NOT NULL UNIQUE,
  contrasena_hash TEXT NOT NULL,
  rol_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
  creado_en TIMESTAMP DEFAULT now()
);

-- Departamentos (18 departamentos de Paraguay)
CREATE TABLE IF NOT EXISTS departamentos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL UNIQUE
);

-- Hospitales
CREATE TABLE IF NOT EXISTS hospitales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  departamento_id INTEGER REFERENCES departamentos(id) ON DELETE SET NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  tipo_hospital VARCHAR(100),
  latitud NUMERIC(10,6),
  longitud NUMERIC(10,6),
  notas TEXT
);

-- Tipos de servicio (6 tipos)
CREATE TABLE IF NOT EXISTS tipos_servicio (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

-- Números de emergencia
CREATE TABLE IF NOT EXISTS numeros_emergencia (
  id SERIAL PRIMARY KEY,
  servicio VARCHAR(100) NOT NULL,
  numero VARCHAR(32) NOT NULL
);

-- Direcciones / sugerencias para autocompletado
CREATE TABLE IF NOT EXISTS direcciones (
  id SERIAL PRIMARY KEY,
  departamento_id INTEGER REFERENCES departamentos(id) ON DELETE SET NULL,
  calle VARCHAR(255),
  referencia TEXT,
  latitud NUMERIC(10,6),
  longitud NUMERIC(10,6)
);

-- (Opcional) Mantener tablas de e-commerce si se necesitan
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ordenes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS items_orden (
  id SERIAL PRIMARY KEY,
  orden_id INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE SET NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio NUMERIC(10,2) NOT NULL
);

-- Vistas de compatibilidad (mantener nombres en inglés para el código existente)
CREATE OR REPLACE VIEW users AS
  SELECT id, nombre AS name, correo AS email, contrasena_hash AS password_hash, rol_id AS role_id, creado_en AS created_at
  FROM usuarios;

CREATE OR REPLACE VIEW departments AS
  SELECT id, nombre AS name
  FROM departamentos;

CREATE OR REPLACE VIEW hospitals AS
  SELECT id, nombre AS name, departamento_id AS department_id, direccion AS address, telefono AS phone, tipo_hospital AS hospital_type, latitud AS latitude, longitud AS longitude, notas AS notes
  FROM hospitales;

CREATE OR REPLACE VIEW emergency_numbers AS
  SELECT id, servicio AS service, numero AS number
  FROM numeros_emergencia;

CREATE OR REPLACE VIEW addresses AS
  SELECT id, departamento_id AS department_id, calle AS street, referencia AS reference, latitud AS latitude, longitud AS longitude
  FROM direcciones;

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
CREATE INDEX IF NOT EXISTS idx_hospitales_nombre ON hospitales(nombre);
CREATE INDEX IF NOT EXISTS idx_departamentos_nombre ON departamentos(nombre);
CREATE INDEX IF NOT EXISTS idx_numeros_numero ON numeros_emergencia(numero);
