#!/usr/bin/env node

/**
 * TickTick OAuth Test Helper
 * This script helps you complete the OAuth flow and get access tokens
 */

import { createServer } from 'http';
import { parse } from 'url';
import { TickTickAuth } from '../dist/auth/ticktick-auth.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const config = {
  clientId: process.env.TICKTICK_CLIENT_ID,
  clientSecret: process.env.TICKTICK_CLIENT_SECRET,
  redirectUri: process.env.TICKTICK_REDIRECT_URI || 'http://localhost:3000/callback',
};

if (!config.clientId || !config.clientSecret) {
  console.error('❌ Missing TICKTICK_CLIENT_ID or TICKTICK_CLIENT_SECRET');
  console.error('Run: npm run setup-env first');
  process.exit(1);
}

const auth = new TickTickAuth(config);

// Create a simple HTTP server to handle OAuth callback
const server = createServer(async (req, res) => {
  const urlParts = parse(req.url, true);
  
  if (urlParts.pathname === '/callback') {
    const { code, error } = urlParts.query;
    
    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body>
            <h1>❌ OAuth Error</h1>
            <p>Error: ${error}</p>
            <p>Please try again.</p>
          </body>
        </html>
      `);
      return;
    }
    
    if (code) {
      try {
        console.log('\n🔄 Exchanging authorization code for tokens...');
        const tokens = await auth.exchangeCodeForToken(code);
        
        console.log('\n✅ OAuth Success!');
        console.log('📋 Add these to your .env file:');
        console.log(`TICKTICK_ACCESS_TOKEN=${tokens.access_token}`);
        console.log(`TICKTICK_REFRESH_TOKEN=${tokens.refresh_token}`);
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body>
              <h1>✅ OAuth Success!</h1>
              <p>Your TickTick MCP Server is now authenticated.</p>
              <p>Check your terminal for the access tokens.</p>
              <p>You can close this window and stop the server (Ctrl+C).</p>
            </body>
          </html>
        `);
        
        console.log('\n🎉 Authentication complete!');
        console.log('You can now stop this server (Ctrl+C) and test your MCP server.');
        
      } catch (error) {
        console.error('\n❌ Token exchange failed:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body>
              <h1>❌ Token Exchange Failed</h1>
              <p>Error: ${error.message}</p>
            </body>
          </html>
        `);
      }
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
const port = new URL(config.redirectUri).port || 3000;
server.listen(port, () => {
  console.log('🚀 TickTick OAuth Helper Started');
  console.log('===============================');
  console.log(`📡 Listening on port ${port}`);
  console.log('');
  console.log('🔗 Open this URL in your browser to authenticate:');
  console.log(auth.getAuthorizationUrl());
  console.log('');
  console.log('💡 After authentication, you\'ll get access tokens to add to your .env file');
  console.log('⏹️  Press Ctrl+C to stop this server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 OAuth helper stopped');
  server.close();
  process.exit(0);
});