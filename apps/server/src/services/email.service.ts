import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: any;
  html?: string;
  text?: string;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Load and compile email template
const loadTemplate = (templateName: string, context: any = {}) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    return template(context);
  } catch (error) {
    console.error(`Failed to load email template ${templateName}:`, error);
    throw new Error(`Email template ${templateName} not found`);
  }
};

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();

    let html = options.html;
    
    // If template is specified, compile it with context
    if (options.template) {
      html = loadTemplate(options.template, {
        ...options.context,
        baseUrl: process.env.FRONTEND_URL,
        companyName: 'ViLand Travel',
        supportEmail: process.env.EMAIL_FROM
      });
    }

    const mailOptions = {
      from: `ViLand Travel <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to: string, firstName: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Chào mừng bạn đến với ViLand Travel!',
    template: 'welcome',
    context: {
      firstName
    }
  });
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
  to: string, 
  bookingDetails: any
): Promise<void> => {
  await sendEmail({
    to,
    subject: `Xác nhận đặt tour - ${bookingDetails.tourTitle}`,
    template: 'booking-confirmation',
    context: {
      ...bookingDetails
    }
  });
};

// Send booking cancellation email
export const sendBookingCancellationEmail = async (
  to: string, 
  bookingDetails: any
): Promise<void> => {
  await sendEmail({
    to,
    subject: `Hủy đặt tour - ${bookingDetails.tourTitle}`,
    template: 'booking-cancellation',
    context: {
      ...bookingDetails
    }
  });
};

// Send payment confirmation email
export const sendPaymentConfirmationEmail = async (
  to: string, 
  paymentDetails: any
): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Xác nhận thanh toán thành công',
    template: 'payment-confirmation',
    context: {
      ...paymentDetails
    }
  });
};

// Send reminder email
export const sendReminderEmail = async (
  to: string, 
  reminderDetails: any
): Promise<void> => {
  await sendEmail({
    to,
    subject: `Nhắc nhở: Chuyến đi của bạn sắp bắt đầu`,
    template: 'trip-reminder',
    context: {
      ...reminderDetails
    }
  });
};
