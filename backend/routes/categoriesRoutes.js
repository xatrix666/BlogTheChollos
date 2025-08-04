const express = require('express');
const router = express.Router();
const { connect, sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request().query('SELECT * FROM categories ORDER BY name');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo categorías' });
  } finally {
    sql.close();
  }
});

module.exports = router;
