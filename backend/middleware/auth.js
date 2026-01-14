const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// Admin only middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }
};

// Member only middleware
const member = (req, res, next) => {
    if (req.user && (req.user.role === 'miembro' || req.user.role === 'admin')) {
        if (req.user.membershipStatus === 'aprobado' || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Membresía pendiente de aprobación' });
        }
    } else {
        res.status(403).json({ message: 'Acceso solo para miembros' });
    }
};

module.exports = { protect, admin, member };
