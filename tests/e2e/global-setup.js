const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
    const root = path.resolve(__dirname, '../../');
    
    // Ensure DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
        console.error('❌ ERROR: DATABASE_URL environment variable is not set');
        console.error('💡 E2E tests require a database connection');
        throw new Error('DATABASE_URL is required for E2E tests');
    }
    
    try {
        execSync('node prisma/clear.js --silent', { 
            cwd: root, 
            stdio: 'inherit',
            env: process.env 
        });
    } catch (err) {
        console.error('❌ Failed to clear database:', err.message);
        throw err;
    }

    try {
        execSync('node prisma/seed.js --silent', { 
            cwd: root, 
            stdio: 'inherit',
            env: process.env 
        });
    } catch (err) {
        console.error('❌ Failed to seed database:', err.message);
        throw err;
    }
};
