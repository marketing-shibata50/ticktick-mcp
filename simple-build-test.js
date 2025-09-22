const { execSync } = require('child_process');
const fs = require('fs');

console.log('TickTick MCP Server - Simple Build Test');
console.log('=======================================');

try {
  // Change to project directory
  process.chdir('/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server');
  
  console.log('Current directory:', process.cwd());
  console.log('');

  // Check if package.json exists
  if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
  } else {
    console.log('❌ package.json not found');
    process.exit(1);
  }

  // Check if tsconfig.json exists
  if (fs.existsSync('tsconfig.json')) {
    console.log('✅ tsconfig.json found');
  } else {
    console.log('❌ tsconfig.json not found');
    process.exit(1);
  }

  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules found');
  } else {
    console.log('⚠️  node_modules not found, installing...');
    execSync('npm install', { stdio: 'inherit' });
  }

  console.log('\n1. Running TypeScript type check...');
  console.log('-----------------------------------');
  
  try {
    const output = execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ TypeScript type check passed');
    if (output.trim()) {
      console.log('Output:', output);
    }
  } catch (error) {
    console.log('❌ TypeScript type check failed:');
    console.log(error.stdout);
    console.log(error.stderr);
    return;
  }

  console.log('\n2. Running build...');
  console.log('-------------------');
  
  try {
    const output = execSync('npx tsc', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log('✅ Build completed successfully');
    if (output.trim()) {
      console.log('Output:', output);
    }
    
    // Check dist directory
    if (fs.existsSync('dist')) {
      const files = fs.readdirSync('dist');
      console.log('📁 Built files:', files);
    }
    
  } catch (error) {
    console.log('❌ Build failed:');
    console.log(error.stdout);
    console.log(error.stderr);
  }

} catch (error) {
  console.error('💥 Unexpected error:', error.message);
}