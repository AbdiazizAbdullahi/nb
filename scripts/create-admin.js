import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { UserModel } from '../src/models/User.js';
import { hashPassword } from '../src/lib/auth/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function createAdmin() {
  try {
    console.log('Creating admin account...');
    
    // Admin user data
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: await hashPassword('admin123'),
      isSuperAdmin: true
    };

    const admin = await UserModel.create(adminData);
    console.log('✓ Admin user created successfully:', {
      id: admin._id,
      email: admin.email,
      isSuperAdmin: admin.isSuperAdmin
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();