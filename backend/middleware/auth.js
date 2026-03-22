const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const { data: user, error } = await supabase
                .from('users')
                .select('id, name, email, role, membership_status, is_active')
                .eq('id', decoded.id)
                .single();

            if (error || !user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    } else {
        return res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }
};

const member = (req, res, next) => {
    if (req.user && (req.user.role === 'miembro' || req.user.role === 'admin')) {
        if (req.user.membership_status === 'aprobado' || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Membresía pendiente de aprobación' });
        }
    } else {
        res.status(403).json({ message: 'Acceso solo para miembros' });
    }
};

module.exports = { protect, admin, member };
