import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { NoticeModel } from '@/models/Notice';
import { verifyAuth } from '@/lib/auth/utils';

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const client = await clientPromise;
    const notice = await NoticeModel.findById(id);
    
    if (!notice) {
      return NextResponse.json({
        success: false,
        error: { message: 'Notice not found' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: notice
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to fetch notice' }
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = await params.id;
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyAuth(token);

    if (!user?.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: { message: 'Unauthorized' }
      }, { status: 403 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const notice = await NoticeModel.update(id, body);

    if (!notice) {
      return NextResponse.json({
        success: false,
        error: { message: 'Notice not found' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: notice
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to update notice' }
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = await params.id;  // Await the dynamic parameter
    
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({
        success: false,
        error: { message: 'No token provided' }
      }, { status: 401 });
    }

    const user = await verifyAuth(token);
    if (!user?.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: { message: 'Unauthorized' }
      }, { status: 403 });
    }

    const client = await clientPromise;
    const result = await NoticeModel.delete(id);
    
    if (!result.deletedCount) {
      return NextResponse.json({
        success: false,
        error: { message: 'Notice not found' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { id }  // Use the awaited id
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to delete notice' }
    }, { status: 500 });
  }
}