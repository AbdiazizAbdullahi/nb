import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Notice from '@/models/Notice';
import { verifyAuth } from '@/lib/auth/utils';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const notice = await Notice.findById(params.id);
    
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
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyAuth(token);

    if (!user?.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: { message: 'Unauthorized' }
      }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const notice = await Notice.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

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
    const token = request.headers.get('authorization')?.split(' ')[1];
    const user = await verifyAuth(token);

    if (!user?.isSuperAdmin) {
      return NextResponse.json({
        success: false,
        error: { message: 'Unauthorized' }
      }, { status: 403 });
    }

    await dbConnect();
    const notice = await Notice.findByIdAndDelete(params.id);

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
      error: { message: 'Failed to delete notice' }
    }, { status: 500 });
  }
}