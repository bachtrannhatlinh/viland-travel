const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '***hidden***' : 'NOT SET'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM}`);
  console.log(`EMAIL_FROM_NAME: ${process.env.EMAIL_FROM_NAME}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}\n`);

  // Validate required variables
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please update your .env file with the missing variables.');
    console.log('📖 See docs/EMAIL_SETUP.md for detailed instructions.\n');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Test connection
    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📧 Sending test email...');
    const testEmail = {
      from: `${process.env.EMAIL_FROM_NAME || 'ViLand Travel'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🧪 Test Email - ViLand Travel Email Configuration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>🌍 ViLand Travel</h1>
            <p>Email Configuration Test</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 40px; border-radius: 0 0 10px 10px;">
            <h2>✅ Email Configuration Successful!</h2>
            
            <p>Congratulations! Your email configuration is working correctly.</p>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>📋 Configuration Details:</h3>
              <ul>
                <li><strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}</li>
                <li><strong>Port:</strong> ${process.env.EMAIL_PORT}</li>
                <li><strong>From Email:</strong> ${process.env.EMAIL_FROM || process.env.EMAIL_USER}</li>
                <li><strong>From Name:</strong> ${process.env.EMAIL_FROM_NAME || 'ViLand Travel'}</li>
              </ul>
            </div>
            
            <p>Your email verification system is now ready to use!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                Visit ViLand Travel
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This is a test email sent at ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
            <p>© 2025 ViLand Travel. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `
        ViLand Travel - Email Configuration Test
        
        ✅ Email Configuration Successful!
        
        Your email configuration is working correctly.
        
        Configuration Details:
        - SMTP Host: ${process.env.EMAIL_HOST}
        - Port: ${process.env.EMAIL_PORT}
        - From Email: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}
        - From Name: ${process.env.EMAIL_FROM_NAME || 'ViLand Travel'}
        
        Your email verification system is now ready to use!
        
        This is a test email sent at ${new Date().toLocaleString('vi-VN')}
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Email sent to: ${process.env.EMAIL_USER}\n`);

    console.log('🎉 Email configuration is working perfectly!');
    console.log('🚀 Your email verification system is ready to use.\n');

  } catch (error) {
    console.log('❌ Email configuration failed:');
    console.log(`   Error: ${error.message}\n`);

    // Provide troubleshooting tips
    console.log('🔧 Troubleshooting Tips:');
    if (error.code === 'EAUTH') {
      console.log('   - Check your email username and password');
      console.log('   - For Gmail: Use App Password instead of regular password');
      console.log('   - Enable 2-factor authentication and generate App Password');
    } else if (error.code === 'ECONNECTION') {
      console.log('   - Check your internet connection');
      console.log('   - Verify SMTP host and port settings');
      console.log('   - Try port 465 (SSL) instead of 587 (TLS)');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   - Connection timeout - check firewall settings');
      console.log('   - Try different port (465 or 587)');
    }
    console.log('   - See docs/EMAIL_SETUP.md for detailed setup instructions\n');
  }
}

// Run the test
testEmailConfiguration().catch(console.error);
