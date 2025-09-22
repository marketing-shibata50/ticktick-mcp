#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const projectDir = process.cwd();
  console.log(`Building TickTick MCP Server in: ${projectDir}`);
  console.log('=====================================');

  try {
    // Check if node_modules exists
    console.log('\n1. Checking dependencies...');
    const fs = require('fs');
    if (!fs.existsSync('node_modules')) {
      console.log('node_modules not found. Installing dependencies...');
      await runCommand('npm', ['install']);
    } else {
      console.log('✅ node_modules exists');
    }

    // Clean dist directory
    console.log('\n2. Cleaning build directory...');
    if (fs.existsSync('dist')) {
      await runCommand('rm', ['-rf', 'dist']);
    }
    console.log('✅ Build directory cleaned');

    // Run TypeScript compilation
    console.log('\n3. Running TypeScript compilation...');
    await runCommand('npx', ['tsc', '--noEmit'], { cwd: projectDir });
    console.log('✅ TypeScript type checking passed');

    console.log('\n4. Building project...');
    await runCommand('npx', ['tsc'], { cwd: projectDir });
    console.log('✅ Build completed successfully');

    // Check if dist was created
    if (fs.existsSync('dist')) {
      console.log('\n5. Verifying build output...');
      const distFiles = fs.readdirSync('dist');
      console.log('Built files:', distFiles);
      console.log('✅ Build verification complete');
    }

    console.log('\n🎉 Build successful!');
    console.log('=====================================');

  } catch (error) {
    console.error('\n❌ Build failed!');
    console.error('Error:', error.message);
    console.error('=====================================');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}