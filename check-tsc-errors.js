const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('TickTick MCP Server - TypeScript Error Check');
console.log('============================================');

const projectDir = '/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server';

try {
  // Change to project directory
  process.chdir(projectDir);
  console.log(`Working in: ${process.cwd()}`);

  // First, try compiling the test file
  console.log('\n1. Testing simple TypeScript compilation...');
  try {
    const output = execSync('npx tsc test-compile.ts --noEmit --target ES2022 --module ESNext --moduleResolution node', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ Simple compilation successful');
  } catch (error) {
    console.log('❌ Simple compilation failed:');
    console.log('STDOUT:', error.stdout);
    console.log('STDERR:', error.stderr);
  }

  // Now try the full project
  console.log('\n2. Testing full project compilation...');
  try {
    const output = execSync('npx tsc --noEmit', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ Full project type check successful');
  } catch (error) {
    console.log('❌ Full project type check failed:');
    console.log('STDOUT:', error.stdout);
    console.log('STDERR:', error.stderr);
    
    // Try to identify specific problems
    console.log('\n3. Analyzing errors...');
    const errorOutput = error.stderr || error.stdout || '';
    
    if (errorOutput.includes('Cannot find module')) {
      console.log('🔍 Module resolution issues detected');
    }
    if (errorOutput.includes('has no exported member')) {
      console.log('🔍 Export/import issues detected');
    }
    if (errorOutput.includes('Type')) {
      console.log('🔍 Type definition issues detected');
    }
  }

  // Try building
  console.log('\n4. Testing build...');
  try {
    const output = execSync('npx tsc', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ Build successful');
    
    // Check dist directory
    if (fs.existsSync('dist')) {
      const files = fs.readdirSync('dist');
      console.log('📁 Built files:', files.slice(0, 5));
      if (files.length > 5) {
        console.log(`   ... and ${files.length - 5} more files`);
      }
    }
  } catch (error) {
    console.log('❌ Build failed:');
    console.log('STDOUT:', error.stdout);
    console.log('STDERR:', error.stderr);
  }

} catch (error) {
  console.error('💥 Unexpected error:', error.message);
}

console.log('\n============================================');