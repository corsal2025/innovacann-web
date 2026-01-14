const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/content
// @desc    Get all content sections
// @access  Public
router.get('/', async (req, res) => {
    try {
        const content = await Content.find({});
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener contenido', error: error.message });
    }
});

// @route   GET /api/content/:section
// @desc    Get specific section content
// @access  Public
router.get('/:section', async (req, res) => {
    try {
        const content = await Content.findOne({ section: req.params.section });
        if (!content) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener contenido', error: error.message });
    }
});

// @route   PUT /api/content/:section
// @desc    Update section content
// @access  Private/Admin
router.put('/:section', protect, admin, async (req, res) => {
    try {
        let content = await Content.findOne({ section: req.params.section });

        if (content) {
            content.content = req.body.content;
            content.updatedBy = req.user._id;
            await content.save();
        } else {
            content = await Content.create({
                section: req.params.section,
                content: req.body.content,
                updatedBy: req.user._id
            });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar contenido', error: error.message });
    }
});

// @route   POST /api/content/init
// @desc    Initialize default content
// @access  Private/Admin
router.post('/init', protect, admin, async (req, res) => {
    try {
        const defaultContent = [
            {
                section: 'hero',
                content: {
                    badge: '🇨🇱 Corporación Chilena',
                    title: 'Innovación que Transforma Vidas',
                    subtitle: 'Liderando la ciencia del cannabis medicinal en Chile con estándares de calidad premium y un compromiso con tu bienestar.',
                    stats: [
                        { number: '5000+', label: 'Miembros Activos' },
                        { number: '100%', label: 'Legal y Regulado' },
                        { number: '24/7', label: 'Soporte Médico' }
                    ]
                }
            },
            {
                section: 'about',
                content: {
                    tag: 'Nuestra Historia',
                    title: '¿Quiénes Somos?',
                    text: 'Innovacann nace de la convicción de que el cannabis medicinal, utilizado de manera responsable y bajo supervisión profesional, tiene el poder de mejorar la calidad de vida de miles de chilenos.',
                    features: ['100% Legal', 'Respaldo Médico', 'Calidad Premium']
                }
            },
            {
                section: 'contact',
                content: {
                    email: 'contacto@innovacann.cl',
                    phone: '+56 2 2345 6789',
                    address: 'Santiago, Chile',
                    hours: {
                        weekdays: '9:00 - 18:00',
                        saturday: '10:00 - 14:00',
                        sunday: 'Cerrado'
                    }
                }
            }
        ];

        for (const item of defaultContent) {
            await Content.findOneAndUpdate(
                { section: item.section },
                item,
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Contenido inicializado', count: defaultContent.length });
    } catch (error) {
        res.status(500).json({ message: 'Error al inicializar contenido', error: error.message });
    }
});

module.exports = router;
