import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import clientPromise from '../src/lib/db/mongodb.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = await clientPromise;
    const result = await client.db().command({ ping: 1 });
    console.log('Successfully connected to MongoDB:', result);
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

testConnection();