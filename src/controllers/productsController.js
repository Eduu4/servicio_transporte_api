const db = require('../db');

exports.listProducts = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, description, price, stock FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, name, description, price, stock FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO products (name, description, price, stock, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, price',
      [name, description, price, stock, category_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};