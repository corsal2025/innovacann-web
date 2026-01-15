// ================================
// INNOVACANN - Email Notifications
// Using EmailJS for email sending
// ================================

const EmailService = {
    // EmailJS configuration
    // User needs to set up at emailjs.com
    SERVICE_ID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key

    // Initialize EmailJS
    init: function () {
        if (typeof emailjs !== 'undefined' && this.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(this.PUBLIC_KEY);
            console.log('EmailJS initialized');
        }
    },

    // Send notification when new member registers
    sendNewMemberNotification: async function (memberData) {
        if (this.SERVICE_ID === 'YOUR_SERVICE_ID') {
            console.log('EmailJS not configured. Skipping email notification.');
            return;
        }

        try {
            await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, {
                to_email: 'admin@innovacann.cl',
                member_name: memberData.name,
                member_email: memberData.email,
                member_phone: memberData.phone,
                member_condition: memberData.medicalCondition || 'No especificada',
                date: new Date().toLocaleDateString('es-CL')
            });
            console.log('Email notification sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },

    // Send welcome email to new member
    sendWelcomeEmail: async function (memberData) {
        if (this.SERVICE_ID === 'YOUR_SERVICE_ID') {
            console.log('EmailJS not configured. Skipping welcome email.');
            return;
        }

        try {
            await emailjs.send(this.SERVICE_ID, 'welcome_template', {
                to_email: memberData.email,
                member_name: memberData.name,
                date: new Date().toLocaleDateString('es-CL')
            });
            console.log('Welcome email sent');
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    EmailService.init();
});

// Export for use in other scripts
window.EmailService = EmailService;
