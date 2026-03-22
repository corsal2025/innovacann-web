const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Initialize MercadoPago with Access Token
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

// POST /api/payments/create-preference
// Creates a MercadoPago payment preference and returns checkout URL
router.post('/create-preference', async (req, res) => {
    try {
        const { items, payer } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'El carrito está vacío' });
        }

        const preference = new Preference(client);

        const preferenceData = {
            items: items.map(item => ({
                id: String(item.id),
                title: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                currency_id: 'CLP'
            })),
            payer: payer || {},
            back_urls: {
                success: `${process.env.FRONTEND_URL}/tienda/success.html`,
                failure: `${process.env.FRONTEND_URL}/tienda/failure.html`,
                pending: `${process.env.FRONTEND_URL}/tienda/pending.html`
            },
            auto_return: 'approved',
            statement_descriptor: 'INNOVACANN',
            external_reference: `ORDER-${Date.now()}`
        };

        const result = await preference.create({ body: preferenceData });

        res.json({
            id: result.id,
            init_point: result.init_point
        });
    } catch (error) {
        console.error('Error creating MP preference:', error);
        res.status(500).json({ message: 'Error al crear preferencia de pago' });
    }
});

// POST /api/payments/webhook
// Receives MercadoPago payment notifications
router.post('/webhook', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'payment') {
        console.log('Payment notification received:', data.id);
        // Here you can update order status in DB in the future
    }

    res.sendStatus(200);
});

module.exports = router;
