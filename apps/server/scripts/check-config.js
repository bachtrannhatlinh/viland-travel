const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

function checkConfiguration() {
  console.log('🔍 Checking ViLand Travel Configuration...\n');

  const checks = [
    {
      category: '🗄️ Database',
      items: [
        { name: 'DATABASE_URL', value: process.env.DATABASE_URL, required: true },
        { name: 'REDIS_URL', value: process.env.REDIS_URL, required: false }
      ]
    },
    {
      category: '🔐 Authentication',
      items: [
        { name: 'JWT_SECRET', value: process.env.JWT_SECRET, required: true, sensitive: true },
        { name: 'JWT_EXPIRES_IN', value: process.env.JWT_EXPIRES_IN, required: true }
      ]
    },
    {
      category: '📧 Email Configuration',
      items: [
        { name: 'EMAIL_HOST', value: process.env.EMAIL_HOST, required: true },
        { name: 'EMAIL_PORT', value: process.env.EMAIL_PORT, required: true },
        { name: 'EMAIL_USER', value: process.env.EMAIL_USER, required: true },
        { name: 'EMAIL_PASS', value: process.env.EMAIL_PASS, required: true, sensitive: true },
        { name: 'EMAIL_FROM', value: process.env.EMAIL_FROM, required: true },
        { name: 'EMAIL_FROM_NAME', value: process.env.EMAIL_FROM_NAME, required: false },
        { name: 'FRONTEND_URL', value: process.env.FRONTEND_URL, required: true }
      ]
    },
    {
      category: '💳 Payment Gateway',
      items: [
        { name: 'VNPAY_TMN_CODE', value: process.env.VNPAY_TMN_CODE, required: false },
        { name: 'VNPAY_HASH_SECRET', value: process.env.VNPAY_HASH_SECRET, required: false, sensitive: true }
      ]
    },
    {
      category: '☁️ Cloud Services',
      items: [
        { name: 'CLOUDINARY_CLOUD_NAME', value: process.env.CLOUDINARY_CLOUD_NAME, required: false },
        { name: 'CLOUDINARY_API_KEY', value: process.env.CLOUDINARY_API_KEY, required: false, sensitive: true }
      ]
    }
  ];

  let allGood = true;
  let criticalMissing = [];

  checks.forEach(category => {
    console.log(`${category.category}:`);
    
    category.items.forEach(item => {
      const status = item.value ? '✅' : (item.required ? '❌' : '⚠️');
      const displayValue = item.value 
        ? (item.sensitive ? '***configured***' : item.value)
        : 'NOT SET';
      
      console.log(`  ${status} ${item.name}: ${displayValue}`);
      
      if (item.required && !item.value) {
        allGood = false;
        criticalMissing.push(item.name);
      }
    });
    
    console.log('');
  });

  // Summary
  if (allGood) {
    console.log('🎉 All critical configurations are set!');
    console.log('✅ Your ViLand Travel application is ready to run.\n');
    
    console.log('🚀 Next steps:');
    console.log('  1. Test email configuration: npm run test:email');
    console.log('  2. Start the server: npm run dev');
    console.log('  3. Test registration and email verification');
  } else {
    console.log('❌ Missing critical configuration variables:');
    criticalMissing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
    console.log('📝 Please update your .env file with the missing variables.');
    console.log('📖 See .env.example and docs/EMAIL_SETUP.md for guidance.\n');
  }

  // Email specific guidance
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email Configuration Help:');
    console.log('   For Gmail:');
    console.log('   1. Enable 2-factor authentication');
    console.log('   2. Generate App Password (not regular password)');
    console.log('   3. Use these settings:');
    console.log('      EMAIL_HOST=smtp.gmail.com');
    console.log('      EMAIL_PORT=587');
    console.log('      EMAIL_USER=your-email@gmail.com');
    console.log('      EMAIL_PASS=your-16-digit-app-password');
    console.log('');
  }

  return allGood;
}

// Run the check
const isConfigured = checkConfiguration();
process.exit(isConfigured ? 0 : 1);
