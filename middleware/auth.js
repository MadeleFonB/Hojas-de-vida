const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

// Valida que el token sea válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Valida que el usuario tenga rol admin
function authorizeAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, se requiere rol admin' });
  }
  next();
}

module.exports = { authenticateToken, authorizeAdmin };
