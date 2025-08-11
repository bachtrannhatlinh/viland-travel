const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Next.js bundle...');

// Install bundle analyzer if not present
try {
  require.resolve('@next/bundle-analyzer');
} catch (e) {
  console.log('📦 Installing @next/bundle-analyzer...');
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
}

// Create temporary next.config.js with bundle analyzer
const originalConfig = fs.readFileSync(path.join(__dirname, 'next.config.js'), 'utf8');
const analyzerConfig = `
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

${originalConfig.replace('module.exports = nextConfig', 'module.exports = withBundleAnalyzer(nextConfig)')}
`;

// Write temporary config
fs.writeFileSync(path.join(__dirname, 'next.config.analyzer.js'), analyzerConfig);

try {
  // Run build with analyzer
  console.log('🏗️ Building with bundle analyzer...');
  execSync('ANALYZE=true npx next build', { 
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' }
  });
} finally {
  // Clean up
  fs.unlinkSync(path.join(__dirname, 'next.config.analyzer.js'));
}

console.log('✅ Bundle analysis complete! Check the opened browser tabs for results.');
