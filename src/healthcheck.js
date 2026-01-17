// Healthcheck para verificar que la API inicia correctamente
const db = require('./db');

async function check() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ BD connected:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ BD connection failed:', err.message);
    process.exit(1);
  }
}

check();
