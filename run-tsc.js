#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('Running TypeScript compilation...');
  execSync('npx tsc', { 
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  console.log('TypeScript compilation successful!');
} catch (error) {
  console.error('TypeScript compilation failed with exit code:', error.status);
  process.exit(error.status);
}