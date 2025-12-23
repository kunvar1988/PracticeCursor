#!/usr/bin/env node

/**
 * Environment Variables Checker
 * 
 * This script checks if all required environment variables are set.
 * Run with: node scripts/check-env.js
 */

const requiredVars = {
  OPENAI_API_KEY: {
    description: 'OpenAI API key for GitHub summarizer',
    required: true,
    public: false,
  },
  NEXT_PUBLIC_SUPABASE_URL: {
    description: 'Supabase project URL',
    required: true,
    public: true,
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    description: 'Supabase anonymous/public key',
    required: true,
    public: true,
  },
  GOOGLE_CLIENT_ID: {
    description: 'Google OAuth Client ID for authentication',
    required: true,
    public: false,
  },
  GOOGLE_CLIENT_SECRET: {
    description: 'Google OAuth Client Secret for authentication',
    required: true,
    public: false,
  },
  NEXTAUTH_SECRET: {
    description: 'Secret key for NextAuth.js session encryption',
    required: true,
    public: false,
  },
  NEXTAUTH_URL: {
    description: 'Your application public URL (e.g., https://yourdomain.com or http://localhost:3000)',
    required: true,
    public: false,
  },
  DB_URL: {
    description: 'Database connection URL (optional)',
    required: false,
    public: false,
  },
};

console.log('🔍 Checking environment variables...\n');

let allPresent = true;
const missing = [];
const present = [];

for (const [varName, config] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  const isPresent = !!value;
  
  if (isPresent) {
    const maskedValue = config.public 
      ? value.substring(0, 20) + '...' 
      : '***' + value.substring(value.length - 4);
    present.push({ name: varName, value: maskedValue, description: config.description });
  } else {
    if (config.required) {
      missing.push({ name: varName, description: config.description });
      allPresent = false;
    }
  }
}

// Display results
if (present.length > 0) {
  console.log('✅ Present variables:');
  present.forEach(({ name, value, description }) => {
    console.log(`   ${name}: ${value} (${description})`);
  });
  console.log('');
}

if (missing.length > 0) {
  console.log('❌ Missing required variables:');
  missing.forEach(({ name, description }) => {
    console.log(`   ${name} - ${description}`);
  });
  console.log('');
}

if (allPresent) {
  console.log('✅ All required environment variables are set!\n');
  process.exit(0);
} else {
  console.log('💡 To set up environment variables:');
  console.log('   1. Create a .env.local file in the project root');
  console.log('   2. Add the missing variables');
  console.log('   3. See ENV_SETUP.md for detailed instructions\n');
  console.log('   For deployment, see DEPLOYMENT.md\n');
  process.exit(1);
}

