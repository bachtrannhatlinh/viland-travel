import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export class SupabaseAuthService {
  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    emailVerificationToken: string;
    emailVerificationExpires: Date;
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        email_verification_token: userData.emailVerificationToken,
        email_verification_expires: userData.emailVerificationExpires.toISOString(),
        is_email_verified: false,
        status: 'PENDING',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  }

  async findUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    return { data, error };
  }

  async registerUser(userData: {
    firstName: string;
    lastName: string; 
    email: string;
    password: string;
    phone?: string;
  }) {
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Generate token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const result = await this.createUser({
      ...userData,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    
    return result;
  }

  async loginUser({ email, password }: { email: string; password: string }) {
    const { data: user, error } = await this.findUserByEmail(email);
    if (error || !user) {
      return { data: null, error: { message: 'User not found' } };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { data: null, error: { message: 'Invalid email or password' } };
    }
    return { data: user, error: null };
  }

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }
}

export const supabaseAuthService = new SupabaseAuthService();

