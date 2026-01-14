const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, rut, medicalCondition } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Este email ya está registrado' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            rut,
            medicalCondition,
            role: 'visitante',
            membershipStatus: 'pendiente'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipStatus: user.membershipStatus,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipStatus: user.membershipStatus,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});

// @route   PUT /api/auth/users/:id/approve
// @desc    Approve user membership (admin only)
// @access  Private/Admin
router.put('/users/:id/approve', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.membershipStatus = 'aprobado';
        user.role = 'miembro';
        await user.save();

        res.json({ message: 'Membresía aprobada', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al aprobar usuario', error: error.message });
    }
});

// @route   PUT /api/auth/users/:id/reject
// @desc    Reject user membership (admin only)
// @access  Private/Admin
router.put('/users/:id/reject', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.membershipStatus = 'rechazado';
        await user.save();

        res.json({ message: 'Membresía rechazada', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al rechazar usuario', error: error.message });
    }
});

module.exports = router;
