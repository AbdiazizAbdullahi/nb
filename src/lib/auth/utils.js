import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compare a password with its hash
 * @param {string} password - The plain text password to check
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} Whether the password matches
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object to generate a token for
 * @returns {string} The generated JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin
    },
    config.jwt.secret,
    { expiresIn: '24h' }
  );
}

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object} The decoded token payload
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Verify authentication token and return user data
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} The decoded user data or null if invalid
 */
export function verifyAuth(token) {
  try {
    if (!token) return null;
    const decoded = verifyToken(token);
    return {
      id: decoded.id,
      email: decoded.email,
      isSuperAdmin: decoded.isSuperAdmin
    };
  } catch (error) {
    return null;
  }
}