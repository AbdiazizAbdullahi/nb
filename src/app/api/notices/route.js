import { NextResponse } from 'next/server';
import { NoticeModel } from '@/models/Notice';
import { authenticateRequest } from '@/middleware/auth';

export async function GET(request) {
  try {
    // Authenticate the request (optional for GET)
    const authError = await authenticateRequest(request);
    // We allow unauthenticated users to view notices, so we don't return if authError

    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const collection = await NoticeModel.getCollection();
    const currentDate = new Date();
    
    // Find notices where endingDate is greater than or equal to current date
    const notices = await collection
      .find({
        endingDate: { $gte: currentDate }
      })
      .sort({ startingDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
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
        code: 'NOTICE_FETCH_ERROR'
      }
    }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    // Authenticate and check admin status
    const authError = await authenticateRequest(request);
    if (authError) return authError;

    // Only super admins can create notices
    if (!request.user.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Only super admins can create notices',
          code: 'NOT_AUTHORIZED'
        }
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Add the user ID from the authenticated request
    const noticeData = {
      ...body,
      userId: request.user.id
    };

    const result = await NoticeModel.create(noticeData);

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: 'NOTICE_CREATE_ERROR'
      }
    }, { status: 400 });
  }
}