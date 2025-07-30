const { connect, sql } = require('../db');

// Listar todos los chollos
exports.getPosts = async (req, res) => {
  try {
    await connect();
    const result = await sql.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo posts' });
  } finally {
    sql.close();
  }
};

// Obtener detalle por id
exports.getPostById = async (req, res) => {
  try {
    await connect();
    const result = await sql.query`SELECT * FROM posts WHERE id = ${req.params.id}`;
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Post no encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo detalle' });
  } finally {
    sql.close();
  }
};

// Crear nuevo chollo/post
exports.createPost = async (req, res) => {
  const { title, content, image, price, link } = req.body;
  try {
    await connect();
    await sql.query`
      INSERT INTO posts (title, content, image, price, link)
      VALUES (${title}, ${content}, ${image}, ${price || null}, ${link})
    `;
    res.status(201).json({ message: 'Chollo creado' });
  } catch (err) {
    res.status(500).json({ error: 'Error creando post' });
  } finally {
    sql.close();
  }
};
