const { execSync } = require('child_process');
const path = require('path');

module.exports = async () => {
    const root = path.resolve(__dirname, '../../');
    
    try {
        execSync('node prisma/clear.js --silent', { 
            cwd: root, 
            stdio: 'inherit',
            env: process.env 
        });
    } catch (err) {
        console.warn('⚠️  prisma/clear.js failed during teardown (continuing):', err.message);
    }

    try {
        execSync('node prisma/seed.js --silent', { 
            cwd: root, 
            stdio: 'inherit',
            env: process.env 
        });
    } catch (err) {
        console.warn('⚠️  prisma/seed.js failed during teardown (continuing):', err.message);
    }
};
