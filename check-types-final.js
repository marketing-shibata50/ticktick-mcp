#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 TickTick MCP Server - Final TypeScript Check');
console.log('==============================================\n');

// Change to project directory
const projectDir = '/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server';
process.chdir(projectDir);

console.log(`📂 Working directory: ${process.cwd()}\n`);

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`⚡ Executing: ${command} ${args.join(' ')}`);

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
      resolve({ code, stdout, stderr });
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    // Step 1: TypeScript Version Check
    console.log('📋 Step 1: TypeScript Version Check');
    console.log('-----------------------------------');
    const versionResult = await runCommand('npx', ['tsc', '--version']);
    console.log(`TypeScript Version: ${versionResult.stdout.trim()}`);
    console.log('✅ Version check complete\n');

    // Step 2: TypeScript Type Check (no emit)
    console.log('🔍 Step 2: TypeScript Type Check (no emit)');
    console.log('-------------------------------------------');
    const typeCheckResult = await runCommand('npx', ['tsc', '--noEmit']);

    if (typeCheckResult.code === 0) {
      console.log('✅ TypeScript type check: PASSED');
      console.log('   No type errors found!');
    } else {
      console.log('❌ TypeScript type check: FAILED');
      console.log('   Errors found:');
      console.log(typeCheckResult.stderr);

      // Count and categorize errors
      const errorLines = typeCheckResult.stderr.split('\n').filter(line => line.includes('error TS'));
      console.log(`\n📊 Error Summary: ${errorLines.length} errors found`);
    }
    console.log('');

    // Step 3: Full Build Test (only if type check passed)
    if (typeCheckResult.code === 0) {
      console.log('🏗️ Step 3: Full Build Test');
      console.log('---------------------------');
      const buildResult = await runCommand('npm', ['run', 'build']);

      if (buildResult.code === 0) {
        console.log('✅ Build: SUCCESS');

        // Check build output
        const fs = require('fs');
        try {
          const distExists = fs.existsSync('./dist');
          const indexExists = fs.existsSync('./dist/index.js');

          console.log(`📁 dist directory: ${distExists ? '✅' : '❌'}`);
          console.log(`📄 index.js: ${indexExists ? '✅' : '❌'}`);

          if (distExists) {
            const distFiles = fs.readdirSync('./dist');
            console.log(`📦 Generated files: ${distFiles.length}`);
            distFiles.forEach(file => {
              console.log(`   - ${file}`);
            });
          }
        } catch (e) {
          console.log('⚠️ Could not check build output:', e.message);
        }
      } else {
        console.log('❌ Build: FAILED');
        console.log('Build errors:');
        console.log(buildResult.stderr);
      }
      console.log('');
    } else {
      console.log('⏭️ Skipping build test due to type errors\n');
    }

    // Step 4: Summary
    console.log('📊 Final Summary');
    console.log('================');
    console.log(`Type Check: ${typeCheckResult.code === 0 ? '✅ PASSED' : '❌ FAILED'}`);

    if (typeCheckResult.code === 0) {
      console.log('🎉 TickTick MCP Server is ready for testing!');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Test setup: node dist/index.js --setup');
      console.log('  2. Test demo mode: node dist/index.js --demo');
      console.log('  3. Publish to NPM (when ready)');
    } else {
      console.log('🔧 Please fix the type errors before proceeding.');
    }
    console.log('');

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

main();