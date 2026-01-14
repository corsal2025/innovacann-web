require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createAdmin = async () => {
    try {
        await connectDB();

        // Check if admin exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('⚠️  Admin already exists:', adminExists.email);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Administrador',
            email: process.env.ADMIN_EMAIL || 'admin@innovacann.cl',
            password: process.env.ADMIN_PASSWORD || 'admin123456',
            role: 'admin',
            membershipStatus: 'aprobado',
            isActive: true
        });

        console.log('✅ Admin created successfully!');
        console.log('   Email:', admin.email);
        console.log('   Role:', admin.role);
        console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
