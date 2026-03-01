#!/usr/bin/env node
/**
 * Quick System Check Script
 * Tests if all components are ready
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 GamiSaviya System Check\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let allGood = true;

// Check 1: Server package.json
const serverPackage = path.join(__dirname, 'package.json');
if (fs.existsSync(serverPackage)) {
  console.log('✅ Server package.json found');
} else {
  console.log('❌ Server package.json missing');
  allGood = false;
}

// Check 2: Server .env
const serverEnv = path.join(__dirname, '.env');
if (fs.existsSync(serverEnv)) {
  console.log('✅ Server .env configured');
  const envContent = fs.readFileSync(serverEnv, 'utf-8');
  if (envContent.includes('MONGODB_URI')) {
    console.log('   ✓ MongoDB URI configured');
  }
  if (envContent.includes('JWT_SECRET')) {
    console.log('   ✓ JWT Secret configured');
  }
  if (envContent.includes('CLIENT_URL')) {
    console.log('   ✓ Client URL configured');
  }
} else {
  console.log('❌ Server .env missing');
  allGood = false;
}

// Check 3: Server node_modules
const serverModules = path.join(__dirname, 'node_modules');
if (fs.existsSync(serverModules)) {
  console.log('✅ Server dependencies installed');
} else {
  console.log('⚠️  Server dependencies not installed - run: npm install');
  allGood = false;
}

// Check 4: Client setup
const clientDir = path.join(__dirname, '..', 'client');
const clientPackage = path.join(clientDir, 'package.json');
if (fs.existsSync(clientPackage)) {
  console.log('✅ Client package.json found');
} else {
  console.log('❌ Client package.json missing');
  allGood = false;
}

// Check 5: Client .env
const clientEnv = path.join(clientDir, '.env');
if (fs.existsSync(clientEnv)) {
  console.log('✅ Client .env configured');
  const envContent = fs.readFileSync(clientEnv, 'utf-8');
  if (envContent.includes('VITE_API_URL')) {
    console.log('   ✓ API URL configured');
  }
} else {
  console.log('❌ Client .env missing');
  allGood = false;
}

// Check 6: Client node_modules
const clientModules = path.join(clientDir, 'node_modules');
if (fs.existsSync(clientModules)) {
  console.log('✅ Client dependencies installed');
} else {
  console.log('⚠️  Client dependencies not installed - run: cd client && npm install');
  allGood = false;
}

// Check 7: Key files
const keyFiles = [
  'server.js',
  'config/db.js',
  'routes/authRoutes.js',
  'routes/productRoutes.js',
  'models/User.js',
  'models/Product.js'
];

console.log('\n📁 Key Server Files:');
keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} missing`);
    allGood = false;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allGood) {
  console.log('🎉 All checks passed! System is ready.\n');
  console.log('To start the server:');
  console.log('  npm start        (production)');
  console.log('  npm run dev      (development with nodemon)\n');
  console.log('To seed the database:');
  console.log('  npm run seed\n');
} else {
  console.log('⚠️  Some issues found. Please fix them before starting.\n');
  process.exit(1);
}
