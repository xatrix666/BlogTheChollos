const express = require('express');
const router = express.Router();
const { connect, sql } = require('../db'); // según tu configuración

// Token admin básico para proteger rutas sensitivas
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'xale';

function isAdmin(req, res, next) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'No autorizado' });
}

// GET: obtener todos los posts ordenados por fecha descendente
router.get('/', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request()
      .query('SELECT * FROM Posts ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener chollos' });
  }
});

// GET: obtener un post por id
router.get('/:id', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Posts WHERE id = @id');
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Chollo no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener chollo' });
  }
});

// POST: crear un nuevo chollo (solo admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, content, image, price, link } = req.body;
    const pool = await connect();
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content || null)
      .input('image', sql.NVarChar, image || null)
      .input('price', sql.NVarChar, price || null)
      .input('link', sql.NVarChar, link || null)
      .input('created_at', sql.DateTime, new Date())
      .query('INSERT INTO Posts (title, content, image, price, link, created_at) OUTPUT INSERTED.* VALUES (@title, @content, @image, @price, @link, @created_at)');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al crear el chollo' });
  }
});

// PUT: editar un chollo (solo admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { title, content, image, price, link } = req.body;
    const pool = await connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content || null)
      .input('image', sql.NVarChar, image || null)
      .input('price', sql.NVarChar, price || null)
      .input('link', sql.NVarChar, link || null)
      .query(`UPDATE Posts SET title = @title, content = @content, image = @image, price = @price, link = @link WHERE id = @id;
              SELECT * FROM Posts WHERE id = @id`);
    if (result.recordset.length === 0) return res.status(404).json({ error: 'Chollo no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al actualizar el chollo' });
  }
});

// DELETE: borrar un chollo (solo admin)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const pool = await connect();
    const resultSelect = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Posts WHERE id = @id');
    if (resultSelect.recordset.length === 0) return res.status(404).json({ error: 'Chollo no encontrado' });
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Posts WHERE id = @id');
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al borrar el chollo' });
  }
});

module.exports = router;
