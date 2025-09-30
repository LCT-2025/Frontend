#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Default environment configuration
const defaultEnv = `# Backend API Configuration
VITE_API_BASE_URL=https://api.xn--b1agjiduva.xn--p1ai

# Development Configuration
VITE_DEV_MODE=true
`;

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local already exists');
  console.log('📝 Current configuration:');
  console.log(fs.readFileSync(envPath, 'utf8'));
} else {
  // Create .env.local with default values
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env.local with default configuration');
  console.log('📝 You can modify the backend URL by editing .env.local');
  console.log('🔧 Example: VITE_API_BASE_URL=http://your-backend-server:8080');
}

console.log('\n🚀 To use a different backend URL:');
console.log('1. Edit Frontend/.env.local');
console.log('2. Change VITE_API_BASE_URL to your backend address');
console.log('3. Restart the frontend development server');
