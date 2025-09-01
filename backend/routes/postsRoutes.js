// routes/postsRoutes.js

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

// GET: obtener todos los posts ordenados por fecha descendente con categoría y ratings
router.get('/', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT 
        p.*,
        c.name   AS category_name,
        c.color  AS category_color,
        c.icon   AS category_icon,
        ISNULL(r.avg_rating, 0)     AS average_rating,
        ISNULL(r.total_ratings, 0)   AS total_ratings
      FROM Posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN (
        SELECT 
          post_id,
          AVG(CAST(rating AS FLOAT)) AS avg_rating,
          COUNT(*)                 AS total_ratings
        FROM ratings
        GROUP BY post_id
      ) r ON p.id = r.post_id
      ORDER BY p.created_at DESC
    `);

    const posts = result.recordset.map(post => ({
      ...post,
      average_rating: parseFloat(post.average_rating.toFixed(1)),
      total_ratings: post.total_ratings
    }));

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener chollos' });
  }
});

// GET: obtener un post por id con categoría (detalle)
router.get('/:id', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          p.*,
          c.name  AS category_name,
          c.color AS category_color,
          c.icon  AS category_icon
        FROM Posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Chollo no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener chollo' });
  }
});

// POST: crear un nuevo chollo (solo admin)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, content, image, price, link, category_id } = req.body;
    const pool = await connect();
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content || null)
      .input('image', sql.NVarChar, image || null)
      .input('price', sql.NVarChar, price || null)
      .input('link', sql.NVarChar, link || null)
      .input('category_id', sql.Int, category_id || null)
      .input('created_at', sql.DateTime, new Date())
      .query(`
        INSERT INTO Posts (title, content, image, price, link, category_id, created_at) 
        OUTPUT INSERTED.* 
        VALUES (@title, @content, @image, @price, @link, @category_id, @created_at)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al crear el chollo' });
  }
});

// PUT: editar un chollo (solo admin)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { title, content, image, price, link, category_id } = req.body;
    const pool = await connect();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content || null)
      .input('image', sql.NVarChar, image || null)
      .input('price', sql.NVarChar, price || null)
      .input('link', sql.NVarChar, link || null)
      .input('category_id', sql.Int, category_id || null)
      .query(`
        UPDATE Posts SET 
          title       = @title, 
          content     = @content, 
          image       = @image, 
          price       = @price, 
          link        = @link, 
          category_id = @category_id
        WHERE id = @id;
        SELECT * FROM Posts WHERE id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Chollo no encontrado' });
    }
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
    if (resultSelect.recordset.length === 0) {
      return res.status(404).json({ error: 'Chollo no encontrado' });
    }
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
