import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { NoticeModel } from '../src/models/Notice.js';
import { UserModel } from '../src/models/User.js';
import clientPromise from '../src/lib/db/mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function seedNotices() {
  let client;
  try {
    console.log('Connecting to database...');
    client = await clientPromise;
    console.log('✓ Database connected');

    // First get or create an admin user to be the creator of notices
    console.log('\nEnsuring admin user exists...');
    const adminEmail = 'admin@noticeboard.com';
    let admin = await UserModel.findByEmail(adminEmail);
    
    if (!admin) {
      admin = await UserModel.create({
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail,
        password: 'admin123', // This will be hashed by the model
        isSuperAdmin: true
      });
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Using existing admin user');
    }

    // Sample notices data
    const notices = [
      {
        title: "End of Semester Examination Schedule",
        description: "Final examinations for all courses will be held from May 15-30. Please check your student portal for specific times and locations.",
        location: "Main Campus",
        startingDate: new Date('2025-05-01'),
        endingDate: new Date('2025-05-30'),
        userId: admin._id
      },
      {
        title: "Student Council Elections",
        description: "Nominations are now open for Student Council positions. Submit your candidacy by April 20th.",
        location: "Student Center",
        startingDate: new Date('2025-04-10'),
        endingDate: new Date('2025-04-20'),
        userId: admin._id
      },
      {
        title: "Campus Career Fair",
        description: "Annual career fair featuring top employers. Bring your resume and dress professionally.",
        location: "University Hall",
        startingDate: new Date('2025-04-15'),
        endingDate: new Date('2025-04-16'),
        userId: admin._id
      },
      {
        title: "Library Extended Hours",
        description: "The library will remain open 24/7 during the final examination period to support student studying.",
        location: "Main Library",
        startingDate: new Date('2025-05-01'),
        endingDate: new Date('2025-05-30'),
        userId: admin._id
      },
      {
        title: "Summer Session Registration",
        description: "Registration for summer courses begins April 25th. Early registration is recommended as classes fill quickly.",
        location: "Online Portal",
        startingDate: new Date('2025-04-25'),
        endingDate: new Date('2025-05-15'),
        userId: admin._id
      }
    ];

    // Create notices
    console.log('\nCreating notices...');
    for (const noticeData of notices) {
      const notice = await NoticeModel.create(noticeData);
      console.log(`✓ Created notice: ${notice.title}`);
    }

    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
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