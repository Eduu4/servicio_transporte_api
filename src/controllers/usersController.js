const db = require('../db');

exports.listUsers = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUser = req.user;
    // Only admin or the same user can fetch details
    if (requestingUser.role_name !== 'admin' && String(requestingUser.id) !== String(id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { rows } = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};