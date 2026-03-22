const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const { protect, admin } = require('../middleware/auth');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, rut, medicalCondition } = req.body;

        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            return res.status(400).json({ message: 'Este email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                phone: phone || null,
                rut: rut || null,
                medical_condition: medicalCondition || null,
                role: 'visitante',
                membership_status: 'pendiente',
                is_active: true
            })
            .select('id, name, email, role, membership_status')
            .single();

        if (error) throw error;

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            membershipStatus: user.membership_status,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, password, role, membership_status')
            .eq('email', email.toLowerCase())
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            membershipStatus: user.membership_status,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, phone, rut, role, membership_status, medical_condition, created_at')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;
        res.json({ ...user, membershipStatus: user.membership_status });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
});

// GET /api/auth/users (admin)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, phone, rut, role, membership_status, medical_condition, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(users.map(u => ({ ...u, membershipStatus: u.membership_status })));
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});

// PUT /api/auth/users/:id/approve (admin)
router.put('/users/:id/approve', protect, admin, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .update({ membership_status: 'aprobado', role: 'miembro' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Membresía aprobada', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar usuario', error: error.message });
    }
});

// PUT /api/auth/users/:id/reject (admin)
router.put('/users/:id/reject', protect, admin, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .update({ membership_status: 'rechazado' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Membresía rechazada', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al rechazar usuario', error: error.message });
    }
});

module.exports = router;
