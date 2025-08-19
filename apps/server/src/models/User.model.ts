// User model interface (no mongoose)

// Define IUser interface without extending Document
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'staff' | 'driver';
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  loyaltyPoints?: number;
  lastLogin?: Date;
  refreshTokens?: string[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Methods to be implemented elsewhere
  comparePassword?(candidatePassword: string): Promise<boolean>;
  generateAccessToken?(): string;
  generateRefreshToken?(): string;
}

