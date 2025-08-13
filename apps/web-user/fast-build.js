const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⚡ Fast build mode - optimized for development');

const startTime = Date.now();

// Set environment variables for faster build
const env = {
  ...process.env,
  NODE_ENV: 'production',
  SKIP_ENV_VALIDATION: '1',
  NEXT_TELEMETRY_DISABLED: '1',
  // Disable source maps for faster build
  GENERATE_SOURCEMAP: 'false',
  // Use SWC minifier
  NEXT_PRIVATE_STANDALONE: 'true'
};

try {
  console.log('🏗️ Running fast build...');
  console.log('⏱️ Start time:', new Date().toLocaleTimeString());
  
  // Use the fast build script
  execSync('npm run build:fast', { 
    stdio: 'inherit',
    cwd: __dirname,
    env: env
  });
  
  const endTime = Date.now();
  const buildTime = (endTime - startTime) / 1000;
  
  console.log('✅ Fast build completed!');
  console.log(`⏱️ Total build time: ${buildTime.toFixed(2)} seconds`);
  
  // Show build size info
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      const stats = fs.statSync(staticDir);
      console.log('📦 Build output size: ~', Math.round(stats.size / 1024), 'KB');
    }
  }
  
} catch (error) {
  const endTime = Date.now();
  const buildTime = (endTime - startTime) / 1000;
  
  console.error('❌ Fast build failed after', buildTime.toFixed(2), 'seconds');
  console.error('Error:', error.message);
  process.exit(1);
}
