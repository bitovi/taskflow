const { PrismaClient } = require('../app/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const silent = process.argv.includes('--silent');

const users = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
    { name: 'Diana Prince', email: 'diana@example.com' },
    { name: 'Ethan Hunt', email: 'ethan@example.com' },
    { name: 'Fiona Green', email: 'fiona@example.com' },
    { name: 'George Wilson', email: 'george@example.com' },
];

const taskTemplates = [
    { name: 'Design user interface mockups', description: 'Create wireframes and mockups for the new dashboard interface', priority: 'high' },
    { name: 'Implement authentication system', description: 'Build secure login and registration functionality', priority: 'high' },
    { name: 'Write unit tests for API endpoints', description: 'Ensure all API endpoints have comprehensive test coverage', priority: 'medium' },
    { name: 'Optimize database queries', description: 'Review and optimize slow database queries for better performance', priority: 'medium' },
    { name: 'Update documentation', description: 'Update API documentation with latest changes and examples', priority: 'low' },
    { name: 'Fix mobile responsive issues', description: 'Address layout problems on mobile devices', priority: 'high' },
    { name: 'Implement dark mode theme', description: 'Add dark mode support throughout the application', priority: 'medium' },
    { name: 'Set up CI/CD pipeline', description: 'Configure automated testing and deployment pipeline', priority: 'high' },
    { name: 'Create user onboarding flow', description: 'Design and implement guided tour for new users', priority: 'medium' },
    { name: 'Add search functionality', description: 'Implement global search across tasks and projects', priority: 'medium' },
    { name: 'Refactor legacy code', description: 'Clean up and modernize outdated code sections', priority: 'low' },
    { name: 'Implement real-time notifications', description: 'Add push notifications for task updates and mentions', priority: 'medium' },
    { name: 'Create data export feature', description: 'Allow users to export their data in various formats', priority: 'low' },
    { name: 'Add file upload capability', description: 'Enable users to attach files to tasks and comments', priority: 'medium' },
    { name: 'Implement team collaboration tools', description: 'Add features for team communication and collaboration', priority: 'high' },
    { name: 'Set up monitoring and logging', description: 'Implement comprehensive application monitoring', priority: 'high' },
    { name: 'Create admin dashboard', description: 'Build administrative interface for user and system management', priority: 'medium' },
    { name: 'Add calendar integration', description: 'Sync tasks with popular calendar applications', priority: 'low' },
    { name: 'Implement advanced filtering', description: 'Add complex filtering options for task management', priority: 'medium' },
    { name: 'Create mobile app', description: 'Develop native mobile application for iOS and Android', priority: 'high' },
    { name: 'Add analytics dashboard', description: 'Create comprehensive analytics and reporting features', priority: 'medium' },
    { name: 'Implement API rate limiting', description: 'Add rate limiting to prevent API abuse', priority: 'medium' },
    { name: 'Create backup and restore system', description: 'Implement automated backup and recovery procedures', priority: 'high' },
    { name: 'Add multi-language support', description: 'Internationalize the application for multiple languages', priority: 'low' },
    { name: 'Implement advanced permissions', description: 'Create granular permission system for different user roles', priority: 'medium' },
    { name: 'Add time tracking features', description: 'Allow users to track time spent on tasks', priority: 'medium' },
    { name: 'Create integration with third-party tools', description: 'Build integrations with popular productivity tools', priority: 'low' },
    { name: 'Implement advanced project templates', description: 'Create customizable project templates for different use cases', priority: 'low' },
    { name: 'Add video conferencing integration', description: 'Integrate with video conferencing platforms for team meetings', priority: 'medium' },
    { name: 'Create automated workflow system', description: 'Build automation rules for task assignments and updates', priority: 'high' },
];

const statuses = ['todo', 'in_progress', 'done', 'review'];
const priorities = ['low', 'medium', 'high'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
    try {
        if (!silent) console.log('🌱 Seeding database...');

        // Create users with hashed passwords
        const createdUsers = [];
        for (const userData of users) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = await prisma.user.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                },
            });
            createdUsers.push(user);
        }
        if (!silent) console.log(`✅ Created ${createdUsers.length} users`);

        // Create tasks with random assignments
        const createdTasks = [];
        for (let i = 0; i < 30; i++) {
            const template = taskTemplates[i];
            const creator = getRandomElement(createdUsers);
            const assignee = Math.random() > 0.2 ? getRandomElement(createdUsers) : null; // 80% chance of being assigned

            // Generate random due date (some tasks won't have due dates)
            const hasDueDate = Math.random() > 0.3; // 70% chance of having a due date
            const dueDate = hasDueDate
                ? getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // Within next 30 days
                : null;

            const task = await prisma.task.create({
                data: {
                    name: template.name,
                    description: template.description,
                    priority: template.priority || getRandomElement(priorities),
                    status: getRandomElement(statuses),
                    dueDate,
                    creatorId: creator.id,
                    assigneeId: assignee?.id || null,
                },
            });
            createdTasks.push(task);
        }
        if (!silent) console.log(`✅ Created ${createdTasks.length} tasks`);

        // Create some sessions for users (simulate some being logged in)
        const activeSessions = [];
        for (let i = 0; i < 3; i++) {
            const user = getRandomElement(createdUsers);
            const session = await prisma.session.create({
                data: {
                    token: `session_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: user.id,
                },
            });
            activeSessions.push(session);
        }
        if (!silent) console.log(`✅ Created ${activeSessions.length} active sessions`);

        // Display summary
        if (!silent) {
            console.log('\n📊 Database seeded with:');
            console.log(`   👥 ${createdUsers.length} users`);
            console.log(`   📋 ${createdTasks.length} tasks`);
            console.log(`   🔑 ${activeSessions.length} active sessions`);

            // Show task distribution by status
            const tasksByStatus = {};
            createdTasks.forEach(task => {
                tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
            });
            console.log('\n📈 Task distribution:');
            Object.entries(tasksByStatus).forEach(([status, count]) => {
                console.log(`   ${status}: ${count} tasks`);
            });

            console.log('\n🎉 Database seeded successfully!');
            console.log('💡 Default password for all users: password123');
        }

    } catch (error) {
        if (!silent) console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = {
    getRandomElement,
    getRandomDate,
    seedDatabase,
}

if (require.main === module) {
    seedDatabase();
}
