import { NextResponse } from 'next/server';
import { NoticeModel } from '@/models/Notice';
import { authenticateRequest } from '@/middleware/auth';

export async function GET(request) {
  try {
    const authError = await authenticateRequest(request);
    if (authError) return authError;

    const collection = await NoticeModel.getCollection();
    const currentDate = new Date();
    
    const notices = await collection
      .find({
        endingDate: { $lt: currentDate }
      })
      .sort({ endingDate: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: notices
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: 'ARCHIVE_FETCH_ERROR'
      }
    }, { status: 500 });
  }
}