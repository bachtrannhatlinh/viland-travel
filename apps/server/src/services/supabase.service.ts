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
  // Lấy user theo email
  async getUserByEmail(email: string) {
    return this.findUserByEmail(email);
  }

  // Sinh token reset password (giả lập, cần lưu vào DB nếu muốn bảo mật)
  async generateResetToken(userId: string) {
    // Tạo token ngẫu nhiên
    const token = crypto.randomBytes(32).toString('hex');
    // Lưu token vào user (giả lập, cần lưu vào DB thực tế)
    await supabase.from('users').update({ reset_token: token, reset_token_expires: new Date(Date.now() + 3600 * 1000).toISOString() }).eq('id', userId);
    return token;
  }

  // Đặt lại mật khẩu bằng token
  async resetPassword(token: string, newPassword: string) {
    // Tìm user theo reset_token và kiểm tra hạn
    const { data: user, error } = await supabase.from('users').select('*').eq('reset_token', token).single();
    if (error || !user || new Date(user.reset_token_expires) < new Date()) {
      return { success: false, message: 'Invalid or expired token' };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await supabase.from('users').update({ password: hashedPassword, reset_token: null, reset_token_expires: null }).eq('id', user.id);
    return { success: true };
  }

  // Xác thực email
  async verifyEmail(token: string) {
    const { data: user, error } = await supabase.from('users').select('*').eq('email_verification_token', token).single();
    if (error || !user) {
      return { success: false, message: 'Invalid token' };
    }
    await supabase.from('users').update({ is_email_verified: true, email_verification_token: null, email_verification_expires: null, status: 'ACTIVE' }).eq('id', user.id);
    return { success: true };
  }

  // Sinh lại token xác thực email
  async generateVerificationToken(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    await supabase.from('users').update({ email_verification_token: token, email_verification_expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }).eq('id', userId);
    return token;
  }

  // Cập nhật thông tin user
  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    const { data: user, error } = await supabase.from('users').update({ first_name: data.firstName, last_name: data.lastName, phone: data.phone }).eq('id', userId).select().single();
    if (error) return { success: false, message: error.message };
    return { success: true, user };
  }

  // Đổi mật khẩu
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error || !user) return { success: false, message: 'User not found' };
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) return { success: false, message: 'Old password is incorrect' };
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await supabase.from('users').update({ password: hashedPassword }).eq('id', userId);
    return { success: true };
  }
  async updateUserRefreshTokens(userId: string, refreshTokens: string[]) {
    // Cập nhật mảng refresh_tokens trên Supabase
    return await supabase
      .from('users')
      .update({ refresh_tokens: refreshTokens })
      .eq('id', userId);
  }
  
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

