const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['flores', 'aceites', 'topicos', 'capsulas', 'otros']
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    thcContent: {
        type: String
    },
    cbdContent: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    membersOnly: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
