import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (payload, expiresIn = '15m') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Generate email verification token
export const generateEmailVerificationToken = (userId) => {
  return generateToken({ userId, purpose: 'email_verification' }, '1d');
};

// Generate password reset token
export const generatePasswordResetToken = (userId) => {
  return generateToken({ userId, purpose: 'password_reset' }, '10m');
};

// Generate access token for authenticated users
export const generateAccessToken = (userId, role) => {
  return generateToken({ userId, role }, '15m');
};

// Generate refresh token
export const generateRefreshToken = (userId, role) => {
  return generateToken({ userId, role }, '7d');
};

// Attach tokens to response cookies
export const attachTokens = (res, userId, role) => {
  const accessToken = generateAccessToken(userId, role);
  const refreshToken = generateRefreshToken(userId, role);
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};