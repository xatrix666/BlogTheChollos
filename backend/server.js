const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/postsRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/posts/:postId/comments', commentsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/posts', postsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
