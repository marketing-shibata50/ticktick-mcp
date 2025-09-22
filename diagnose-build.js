#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runDiagnosis() {
  console.log('TickTick MCP Server - Build Diagnosis');
  console.log('====================================');

  const projectDir = '/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server';
  
  try {
    process.chdir(projectDir);
    console.log(`Working directory: ${process.cwd()}`);

    // Step 1: Check dependencies
    console.log('\n1. Checking dependencies...');
    if (!fs.existsSync('node_modules')) {
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    console.log('✅ Dependencies checked');

    // Step 2: Clear any existing dist
    console.log('\n2. Cleaning build output...');
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
    console.log('✅ Build output cleaned');

    // Step 3: Check TypeScript configuration
    console.log('\n3. Checking TypeScript configuration...');
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log(`Target: ${tsConfig.compilerOptions.target}`);
    console.log(`Module: ${tsConfig.compilerOptions.module}`);
    console.log(`Module Resolution: ${tsConfig.compilerOptions.moduleResolution}`);
    console.log('✅ TypeScript configuration loaded');

    // Step 4: Run type checking
    console.log('\n4. Running TypeScript type checking...');
    try {
      const typeCheckOutput = execSync('npx tsc --noEmit --pretty', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ Type checking passed');
      if (typeCheckOutput.trim()) {
        console.log('Type check output:', typeCheckOutput);
      }
    } catch (error) {
      console.log('❌ Type checking failed:');
      console.log('--- STDOUT ---');
      console.log(error.stdout || '(no stdout)');
      console.log('--- STDERR ---');
      console.log(error.stderr || '(no stderr)');
      
      // Still try to continue with build
      console.log('\nContinuing with build attempt...');
    }

    // Step 5: Run build
    console.log('\n5. Running build...');
    try {
      const buildOutput = execSync('npx tsc', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ Build completed successfully');
      
      // Check what was built
      if (fs.existsSync('dist')) {
        const distFiles = fs.readdirSync('dist');
        console.log(`📁 Built ${distFiles.length} files:`);
        distFiles.slice(0, 10).forEach(file => {
          console.log(`   ${file}`);
        });
        if (distFiles.length > 10) {
          console.log(`   ... and ${distFiles.length - 10} more files`);
        }
      }
      
    } catch (error) {
      console.log('❌ Build failed:');
      console.log('--- STDOUT ---');
      console.log(error.stdout || '(no stdout)');
      console.log('--- STDERR ---');
      console.log(error.stderr || '(no stderr)');
    }

    // Step 6: Test the built output
    if (fs.existsSync('dist/index.js')) {
      console.log('\n6. Testing built output...');
      try {
        const testOutput = execSync('node dist/index.js --help', {
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 5000
        });
        console.log('✅ Built output can be executed');
      } catch (error) {
        // This might be expected if the script doesn't support --help
        console.log('⚠️  Build output test had issues (might be expected)');
        console.log(error.stdout || error.stderr || error.message);
      }
    }

    console.log('\n====================================');
    console.log('Diagnosis complete');

  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error(error.stack);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runDiagnosis();
}