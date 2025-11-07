import pool from './db.mjs';

async function test() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('Conexão OK:', rows[0]);

    const [comments] = await pool.query('SELECT * FROM Comments LIMIT 2');
    console.log('Seus comentários:', comments);
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

test();
