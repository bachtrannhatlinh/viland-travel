import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { IUser } from '../models/User.model';
import { repositoryService } from '../repositories';
import { User, UserStatus } from '../entities/User.entity';
import { MoreThan } from 'typeorm';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth';
import { sendEmail } from '../services/email.service';
import { generateTokens, verifyRefreshToken } from '../utils/tokenUtils';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
  const existingUser = await repositoryService.users.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: {
          message: 'User with this email already exists'
        }
      });
      return;
    }

    // Create user
    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const user = repositoryService.users.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      emailVerificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isEmailVerified: false,
      status: UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await repositoryService.users.save(user);

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Xác thực tài khoản ViLand Travel',
        template: 'email-verification',
        context: {
          firstName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`
        }
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Add refresh token to user
  // (If you have refreshTokens column, handle here. Otherwise, skip or implement as needed)
  // user.refreshTokens = user.refreshTokens || [];
  // user.refreshTokens.push(refreshToken);
  // await repositoryService.users.save(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      },
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during registration'
      }
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

    const { email, password } = req.body;

    // Find user and include password
  const user = await repositoryService.users.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
      return;
    }

    // Check if user is active
    if (!user || user.status !== UserStatus.ACTIVE) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is not active. Please contact support.'
        }
      });
      return;
    }

    // Check password
  // You need to implement password check here, e.g. using bcrypt
  const isPasswordValid = user && await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Add refresh token to user
  // user.refreshTokens = user.refreshTokens || [];
  // user.refreshTokens.push(refreshToken);
  user.lastLogin = new Date();
  await repositoryService.users.save(user);

    res.status(200).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during login'
      }
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { refreshToken } = req.body;

    if (refreshToken && user.refreshTokens) {
      // Remove the specific refresh token
      user.refreshTokens = user.refreshTokens.filter((token: string) => token !== refreshToken);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during logout'
      }
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Refresh token is required'
        }
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid refresh token'
        }
      });
      return;
    }

    // Find user and check if refresh token exists
  const user = await repositoryService.users.findOne({ where: { id: decoded.id } });
    // (Bạn cần tự xử lý refreshToken nếu muốn lưu vào DB, ở đây bỏ qua kiểm tra refreshTokens)
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid refresh token'
        }
      });
      return;
    }
    // Generate new tokens
    const tokens = generateTokens(user);
    await repositoryService.users.save(user);

    res.status(200).json({
      success: true,
      data: tokens,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during token refresh'
      }
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

    const { email } = req.body;

  const user = await repositoryService.users.findOne({ where: { email } });
    if (!user) {
      // Don't reveal that user doesn't exist
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  await repositoryService.users.save(user);

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: 'Đặt lại mật khẩu ViLand Travel',
        template: 'password-reset',
        context: {
          firstName: user.firstName,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        }
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
  user.passwordResetToken = '';
  user.passwordResetExpires = new Date(0);

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to send password reset email'
        }
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

    const { token } = req.params;
    const { password } = req.body;

    const user = await repositoryService.users.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date())
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token'
        }
      });
      return;
    }

    // Update password
  user.password = password;
  user.passwordResetToken = '';
  user.passwordResetExpires = new Date(0);
  await repositoryService.users.save(user);

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await repositoryService.users.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date())
      }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired verification token'
        }
      });
      return;
    }

  user.isEmailVerified = true;
  user.emailVerificationToken = '';
  user.emailVerificationExpires = new Date(0);
  await repositoryService.users.save(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

    const { email } = req.body;

  const user = await repositoryService.users.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Email is already verified'
        }
      });
      return;
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await repositoryService.users.save(user);

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'Xác thực tài khoản ViLand Travel',
        template: 'email-verification',
        context: {
          firstName: user.firstName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`
        }
      });

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to send verification email'
        }
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 
      'address', 'preferences'
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid updates'
        }
      });
      return;
    }

    updates.forEach(update => {
      (user as any)[update] = req.body[update];
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
      return;
    }

  const user = await repositoryService.users.findOne({ where: { id: req.user._id } });
    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Check current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Current password is incorrect'
        }
      });
      return;
    }

    // Update password
  user.password = newPassword;
  await repositoryService.users.save(user);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
};
