const express = require('express');
const router = express.Router();
const supabase = require('../config/db');
const { protect, admin } = require('../middleware/auth');

// GET /api/content
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('content').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener contenido', error: error.message });
    }
});

// GET /api/content/:section
router.get('/:section', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('content')
            .select('*')
            .eq('section', req.params.section)
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener contenido', error: error.message });
    }
});

// PUT /api/content/:section (admin)
router.put('/:section', protect, admin, async (req, res) => {
    try {
        const { data: existing } = await supabase
            .from('content')
            .select('id')
            .eq('section', req.params.section)
            .single();

        let result;
        if (existing) {
            const { data, error } = await supabase
                .from('content')
                .update({ content: req.body.content, updated_at: new Date().toISOString(), updated_by: req.user.id })
                .eq('section', req.params.section)
                .select()
                .single();
            if (error) throw error;
            result = data;
        } else {
            const { data, error } = await supabase
                .from('content')
                .insert({ section: req.params.section, content: req.body.content, updated_by: req.user.id })
                .select()
                .single();
            if (error) throw error;
            result = data;
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar contenido', error: error.message });
    }
});

module.exports = router;
