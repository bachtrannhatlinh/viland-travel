import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/postgresql';
import { User, UserStatus } from '../entities/User.entity';
import { AuthenticatedRequest } from '../middleware/auth';
import { MoreThan } from 'typeorm';

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

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

    // Get user repository
    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: {
          message: 'User with this email already exists'
        }
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      emailVerificationToken,
      emailVerificationExpires
    });

    await userRepository.save(user);

    // Send verification email
    try {
      // Import email service dynamically to avoid circular dependency
      const { sendEmail } = await import('../services/email.service');

      await sendEmail({
        to: email,
        subject: 'Xác thực tài khoản ViLand Travel',
        template: 'email-verification',
        context: {
          firstName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`
        }
      });

      console.log(`✅ Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // Don't fail the registration if email sending fails
    }

    // Remove sensitive data from response
    const { password: _, emailVerificationToken: __, ...userResponse } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse
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

    // Get user repository
    const userRepository = AppDataSource.getRepository(User);

    // Find user
    const user = await userRepository.findOne({ where: { email } });
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
    if (user.status !== UserStatus.ACTIVE) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is not active. Please contact support.'
        }
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid email or password'
        }
      });
      return;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Account is not active. Please check your email and verify your account.',
          code: 'EMAIL_NOT_VERIFIED',
          email: user.email
        }
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await userRepository.save(user);

    // Generate JWT token
    const token = generateToken(user.id);

    // Remove sensitive data from response
    const { password: _, ...userResponse } = user;

    // Set token in cookie (optional, for additional security)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token: token
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

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated'
        }
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
      return;
    }

    // Remove sensitive data
    const { password, emailVerificationToken, passwordResetToken, ...userResponse } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
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

// @desc    Logout user (placeholder)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
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

// Placeholder functions for other auth endpoints
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Verification token is required'
        }
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Find user with valid verification token
    const user = await userRepository.findOne({
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

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = null as any;
    user.emailVerificationExpires = null as any;
    user.status = UserStatus.ACTIVE; // Activate account after email verification

    await userRepository.save(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. Your account is now active!'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during email verification'
      }
    });
  }
};

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

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

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
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await userRepository.save(user);

    // Send verification email
    try {
      // Import email service dynamically to avoid circular dependency
      const { sendEmail } = await import('../services/email.service');

      await sendEmail({
        to: email,
        subject: 'Xác thực tài khoản ViLand Travel',
        template: 'email-verification',
        context: {
          firstName: user.firstName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`
        }
      });

      console.log(`✅ Verification email sent to ${email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // Don't fail the registration if email sending fails
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
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

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated'
        }
      });
      return;
    }

    const { firstName, lastName, phone, address } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
      return;
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) {
      user.address = {
        ...user.address,
        ...address
      };
    }

    await userRepository.save(user);

    // Remove sensitive data from response
    const { password, emailVerificationToken, passwordResetToken, ...userResponse } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error during profile update'
      }
    });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};
