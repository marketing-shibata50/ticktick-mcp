const { spawn } = require('child_process');
const path = require('path');

// Project directory
const projectDir = '/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server';

console.log('🔍 Quick TypeScript Build Check');
console.log('===============================');

process.chdir(projectDir);
console.log(`📂 Working directory: ${process.cwd()}`);
console.log('');

// Function to run command and capture output
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`⚡ Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      console.log(`✅ Exit code: ${code}`);
      resolve({ code, stdout, stderr });
    });

    child.on('error', (error) => {
      console.error(`❌ Command error: ${error}`);
      reject(error);
    });
  });
}

async function main() {
  try {
    // Check TypeScript version
    console.log('📋 Checking TypeScript version...');
    const tscVersion = await runCommand('npx', ['tsc', '--version']);
    console.log(`TypeScript: ${tscVersion.stdout.trim()}`);
    console.log('');

    // Check syntax only (no emit)
    console.log('🔍 Checking TypeScript syntax (no emit)...');
    const syntaxCheck = await runCommand('npx', ['tsc', '--noEmit']);
    
    if (syntaxCheck.code === 0) {
      console.log('✅ TypeScript syntax check: PASSED');
    } else {
      console.log('❌ TypeScript syntax check: FAILED');
      console.log('Errors:');
      console.log(syntaxCheck.stderr);
    }
    console.log('');

    // Attempt full build
    console.log('🏗️ Attempting full build...');
    const buildResult = await runCommand('npm', ['run', 'build']);
    
    if (buildResult.code === 0) {
      console.log('✅ Build: SUCCESS');
      console.log('📦 Checking build output...');
      
      // Check if dist directory exists
      try {
        const fs = require('fs');
        const distExists = fs.existsSync('./dist');
        const indexExists = fs.existsSync('./dist/index.js');
        
        console.log(`📁 dist directory: ${distExists ? '✅' : '❌'}`);
        console.log(`📄 index.js: ${indexExists ? '✅' : '❌'}`);
        
        if (distExists) {
          const distFiles = fs.readdirSync('./dist');
          console.log(`📁 Build files: ${distFiles.length} files created`);
        }
      } catch (e) {
        console.log('⚠️ Could not check build output:', e.message);
      }
    } else {
      console.log('❌ Build: FAILED');
      console.log('Build errors:');
      console.log(buildResult.stderr);
      console.log('Build output:');
      console.log(buildResult.stdout);
    }

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

main();