const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin, member } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products (members only see active, admin sees all)
// @access  Private/Member
router.get('/', protect, member, async (req, res) => {
    try {
        let query = {};

        // Non-admins only see active products
        if (req.user.role !== 'admin') {
            query.isActive = true;
            query.membersOnly = true;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// @route   GET /api/products/public
// @desc    Get public product preview (limited info)
// @access  Public
router.get('/public', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .select('name category shortDescription image')
            .limit(4);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private/Member
router.get('/:id', protect, member, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});

module.exports = router;
