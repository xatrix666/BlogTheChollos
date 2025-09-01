// server/routes/posts.js

const express = require('express');
const router = express.Router();
const { connect, sql } = require('../db');


// // GET /api/posts - Obtener lista de posts con ratings
// router.get('/', async (req, res) => {
//   try {
//     const pool = await connect();

//     // Consulta que incorpora ratings promedio y total
//     const result = await pool.request().query(`
//       SELECT 
//         p.id,
//         p.title,
//         p.content,
//         p.image,
//         p.link,
//         p.price,
//         p.category_name,
//         p.category_color,
//         p.category_icon,
//         p.created_at,
//         ISNULL(r.avg_rating, 0) AS average_rating,
//         ISNULL(r.total_ratings, 0) AS total_ratings
//       FROM posts p
//       LEFT JOIN (
//         SELECT 
//           post_id,
//           AVG(CAST(rating AS FLOAT)) AS avg_rating,
//           COUNT(*) AS total_ratings
//         FROM ratings
//         GROUP BY post_id
//       ) r ON p.id = r.post_id
//       ORDER BY p.created_at DESC
//     `);

//     const posts = result.recordset.map(post => ({
//       ...post,
//       average_rating: parseFloat(post.average_rating.toFixed(1)),
//       total_ratings: post.total_ratings
//     }));

//     res.json(posts);
//   } catch (error) {
//     console.error('Error getting posts:', error);
//     res.status(500).json({ error: 'Error al obtener posts' });
//   }
// });


// POST /api/posts/:postId/ratings - Añadir/actualizar rating
router.post('/:postId/ratings', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const { rating } = req.body;
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // Validar rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating debe ser entre 1 y 5' });
    }

    const pool = await connect();
    
    // Verificar que el post existe
    const postCheck = await pool.request()
      .input('postId', sql.Int, postId)
      .query('SELECT id FROM posts WHERE id = @postId');
    if (postCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    // Eliminar rating anterior de esta IP para este post
    await pool.request()
      .input('postId', sql.Int, postId)
      .input('userIp', sql.NVarChar, userIp)
      .query('DELETE FROM ratings WHERE post_id = @postId AND user_ip = @userIp');

    // Insertar nuevo rating
    await pool.request()
      .input('postId', sql.Int, postId)
      .input('rating', sql.Int, rating)
      .input('userIp', sql.NVarChar, userIp)
      .query('INSERT INTO ratings (post_id, rating, user_ip) VALUES (@postId, @rating, @userIp)');

    res.json({ success: true, message: 'Rating guardado correctamente' });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ error: 'Error al guardar rating' });
  }
});


// GET /api/posts/:postId/ratings - Obtener estadísticas de ratings
router.get('/:postId/ratings', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const pool = await connect();
    
    const result = await pool.request()
      .input('postId', sql.Int, postId)
      .query(`
        SELECT 
          AVG(CAST(rating AS FLOAT)) as average_rating,
          COUNT(*) as total_ratings
        FROM ratings 
        WHERE post_id = @postId
      `);

    const stats = result.recordset[0];
    
    res.json({
      average: stats.average_rating ? parseFloat(stats.average_rating.toFixed(1)) : 0,
      total: parseInt(stats.total_ratings) || 0
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({ error: 'Error al obtener ratings' });
  }
});


// GET /api/posts/:postId/ratings/user - Verificar si el usuario ya votó
router.get('/:postId/ratings/user', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    const pool = await connect();
    const result = await pool.request()
      .input('postId', sql.Int, postId)
      .input('userIp', sql.NVarChar, userIp)
      .query('SELECT rating FROM ratings WHERE post_id = @postId AND user_ip = @userIp');

    if (result.recordset.length > 0) {
      res.json({ hasVoted: true, rating: result.recordset[0].rating });
    } else {
      res.json({ hasVoted: false, rating: null });
    }
  } catch (error) {
    console.error('Error checking user rating:', error);
    res.status(500).json({ error: 'Error al verificar voto' });
  }
});

module.exports = router;
