const db = require('../db');
const phoneUtil = require('../utils/phoneValidator');
const distanceUtil = require('../utils/distance');

exports.listDepartments = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name FROM departments ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listHospitals = async (req, res) => {
  try {
    const { department_id, q } = req.query;
    let query = 'SELECT id, name, department_id, address, phone, hospital_type, latitude, longitude FROM hospitals';
    const params = [];
    const where = [];
    if (department_id) { params.push(department_id); where.push(`department_id = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`name ILIKE $${params.length}`); }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY name LIMIT 50';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, name, department_id, address, phone, hospital_type, latitude, longitude, notes FROM hospitals WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Hospital not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listAddresses = async (req, res) => {
  try {
    const { department_id, q } = req.query;
    let query = 'SELECT id, department_id, street, reference, latitude, longitude FROM addresses';
    const params = [];
    const where = [];
    if (department_id) { params.push(department_id); where.push(`department_id = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`street ILIKE $${params.length} OR reference ILIKE $${params.length}`); }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY id LIMIT 50';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.listEmergencies = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, service, number FROM emergency_numbers ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.validatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const valid = phoneUtil.isValid(phone);
    const normalized = phoneUtil.normalize(phone);
    res.json({ valid, normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.whatsappShare = async (req, res) => {
  try {
    const { phone, message } = req.body;
    const normalized = phoneUtil.normalize(phone);
    // Create WhatsApp web URL
    const text = encodeURIComponent(message || 'Seguimiento de traslado');
    const phoneNum = normalized ? normalized.replace('+', '') : phone;
    const url = `https://wa.me/${phoneNum}?text=${text}`;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Estimar distancia y tiempo de traslado
exports.estimateTransfer = async (req, res) => {
  try {
    const { from, to, service_type_id } = req.body;
    // Resolve coordinates helper
    const resolveCoords = async (obj) => {
      if (!obj) return null;
      if (obj.lat !== undefined && obj.lng !== undefined) return { lat: Number(obj.lat), lng: Number(obj.lng) };
      if (obj.hospital_id) {
        const r = await db.query('SELECT latitude, longitude FROM hospitals WHERE id = $1 LIMIT 1', [obj.hospital_id]);
        if (!r.rows[0]) return null;
        return { lat: Number(r.rows[0].latitude), lng: Number(r.rows[0].longitude) };
      }
      if (obj.address_id) {
        const r = await db.query('SELECT latitude, longitude FROM addresses WHERE id = $1 LIMIT 1', [obj.address_id]);
        if (!r.rows[0]) return null;
        return { lat: Number(r.rows[0].latitude), lng: Number(r.rows[0].longitude) };
      }
      return null;
    };

    const fromCoords = await resolveCoords(from);
    const toCoords = await resolveCoords(to);
    if (!fromCoords || !toCoords) return res.status(400).json({ error: 'Unable to resolve coordinates for from or to' });

    const distanceKm = distanceUtil.haversineDistanceKm(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);

    let serviceName = null;
    if (service_type_id) {
      const s = await db.query('SELECT nombre FROM tipos_servicio WHERE id = $1 LIMIT 1', [service_type_id]);
      if (s.rows[0]) serviceName = s.rows[0].nombre;
    }

    const etaMinutes = distanceUtil.estimateTimeMinutes(distanceKm, serviceName);

    // Optional: return nearest hospital in same department (if to not provided)
    res.json({ distance_km: Number(distanceKm.toFixed(3)), eta_minutes: etaMinutes, service: serviceName || null, from: fromCoords, to: toCoords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};