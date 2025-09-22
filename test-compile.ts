// Simple test file to check TypeScript compilation
import { TickTickMCPServer } from './src/server.js';
import { TickTickConfig } from './src/types/ticktick.js';

// Test basic imports
console.log('TypeScript imports working');

// Test config type
const testConfig: TickTickConfig = {
  clientId: 'test',
  clientSecret: 'test',
  redirectUri: 'test'
};

console.log('Config type working');

export {};