#!/usr/bin/env node

// Simple test script to verify demo mode functionality
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🧪 Testing TickTick MCP Server Demo Mode...\n');

// Start the server in demo mode
const server = spawn('node', ['dist/index.js', '--demo'], {
  stdio: ['pipe', 'pipe', 'inherit'],
  env: { ...process.env, TICKTICK_DEMO_MODE: 'true' }
});

// Send a simple MCP request to list tools
const mcpRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

setTimeout(1000).then(() => {
  console.log('📤 Sending tools/list request...');
  server.stdin.write(JSON.stringify(mcpRequest) + '\n');

  setTimeout(2000).then(() => {
    console.log('✅ Demo mode test completed');
    server.kill();
    process.exit(0);
  });
});

server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log('📥 Server response:', JSON.stringify(response, null, 2));
  } catch (e) {
    console.log('📥 Server output:', data.toString());
  }
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`\n🏁 Server exited with code: ${code}`);
});