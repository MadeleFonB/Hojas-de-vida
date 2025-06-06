const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// GET - obtener hojas de vida (filtrado opcional), accesible para cualquier usuario autenticado
router.get('/', async (req, res) => {
  try {
    const { perfil, habilidad } = req.query;

    let query = 'SELECT * FROM hojas_de_vida';
    let params = [];

    if (perfil && habilidad) {
      query += ' WHERE perfil_profesional ILIKE $1 AND $2 = ANY(habilidades)';
      params = [`%${perfil}%`, habilidad];
    } else if (perfil) {
      query += ' WHERE perfil_profesional ILIKE $1';
      params = [`%${perfil}%`];
    } else if (habilidad) {
      query += ' WHERE $1 = ANY(habilidades)';
      params = [habilidad];
    }

    const result = await db.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener hojas de vida' });
  }
});

// GET - obtener hoja de vida por id, accesible para cualquier usuario autenticado
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM hojas_de_vida WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener hoja de vida' });
  }
});

// POST - crear nueva hoja de vida, solo admin
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  const { nombre, correo, telefono, perfil_profesional, habilidades, experiencia, educacion } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO hojas_de_vida (nombre, correo, telefono, perfil_profesional, habilidades, experiencia, educacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nombre, correo, telefono, perfil_profesional, habilidades, experiencia, educacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear hoja de vida' });
  }
});

// PUT - actualizar hoja de vida por id, solo admin
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, perfil_profesional, habilidades, experiencia, educacion } = req.body;

  try {
    const result = await db.query(
      `UPDATE hojas_de_vida
       SET nombre = $1, correo = $2, telefono = $3, perfil_profesional = $4, habilidades = $5, experiencia = $6, educacion = $7
       WHERE id = $8
       RETURNING *`,
      [nombre, correo, telefono, perfil_profesional, habilidades, experiencia, educacion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar hoja de vida' });
  }
});

// DELETE - eliminar hoja de vida por id, solo admin
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM hojas_de_vida WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hoja de vida no encontrada' });
    }

    res.json({ message: 'Hoja de vida eliminada correctamente', hoja: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar hoja de vida' });
  }
});

module.exports = router;
