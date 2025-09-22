const { exec } = require('child_process');
const path = require('path');

const projectDir = '/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server';

console.log('🔍 Simple TypeScript Type Check');
console.log('================================');

process.chdir(projectDir);
console.log(`📂 Working in: ${process.cwd()}\n`);

// Run TypeScript type check only
console.log('⚡ Running TypeScript type check (no emit)...');
exec('npx tsc --noEmit', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ TypeScript errors found:');
    console.log('---------------------------');
    console.log(stderr);
    console.log('\n📊 Error Analysis:');
    
    // Count different types of errors
    const errorLines = stderr.split('\n').filter(line => line.includes('error TS'));
    console.log(`Total errors: ${errorLines.length}`);
    
    // Group by error type
    const errorTypes = {};
    errorLines.forEach(line => {
      const match = line.match(/error TS(\d+):/);
      if (match) {
        const code = match[1];
        errorTypes[code] = (errorTypes[code] || 0) + 1;
      }
    });
    
    console.log('\nError types:');
    Object.entries(errorTypes).forEach(([code, count]) => {
      console.log(`  TS${code}: ${count} errors`);
    });
    
  } else {
    console.log('✅ No TypeScript errors found!');
    console.log('Ready to build...\n');
    
    // If no type errors, try building
    console.log('🏗️ Running full build...');
    exec('npm run build', (buildError, buildStdout, buildStderr) => {
      if (buildError) {
        console.log('❌ Build failed:');
        console.log(buildStderr);
      } else {
        console.log('✅ Build successful!');
        console.log('📦 Output:');
        console.log(buildStdout);
      }
    });
  }
});