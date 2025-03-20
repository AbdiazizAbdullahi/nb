import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { UserModel } from '../src/models/User.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../src/lib/auth/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function testAuth() {
  try {
    console.log('Testing authentication system...\n');

    // Test user data
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'testpass123'
    };

    console.log('1. Testing password hashing...');
    const hashedPassword = await hashPassword(testUser.password);
    console.log('✓ Password hashed successfully');

    console.log('\n2. Testing password comparison...');
    const isPasswordValid = await comparePassword(testUser.password, hashedPassword);
    console.log('✓ Password comparison working:', isPasswordValid);

    console.log('\n3. Testing user creation...');
    const user = await UserModel.create({
      ...testUser,
      password: hashedPassword
    });
    console.log('✓ User created successfully:', user._id);

    console.log('\n4. Testing JWT token generation...');
    const token = generateToken(user);
    console.log('✓ Token generated successfully');

    console.log('\n5. Testing JWT token verification...');
    const decoded = verifyToken(token);
    console.log('✓ Token verified successfully:', decoded);

    console.log('\n6. Testing user retrieval...');
    const foundUser = await UserModel.findByEmail(testUser.email);
    console.log('✓ User retrieved successfully:', foundUser._id);

    console.log('\n✅ All authentication tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testAuth();