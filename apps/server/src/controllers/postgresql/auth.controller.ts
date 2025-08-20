import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { IUser } from '../../models/User.model';
import { repositoryService } from '../../repositories';
import { User, UserStatus } from '../../entities/User.entity';
import { MoreThan } from 'typeorm';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../../middleware/auth';
import { sendEmail } from '../../services/email.service';
import { generateTokens, verifyRefreshToken } from '../../utils/tokenUtils';

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
