require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contentRoutes = require('./routes/content');
const paymentRoutes = require('./routes/payments');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Innovacann API running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ name: 'Innovacann API', version: '2.0.0', db: 'Supabase' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Innovacann API v2 (Supabase) corriendo en puerto ${PORT}`);
});

module.exports = app;
