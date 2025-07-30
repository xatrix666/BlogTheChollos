const express = require('express');
const cors = require('cors');
const postsRoutes = require('./routes/postsRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/posts', postsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
