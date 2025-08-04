const express = require('express');
const router = express.Router({ mergeParams: true });
const { connect, sql } = require('../db');

router.get('/', async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request()
      .input('postId', sql.Int, req.params.postId)
      .query('SELECT * FROM comments WHERE post_id = @postId ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo comentarios' });
  } finally {
    sql.close();
  }
});

router.post('/', async (req, res) => {
  const { author_name, author_email, content } = req.body;
  try {
    const pool = await connect();
    await pool.request()
      .input('postId', sql.Int, req.params.postId)
      .input('author_name', sql.NVarChar, author_name)
      .input('author_email', sql.NVarChar, author_email || null)
      .input('content', sql.NVarChar, content)
      .input('created_at', sql.DateTime, new Date())
      .query('INSERT INTO comments (post_id, author_name, author_email, content, created_at) VALUES (@postId, @author_name, @author_email, @content, @created_at)');
    res.status(201).json({ message: 'Comentario creado' });
  } catch (err) {
    res.status(500).json({ error: 'Error creando comentario' });
  } finally {
    sql.close();
  }
});

module.exports = router;
