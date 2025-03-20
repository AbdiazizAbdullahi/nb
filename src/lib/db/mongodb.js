import { MongoClient } from 'mongodb';
import { config } from '../../config/env.js';

if (!config.mongodb.uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const options = {
  family: 4, // Force IPv4
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  directConnection: false,
  retryWrites: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(config.mongodb.uri, options);
    global._mongoClientPromise = client.connect()
      .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(config.mongodb.uri, options);
  clientPromise = client.connect()
    .catch(error => {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    });
}

// Handle connection errors globally
clientPromise.catch(error => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

export default clientPromise;