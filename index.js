const express = require('express');
const cors = require('cors');
require('dotenv').config();

const hojasRoutes = require('./routes/hojas');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/hojas', hojasRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
