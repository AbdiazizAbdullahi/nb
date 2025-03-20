import { ObjectId } from 'mongodb';
import clientPromise from '../lib/db/mongodb.js';

export class NoticeModel {
  static async getCollection() {
    const client = await clientPromise;
    return client.db().collection('notices');
  }

  static validateNotice(notice) {
    const errors = [];
    
    if (!notice.title || typeof notice.title !== 'string' || notice.title.length < 5 || notice.title.length > 100) {
      errors.push('Title must be between 5 and 100 characters');
    }
    
    if (!notice.description || typeof notice.description !== 'string' || notice.description.length < 10 || notice.description.length > 1000) {
      errors.push('Description must be between 10 and 1000 characters');
    }

    if (!notice.location || typeof notice.location !== 'string' || notice.location.length < 3 || notice.location.length > 100) {
      errors.push('Location must be between 3 and 100 characters');
    }
    
    if (!notice.startingDate || !(notice.startingDate instanceof Date)) {
      errors.push('Valid starting date is required');
    }
    
    if (!notice.endingDate || !(notice.endingDate instanceof Date)) {
      errors.push('Valid ending date is required');
    }

    if (notice.startingDate && notice.endingDate && notice.startingDate >= notice.endingDate) {
      errors.push('Ending date must be after starting date');
    }

    if (!notice.userId) {
      errors.push('User ID is required');
    }

    return errors;
  }

  static async create(noticeData) {
    const collection = await this.getCollection();
    const errors = this.validateNotice({
      ...noticeData,
      startingDate: new Date(noticeData.startingDate),
      endingDate: new Date(noticeData.endingDate)
    });
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const result = await collection.insertOne({
      ...noticeData,
      _id: new ObjectId(),
      startingDate: new Date(noticeData.startingDate),
      endingDate: new Date(noticeData.endingDate),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { ...noticeData, _id: result.insertedId };
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  static async list(page = 1, limit = 10) {
    const collection = await this.getCollection();
    const skip = (page - 1) * limit;
    
    return collection
      .find({})
      .sort({ startingDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  static async update(id, updateData) {
    const collection = await this.getCollection();
    const notice = await this.findById(id);
    
    if (!notice) {
      throw new Error('Notice not found');
    }

    const errors = this.validateNotice({
      ...notice,
      ...updateData,
      startingDate: new Date(updateData.startingDate || notice.startingDate),
      endingDate: new Date(updateData.endingDate || notice.endingDate)
    });

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return result;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default NoticeModel;