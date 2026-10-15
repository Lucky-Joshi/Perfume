import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

export function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

/** Build the token pair for a user record. */
export function generateTokens(user) {
  const base = { sub: user.id, email: user.email, role: user.role || 'user' };
  return {
    accessToken: signAccessToken(base),
    refreshToken: signRefreshToken({ sub: user.id, email: user.email })
  };
}

export const cookieNames = {
  access: 'ea_access',
  refresh: 'ea_refresh'
};

/** HTTP-only cookie options — refresh token lives in a cookie when "remember me" is used. */
export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth'
  };
}