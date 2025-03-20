import { NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth/utils';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'AUTH_INVALID_CREDENTIALS'
        }
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Invalid email or password',
          code: 'AUTH_INVALID_CREDENTIALS'
        }
      }, { status: 401 });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Login failed',
        code: 'AUTH_LOGIN_FAILED'
      }
    }, { status: 400 });
  }
}