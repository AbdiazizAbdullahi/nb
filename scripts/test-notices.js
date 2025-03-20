import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { NoticeModel } from '../src/models/Notice.js';
import { UserModel } from '../src/models/User.js';
import { hashPassword, generateToken } from '../src/lib/auth/utils.js';
import clientPromise from '../src/lib/db/mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function testNotices() {
  let client;
  try {
    console.log('Testing notice management system...\n');

    // Ensure database connection
    console.log('Connecting to database...');
    client = await clientPromise;
    console.log('✓ Database connected');

    // Create a test admin user
    console.log('\n1. Creating test admin user...');
    const adminData = {
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@test.com',
      password: await hashPassword('admin123'),
      isSuperAdmin: true
    };
    const admin = await UserModel.create(adminData);
    const adminToken = generateToken(admin);
    console.log('✓ Admin user created successfully');

    // Test notice creation
    console.log('\n2. Testing notice creation...');
    const noticeData = {
      title: 'Test Notice',
      description: 'This is a test notice',
      startingDate: new Date(),
      endingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: admin._id
    };
    const notice = await NoticeModel.create(noticeData);
    console.log('✓ Notice created successfully:', notice._id);

    // Test notice retrieval
    console.log('\n3. Testing notice retrieval...');
    const foundNotice = await NoticeModel.findById(notice._id);
    console.log('✓ Notice retrieved successfully:', foundNotice._id);

    // Test notice update
    console.log('\n4. Testing notice update...');
    const updateData = {
      title: 'Updated Test Notice',
      description: 'This notice has been updated'
    };
    await NoticeModel.update(notice._id, updateData);
    console.log('✓ Notice updated successfully');

    // Test notice listing with pagination
    console.log('\n5. Testing notice listing...');
    const notices = await NoticeModel.list(1, 10);
    console.log('✓ Notices listed successfully. Count:', notices.length);

    // Test notice deletion
    console.log('\n6. Testing notice deletion...');
    await NoticeModel.delete(notice._id);
    console.log('✓ Notice deleted successfully');

    // Cleanup: Remove test admin
    console.log('\n7. Cleaning up test data...');
    await UserModel.getCollection().then(collection => 
      collection.deleteOne({ _id: admin._id })
    );
    console.log('✓ Test data cleaned up');

    console.log('\n✅ All notice management tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    // Ensure we close the connection
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

testNotices();