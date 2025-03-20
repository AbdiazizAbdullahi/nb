import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { hashPassword } from '@/lib/auth/utils';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Hash the password before creating user
    const hashedPassword = await hashPassword(body.password);
    
    // Create user with hashed password
    const result = await UserModel.create({
      ...body,
      password: hashedPassword
    });

    // Don't send password back in response
    const { password, ...userWithoutPassword } = result;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        code: 'REGISTRATION_FAILED'
      }
    }, { status: 400 });
  }
}