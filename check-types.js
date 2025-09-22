#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function runTypeCheck() {
  return new Promise((resolve, reject) => {
    console.log('Running TypeScript type checking...');
    
    const tsc = spawn('npx', ['tsc', '--noEmit', '--pretty'], {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd()
    });

    let stdout = '';
    let stderr = '';

    tsc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    tsc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    tsc.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        success: code === 0
      });
    });

    tsc.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  console.log('TickTick MCP Server - TypeScript Type Checking');
  console.log('==============================================');

  try {
    const result = await runTypeCheck();
    
    if (result.success) {
      console.log('✅ No TypeScript errors found!');
      console.log('\nType checking completed successfully.');
    } else {
      console.log('❌ TypeScript errors found:');
      console.log('\nSTDOUT:');
      console.log(result.stdout);
      console.log('\nSTDERR:');
      console.log(result.stderr);
    }

    console.log('\n==============================================');
    console.log(`Exit code: ${result.code}`);
    
    process.exit(result.code);
    
  } catch (error) {
    console.error('❌ Error running type check:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}