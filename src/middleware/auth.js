import { verifyToken } from '../lib/auth/utils.js';
import { NextResponse } from 'next/server';

/**
 * Middleware to authenticate requests
 * @param {Request} request - The incoming request
 */
export async function authenticateRequest(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ success: false, error: { message: 'No token provided', code: 'AUTH_NO_TOKEN' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Add the user info to the request for use in route handlers
    request.user = decoded;
    
    return null; // Authentication successful
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, error: { message: 'Invalid token', code: 'AUTH_INVALID_TOKEN' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Middleware to ensure user is a super admin
 * @param {Request} request - The incoming request
 */
export async function requireSuperAdmin(request) {
  const authResult = await authenticateRequest(request);
  if (authResult) return authResult;

  if (!request.user.isSuperAdmin) {
    return new NextResponse(
      JSON.stringify({ success: false, error: { message: 'Admin access required', code: 'AUTH_NOT_ADMIN' } }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return null; // Authorization successful
}