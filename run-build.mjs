import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        success: code === 0
      });
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('TickTick MCP Server - Build Test');
  console.log('=================================');

  try {
    // Check TypeScript first
    console.log('\n1. TypeScript type checking...');
    const typeResult = await runCommand('npx', ['tsc', '--noEmit']);
    
    if (!typeResult.success) {
      console.log('\n❌ TypeScript type errors found!');
      console.log('Fix these errors before proceeding with build.');
      return;
    }

    console.log('✅ TypeScript type checking passed');

    // Build the project
    console.log('\n2. Building project...');
    const buildResult = await runCommand('npx', ['tsc']);
    
    if (buildResult.success) {
      console.log('\n✅ Build completed successfully!');
      
      // Check dist directory
      try {
        const distFiles = await fs.readdir('dist');
        console.log('\n📁 Built files:', distFiles);
      } catch (error) {
        console.log('Note: Could not read dist directory');
      }
    } else {
      console.log('\n❌ Build failed!');
    }

  } catch (error) {
    console.error('\n💥 Error:', error.message);
  }
}

main();