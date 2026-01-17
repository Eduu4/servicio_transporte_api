const db = require('../db');

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // items: [{product_id, quantity}]
    const user_id = req.user && req.user.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    await db.query('BEGIN');
    const orderRes = await db.query('INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, created_at', [user_id, 'pending', 0]);
    const orderId = orderRes.rows[0].id;
    let total = 0;
    for (const it of items) {
      const p = await db.query('SELECT price FROM products WHERE id = $1', [it.product_id]);
      if (!p.rows[0]) throw new Error('Product not found');
      const price = p.rows[0].price;
      total += price * it.quantity;
      await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)', [orderId, it.product_id, it.quantity, price]);
    }
    await db.query('UPDATE orders SET total = $1 WHERE id = $2', [total, orderId]);
    await db.query('COMMIT');
    res.status(201).json({ orderId, total, created_at: orderRes.rows[0].created_at });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, user_id, status, total, created_at FROM orders WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ error: 'Order not found' });
    const order = rows[0];
    const requestingUser = req.user;
    if (requestingUser.role_name !== 'admin' && order.user_id !== requestingUser.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const items = (await db.query('SELECT product_id, quantity, price FROM order_items WHERE order_id = $1', [id])).rows;
    res.json({ ...order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};