-- Roles
INSERT INTO roles (nombre) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO roles (nombre) VALUES ('usuario') ON CONFLICT DO NOTHING;

-- Departamentos (18)
INSERT INTO departamentos (nombre) VALUES
('Concepción'),
('San Pedro'),
('Boquerón'),
('Alto Paraguay'),
('Amambay'),
('Canindeyú'),
('Presidente Hayes'),
('Alto Paraná'),
('Central'),
('Ñeembucú'),
('Paraguarí'),
('Guairá'),
('Caaguazú'),
('Caazapá'),
('Itapúa'),
('Misiones'),
('Cordillera'),
('Asunción')
ON CONFLICT DO NOTHING;

-- Números de emergencia
INSERT INTO numeros_emergencia (servicio, numero) VALUES
('Emergencias (General)', '911') ON CONFLICT DO NOTHING,
('Salud - Emergencias', '141') ON CONFLICT DO NOTHING,
('Policía', '110') ON CONFLICT DO NOTHING;

-- Tipos de servicio (6 tipos)
INSERT INTO tipos_servicio (nombre, descripcion) VALUES
('Ambulancia Básica', 'Traslado general y primeros auxilios') ON CONFLICT DO NOTHING,
('Ambulancia Avanzada', 'Soporte avanzado y paramédicos') ON CONFLICT DO NOTHING,
('Traslado Interhospitalario', 'Traslados programados entre hospitales') ON CONFLICT DO NOTHING,
('Atención Domiciliaria', 'Atención en el domicilio del paciente') ON CONFLICT DO NOTHING,
('Unidad de Trauma', 'Atención especializada en trauma') ON CONFLICT DO NOTHING,
('Pediatría Móvil', 'Traslados con atención pediátrica') ON CONFLICT DO NOTHING;

-- Hospitales (Asunción, Central, Alto Paraná, Itapúa)
INSERT INTO hospitales (nombre, departamento_id, direccion, telefono, tipo_hospital, latitud, longitud) VALUES
('Clínicas', (SELECT id FROM departamentos WHERE nombre='Asunción' LIMIT 1), 'Mcal. López 1234, Asunción', '+595 21 441000', 'Clínica Privada', -25.2946, -57.6359) ON CONFLICT DO NOTHING,
('Hospital Italiano', (SELECT id FROM departamentos WHERE nombre='Asunción' LIMIT 1), 'España 1182, Asunción', '+595 21 211000', 'Hospital', -25.2950, -57.6340) ON CONFLICT DO NOTHING,
('IPS Central', (SELECT id FROM departamentos WHERE nombre='Central' LIMIT 1), 'Eusebio Ayala Km 9, Central', '+595 21 220000', 'Hospital Público', -25.3575, -57.5123) ON CONFLICT DO NOTHING,
('Hospital de Trauma', (SELECT id FROM departamentos WHERE nombre='Asunción' LIMIT 1), 'Av. Mariscal López 987, Asunción', '+595 21 449000', 'Unidad de Trauma', -25.2900, -57.6400) ON CONFLICT DO NOTHING,
('Hospital Nacional', (SELECT id FROM departamentos WHERE nombre='Alto Paraná' LIMIT 1), 'C. 25 de Mayo, Ciudad del Este', '+595 61 562000', 'Hospital', -25.4948, -54.6669) ON CONFLICT DO NOTHING,
('Hospital Regional Itapúa', (SELECT id FROM departamentos WHERE nombre='Itapúa' LIMIT 1), 'Encarnación, Itapúa', '+595 71 221000', 'Hospital', -27.3389, -55.8964) ON CONFLICT DO NOTHING;

-- Direcciones de ejemplo para autocompletado
INSERT INTO direcciones (departamento_id, calle, referencia, latitud, longitud) VALUES
((SELECT id FROM departamentos WHERE nombre='Asunción' LIMIT 1), 'Mcal. López 1234', 'Cerca de la plaza', -25.2946, -57.6359) ON CONFLICT DO NOTHING,
((SELECT id FROM departamentos WHERE nombre='Asunción' LIMIT 1), 'España 1182', 'Frente al Banco', -25.2950, -57.6340) ON CONFLICT DO NOTHING,
((SELECT id FROM departamentos WHERE nombre='Central' LIMIT 1), 'Eusebio Ayala Km 9', 'Zona IPS', -25.3575, -57.5123) ON CONFLICT DO NOTHING;

-- Nota: Ejecuta primero sql/create_tables.sql y luego este seed.sql
