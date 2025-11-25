const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();
const silent = process.argv.includes('--silent');

async function clearDatabase() {
    try {
        if (!silent) console.log('🗑️  Clearing database...');

        // Delete in correct order due to foreign key constraints
        await prisma.task.deleteMany({});
        if (!silent) console.log('✅ Deleted all tasks');

        await prisma.session.deleteMany({});
        if (!silent) console.log('✅ Deleted all sessions');

        await prisma.user.deleteMany({});
        if (!silent) console.log('✅ Deleted all users');

        if (!silent) console.log('🎉 Database cleared successfully!');
    } catch (error) {
        if (!silent) console.error('❌ Error clearing database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();
