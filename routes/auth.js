const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO usuarios (nombre, correo, password, rol)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol`,
      [nombre, correo, hashedPassword, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login usuario
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
});

module.exports = router;
