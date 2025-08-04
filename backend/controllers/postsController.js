const { connect, sql } = require('../db');

// Listar todos los chollos
exports.getPosts = async (req, res) => {
  try {
    await connect();
    const result = await sql.query(`
      SELECT 
        p.*, 
        c.name AS category_name, 
        c.color AS category_color,
        c.icon AS category_icon
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
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
    const result = await sql.query`
      SELECT 
        p.*, 
        c.name AS category_name, 
        c.color AS category_color,
        c.icon AS category_icon
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${req.params.id}
    `;
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
  const { title, content, image, price, link, category_id } = req.body;
  try {
    console.log('POST createPost:', { title, content, image, price, link, category_id });
    await connect();
    await sql.query`
      INSERT INTO posts (title, content, image, price, link, category_id)
      VALUES (${title}, ${content}, ${image}, ${price || null}, ${link}, ${category_id || null})
    `;
    res.status(201).json({ message: 'Chollo creado' });
  } catch (err) {
    res.status(500).json({ error: 'Error creando post' });
  } finally {
    sql.close();
  }
};
