#!/usr/bin/env node

/**
 * Deployment Diagnostic Script
 * 
 * This script helps diagnose common deployment issues by checking:
 * - Environment variables
 * - Dependencies
 * - Build configuration
 * - NextAuth setup
 * 
 * Run with: node scripts/diagnose-deployment.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

console.log('🔍 Deployment Diagnostic Tool\n');
console.log('=' .repeat(60));
console.log('');

let issues = [];
let warnings = [];
let passed = [];

// Check 1: Environment Variables
console.log('📋 Checking Environment Variables...\n');

const requiredEnvVars = {
  OPENAI_API_KEY: 'OpenAI API key for GitHub summarizer',
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous/public key',
  GOOGLE_CLIENT_ID: 'Google OAuth Client ID',
  GOOGLE_CLIENT_SECRET: 'Google OAuth Client Secret',
  NEXTAUTH_SECRET: 'NextAuth.js secret key',
  NEXTAUTH_URL: 'NextAuth.js URL (your deployment URL)',
};

const missing = [];
const present = [];

for (const [varName, description] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  if (!value) {
    missing.push({ name: varName, description });
    issues.push(`❌ Missing: ${varName} - ${description}`);
  } else {
    const masked = varName.includes('SECRET') || varName.includes('KEY') 
      ? '***' + value.slice(-4)
      : value.substring(0, 30) + '...';
    present.push({ name: varName, value: masked });
    passed.push(`✅ Present: ${varName}`);
  }
}

if (missing.length > 0) {
  console.log('❌ Missing Required Variables:');
  missing.forEach(({ name, description }) => {
    console.log(`   - ${name}: ${description}`);
  });
  console.log('');
}

if (present.length > 0) {
  console.log('✅ Present Variables:');
  present.forEach(({ name, value }) => {
    console.log(`   - ${name}: ${value}`);
  });
  console.log('');
}

// Check 2: NEXTAUTH_URL Format
console.log('🔗 Checking NEXTAUTH_URL Format...\n');
const nextAuthUrl = process.env.NEXTAUTH_URL;
if (nextAuthUrl) {
  if (!nextAuthUrl.startsWith('http://') && !nextAuthUrl.startsWith('https://')) {
    issues.push(`❌ NEXTAUTH_URL must start with http:// or https://`);
    console.log(`❌ NEXTAUTH_URL must start with http:// or https://`);
    console.log(`   Current value: ${nextAuthUrl}`);
  } else if (nextAuthUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    warnings.push(`⚠️  NEXTAUTH_URL uses localhost but NODE_ENV is production`);
    console.log(`⚠️  Warning: NEXTAUTH_URL uses localhost but NODE_ENV is production`);
    console.log(`   This might cause issues in production deployment`);
  } else {
    passed.push(`✅ NEXTAUTH_URL format is correct`);
    console.log(`✅ NEXTAUTH_URL format is correct: ${nextAuthUrl}`);
  }
} else {
  console.log('❌ NEXTAUTH_URL is not set');
}
console.log('');

// Check 3: NEXTAUTH_SECRET Strength
console.log('🔐 Checking NEXTAUTH_SECRET Strength...\n');
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (nextAuthSecret) {
  if (nextAuthSecret.length < 32) {
    warnings.push(`⚠️  NEXTAUTH_SECRET is too short (recommended: 32+ characters)`);
    console.log(`⚠️  Warning: NEXTAUTH_SECRET is too short`);
    console.log(`   Current length: ${nextAuthSecret.length} characters`);
    console.log(`   Recommended: 32+ characters`);
  } else {
    passed.push(`✅ NEXTAUTH_SECRET length is adequate`);
    console.log(`✅ NEXTAUTH_SECRET length is adequate (${nextAuthSecret.length} characters)`);
  }
} else {
  console.log('❌ NEXTAUTH_SECRET is not set');
}
console.log('');

// Check 4: Package.json and Dependencies
console.log('📦 Checking Dependencies...\n');
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = [
      'next',
      'next-auth',
      '@supabase/supabase-js',
      '@supabase/ssr',
      '@langchain/openai',
    ];
    
    const missingDeps = [];
    const presentDeps = [];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        presentDeps.push(dep);
        passed.push(`✅ Dependency present: ${dep}`);
      } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        warnings.push(`⚠️  ${dep} is in devDependencies but should be in dependencies`);
        console.log(`⚠️  Warning: ${dep} is in devDependencies but should be in dependencies`);
      } else {
        missingDeps.push(dep);
        issues.push(`❌ Missing dependency: ${dep}`);
      }
    });
    
    if (missingDeps.length > 0) {
      console.log('❌ Missing Dependencies:');
      missingDeps.forEach(dep => console.log(`   - ${dep}`));
    } else {
      console.log('✅ All required dependencies are present');
    }
  } catch (error) {
    warnings.push(`⚠️  Could not read package.json: ${error.message}`);
    console.log(`⚠️  Could not read package.json: ${error.message}`);
  }
} else {
  issues.push(`❌ package.json not found`);
  console.log('❌ package.json not found');
}
console.log('');

// Check 5: Next.js Configuration
console.log('⚙️  Checking Next.js Configuration...\n');
const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
const nextConfigJsPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath) || fs.existsSync(nextConfigJsPath)) {
  passed.push(`✅ Next.js config file found`);
  console.log('✅ Next.js config file found');
} else {
  warnings.push(`⚠️  Next.js config file not found (optional but recommended)`);
  console.log('⚠️  Next.js config file not found (optional but recommended)');
}
console.log('');

// Check 6: TypeScript Configuration
console.log('📝 Checking TypeScript Configuration...\n');
const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsConfigPath)) {
  passed.push(`✅ TypeScript config found`);
  console.log('✅ TypeScript config found');
} else {
  warnings.push(`⚠️  tsconfig.json not found`);
  console.log('⚠️  tsconfig.json not found');
}
console.log('');

// Summary
console.log('=' .repeat(60));
console.log('📊 DIAGNOSTIC SUMMARY\n');

if (passed.length > 0) {
  console.log('✅ Passed Checks:');
  passed.forEach(check => console.log(`   ${check}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (issues.length > 0) {
  console.log('❌ Issues Found:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('');
  console.log('💡 Next Steps:');
  console.log('   1. Fix the issues listed above');
  console.log('   2. For environment variables, see:');
  console.log('      - VERCEL_DEPLOYMENT_FIX.md');
  console.log('      - DEPLOYMENT.md');
  console.log('   3. For missing dependencies, run: npm install');
  console.log('   4. Test locally: npm run build');
  console.log('');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Your project should deploy successfully.');
  console.log('');
  console.log('💡 Remember to:');
  console.log('   1. Set all environment variables in Vercel');
  console.log('   2. Configure Google OAuth redirect URI');
  console.log('   3. Test the build locally: npm run build');
  console.log('');
  process.exit(0);
}

