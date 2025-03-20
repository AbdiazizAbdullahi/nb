import { ObjectId } from 'mongodb';
import clientPromise from '../lib/db/mongodb.js';

export class UserModel {
  static async getCollection() {
    const client = await clientPromise;
    return client.db().collection('users');
  }

  static validateUser(user) {
    const errors = [];
    
    if (!user.firstName || typeof user.firstName !== 'string' || user.firstName.length < 1) {
      errors.push('First name is required');
    }
    
    if (!user.lastName || typeof user.lastName !== 'string' || user.lastName.length < 1) {
      errors.push('Last name is required');
    }
    
    if (!user.email || typeof user.email !== 'string' || !user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Valid email is required');
    }
    
    if (!user.password || typeof user.password !== 'string' || user.password.length < 4) {
      errors.push('Password must be at least 4 characters long');
    }

    return errors;
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    return collection.findOne({ email });
  }

  static async create(userData) {
    const collection = await this.getCollection();
    const errors = this.validateUser(userData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const result = await collection.insertOne({
      ...userData,
      _id: new ObjectId(),
      isSuperAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { ...userData, _id: result.insertedId };
  }
}