import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supabaseAuthService } from '../../services/supabase.service';
import { sendEmail } from '../../services/email.service';
import jwt, { Secret } from 'jsonwebtoken';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { firstName, lastName, email, password, phone } = req.body;
    const { data: user, error } = await supabaseAuthService.registerUser({ firstName, lastName, email, password, phone });
    if (error) {
      console.error('Supabase register error:', error);
      res.status(400).json({
        success: false,
        error: { message: error.message || 'Registration failed' }
      });
      return;
    }
    // Gửi email xác thực nếu cần
    res.status(201).json({
      success: true,
      data: { user },
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during registration', details: error }
    });
  }
};
// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { email, password } = req.body;
    const { data: user, error } = await supabaseAuthService.loginUser({ email, password });
    if (error) {
      res.status(401).json({
        success: false,
        error: { message: error.message || 'Invalid email or password' }
      });
      return;
    }
    // Tạo access token
    const secret: Secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const expiresIn: string | number | undefined = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { id: user?.id, email: user?.email },
      secret,
      { expiresIn: expiresIn as any }
    );
    res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during login' }
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
      return;
    }
    const { data: user, error } = await supabaseAuthService.getUserProfile(userId);
    if (error || !user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during logout' }
    });
  }
};

// Refresh token (placeholder)
import { verifyRefreshToken, generateTokens } from '../../utils/tokenUtils';
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Missing refresh token' });
    }
    const user = await verifyRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const tokens = generateTokens(user);
    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Forgot password (placeholder)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }
    const { data: user, error } = await supabaseAuthService.getUserByEmail(email);
    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const resetToken = await supabaseAuthService.generateResetToken(user.id);
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      }
    });
    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Reset password (placeholder)
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Token and new password are required' });
      return;
    }
    const result = await supabaseAuthService.resetPassword(token, newPassword);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message || 'Reset password failed' });
      return;
    }
    res.status(200).json({ success: true, message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Verify email (placeholder)
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).json({ success: false, message: 'Missing verification token' });
      return;
    }
    const result = await supabaseAuthService.verifyEmail(token as string);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message || 'Email verification failed' });
      return;
    }
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Resend verification email (placeholder)
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }
    const { data: user, error } = await supabaseAuthService.getUserByEmail(email);
    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    const token = await supabaseAuthService.generateVerificationToken(user.id);
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      template: 'email-verification',
      context: {
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${token}`
      }
    });
    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Update profile (placeholder)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }
    const { firstName, lastName, phone } = req.body;
    const result = await supabaseAuthService.updateUserProfile(userId, { firstName, lastName, phone });
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message || 'Update profile failed' });
      return;
    }
    res.status(200).json({ success: true, message: 'Profile updated successfully', user: result.user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Change password (placeholder)
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!userId || !oldPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }
    const result = await supabaseAuthService.changePassword(userId, oldPassword, newPassword);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message || 'Change password failed' });
      return;
    }
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};
// ...existing code...
