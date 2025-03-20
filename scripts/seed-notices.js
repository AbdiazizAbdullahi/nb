import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { NoticeModel } from '../src/models/Notice.js';
import { UserModel } from '../src/models/User.js';
import clientPromise from '../src/lib/db/mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const notices = [
  {
    title: 'Welcome to the Notice Board',
    description: 'This is our first notice welcoming everyone to our brand new notice board system. Here you\'ll find important announcements and updates.',
    startingDate: new Date(),
    endingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  {
    title: 'System Maintenance Schedule',
    description: 'We will be performing routine system maintenance next weekend. The system may experience brief interruptions during this period.',
    startingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endingDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
  },
  {
    title: 'New Feature Announcement',
    description: 'We\'re excited to announce that we\'ll be rolling out new features next month, including enhanced notification options and mobile support.',
    startingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    endingDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000), // 44 days from now
  },
  {
    title: 'Holiday Schedule',
    description: 'Please note the upcoming holiday schedule. The office will be closed during public holidays. Make sure to plan your work accordingly.',
    startingDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    endingDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
  },
  {
    title: 'Community Event',
    description: 'Join us for our monthly community event where we\'ll discuss upcoming projects and gather feedback from all participants.',
    startingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endingDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
  }
];

async function seedNotices() {
  let client;
  try {
    console.log('Starting notice seeding process...\n');

    // Connect to database
    console.log('Connecting to database...');
    client = await clientPromise;
    console.log('✓ Database connected');

    // Get admin user (or create one if doesn't exist)
    console.log('\nFinding or creating admin user...');
    const usersCollection = await UserModel.getCollection();
    const adminUser = await usersCollection.findOne({ 
      email: { $regex: new RegExp('^admin@test\\.com$', 'i') },
      isSuperAdmin: true 
    });
    if (!adminUser) {
      throw new Error('No admin user found. Please run create-admin script first.');
    }
    console.log('✓ Admin user found');

    // Delete existing notices
    console.log('\nCleaning existing notices...');
    const noticesCollection = await NoticeModel.getCollection();
    await noticesCollection.deleteMany({});
    console.log('✓ Existing notices cleared');

    // Create notices
    console.log('\nCreating new notices...');
    for (const notice of notices) {
      const result = await NoticeModel.create({
        ...notice,
        userId: adminUser._id
      });
      console.log(`✓ Created notice: ${result.title}`);
    }

    console.log('\n✅ Notice seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\nDatabase connection closed');
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

seedNotices();