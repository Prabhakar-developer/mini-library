export const config = {
    COMMON: {
        PORT: process.env.PORT || 3000,
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/minilibrary',
        PENALTY_RATE: parseInt(process.env.PENALTY_RATE as string) || 1,
    },
    JWT: {
        SECRET: process.env.JWT_SECRET || 'mini_library',
        EXPIRY: process.env.JWT_EXPIRY || '1d',
    },
    SMTP: {
        SMTP_HOST: process.env.SMTP_HOST || 'smtp.ethereal.email',
        SMTP_PORT: process.env.SMTP_PORT || 587,
        SMTP_SECURE: process.env.SMTP_SECURE || false,
        SMTP_USER: process.env.SMTP_USER || 'golda.hyatt41@ethereal.email',
        SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'zj4x9xWcx6QB3bzYcy',
        SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'prabhakar.sr@happiestminds.com',
    }

};
