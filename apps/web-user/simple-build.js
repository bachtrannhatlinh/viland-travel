const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Simple build test - minimal configuration');

const startTime = Date.now();

// Backup original config
const originalConfig = path.join(__dirname, 'next.config.js');
const simpleConfig = path.join(__dirname, 'next.config.simple.js');
const backupConfig = path.join(__dirname, 'next.config.backup.js');

try {
  // Backup original
  fs.copyFileSync(originalConfig, backupConfig);
  
  // Use simple config
  fs.copyFileSync(simpleConfig, originalConfig);
  
  console.log('🏗️ Running simple build...');
  console.log('⏱️ Start time:', new Date().toLocaleTimeString());
  
  execSync('npx next build', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: { 
      ...process.env, 
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1'
    }
  });
  
  const endTime = Date.now();
  const buildTime = (endTime - startTime) / 1000;
  
  console.log('✅ Simple build completed!');
  console.log(`⏱️ Total build time: ${buildTime.toFixed(2)} seconds`);
  
} catch (error) {
  const endTime = Date.now();
  const buildTime = (endTime - startTime) / 1000;
  
  console.error('❌ Simple build failed after', buildTime.toFixed(2), 'seconds');
  console.error('Error:', error.message);
} finally {
  // Restore original config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
    console.log('🔄 Restored original configuration');
  }
}
