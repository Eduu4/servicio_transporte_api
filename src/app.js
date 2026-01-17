const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente 🚀' });
});

// Health check endpoint with database connection test
app.get('/health', async (req, res) => {
  try {
    const db = require('./db');
    const result = await db.query('SELECT NOW()');
    res.json({ 
      status: 'ok',
      database: 'connected',
      time: result.rows[0].now,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        PGHOST: process.env.PGHOST,
        PGDATABASE: process.env.PGDATABASE,
        PORT: process.env.PORT
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: error.message,
      environment: {
        PGHOST: process.env.PGHOST,
        PGDATABASE: process.env.PGDATABASE,
        PGUSER: process.env.PGUSER
      }
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
// Paraguay localization & locations
app.use('/api/locations', require('./routes/locations'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

module.exports = app;