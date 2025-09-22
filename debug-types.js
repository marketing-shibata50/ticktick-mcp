const fs = require('fs');
const path = require('path');

console.log('TypeScript Files Analysis');
console.log('========================');

// Function to read and analyze TypeScript files
function analyzeTypeScriptFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\n📁 ${filePath}`);
    console.log(`Lines: ${lines.length}`);
    
    // Check for imports
    const imports = lines.filter(line => line.trim().startsWith('import'));
    if (imports.length > 0) {
      console.log('Imports:');
      imports.forEach(imp => console.log(`  ${imp.trim()}`));
    }
    
    // Check for exports
    const exports = lines.filter(line => line.trim().startsWith('export'));
    if (exports.length > 0) {
      console.log('Exports:');
      exports.slice(0, 5).forEach(exp => console.log(`  ${exp.trim()}`));
      if (exports.length > 5) {
        console.log(`  ... and ${exports.length - 5} more`);
      }
    }
    
    // Check for interface definitions
    const interfaces = lines.filter(line => line.trim().startsWith('export interface') || line.trim().startsWith('interface'));
    if (interfaces.length > 0) {
      console.log('Interfaces:');
      interfaces.forEach(int => console.log(`  ${int.trim()}`));
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error reading ${filePath}: ${error.message}`);
    return false;
  }
}

// List of files to analyze
const filesToAnalyze = [
  'src/types/ticktick.ts',
  'src/types/api-interface.ts', 
  'src/auth/ticktick-api.ts',
  'src/demo/mock-data.ts',
  'src/server.ts',
  'src/index.ts'
];

// Analyze each file
filesToAnalyze.forEach(file => {
  if (fs.existsSync(file)) {
    analyzeTypeScriptFile(file);
  } else {
    console.log(`❌ File not found: ${file}`);
  }
});

console.log('\n========================');
console.log('Analysis complete');