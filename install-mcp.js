#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

function findProjectRoot() {
  let currentDir = process.cwd();

  while (currentDir !== path.dirname(currentDir)) {
    // Check for common project indicators
    const indicators = ['.git', 'package.json', '.claude', 'pyproject.toml', 'Cargo.toml'];
    const hasIndicator = indicators.some(indicator =>
      fs.existsSync(path.join(currentDir, indicator))
    );

    if (hasIndicator) {
      return currentDir;
    }

    currentDir = path.dirname(currentDir);
  }

  return process.cwd(); // Fallback to current directory
}

async function main() {
  console.log('🚀 TickTick MCP Server Installation Tool');
  console.log('=====================================\n');

  const projectRoot = findProjectRoot();
  console.log(`📁 Project root detected: ${projectRoot}\n`);

  const mcpJsonPath = path.join(projectRoot, '.mcp.json');
  let mcpConfig = {};

  // Load existing .mcp.json if it exists
  if (fs.existsSync(mcpJsonPath)) {
    try {
      const content = fs.readFileSync(mcpJsonPath, 'utf8');
      mcpConfig = JSON.parse(content);
      console.log('✅ Found existing .mcp.json file');
    } catch (error) {
      console.log('⚠️  Found .mcp.json but could not parse it. Creating backup...');
      fs.copyFileSync(mcpJsonPath, `${mcpJsonPath}.backup`);
      console.log(`   Backup saved as: .mcp.json.backup`);
    }
  } else {
    console.log('📝 Creating new .mcp.json file');
  }

  if (!mcpConfig.mcpServers) {
    mcpConfig.mcpServers = {};
  }

  console.log('\n🔧 TickTick MCP Server Configuration Options:');
  console.log('1. NPM Package (recommended for end users)');
  console.log('2. Demo Mode (no authentication required)');
  console.log('3. Local Development (for developers)');
  console.log('4. All of the above');

  const choice = await question('\nSelect option (1-4): ');

  const configs = {
    npm: {
      name: 'ticktick',
      config: {
        command: 'npx',
        args: ['ticktick-mcp-server-interactive']
      }
    },
    demo: {
      name: 'ticktick-demo',
      config: {
        command: 'npx',
        args: ['ticktick-mcp-server-interactive', '--demo']
      }
    },
    local: {
      name: 'ticktick-local',
      config: {
        command: 'node',
        args: [path.join(projectRoot, 'ticktick-mcp-server/dist/index.js')]
      }
    }
  };

  switch (choice) {
    case '1':
      mcpConfig.mcpServers[configs.npm.name] = configs.npm.config;
      console.log('✅ Added NPM package configuration');
      break;
    case '2':
      mcpConfig.mcpServers[configs.demo.name] = configs.demo.config;
      console.log('✅ Added demo mode configuration');
      break;
    case '3':
      const localPath = await question(`Local path (default: ${configs.local.config.args[0]}): `);
      if (localPath) {
        configs.local.config.args[0] = localPath;
      }
      mcpConfig.mcpServers[configs.local.name] = configs.local.config;
      console.log('✅ Added local development configuration');
      break;
    case '4':
      mcpConfig.mcpServers[configs.npm.name] = configs.npm.config;
      mcpConfig.mcpServers[configs.demo.name] = configs.demo.config;
      mcpConfig.mcpServers[configs.local.name] = configs.local.config;
      console.log('✅ Added all configurations');
      break;
    default:
      console.log('❌ Invalid choice. Exiting...');
      rl.close();
      return;
  }

  // Write .mcp.json
  try {
    fs.writeFileSync(mcpJsonPath, JSON.stringify(mcpConfig, null, 2));
    console.log(`\n💾 Successfully updated: ${mcpJsonPath}`);
  } catch (error) {
    console.error(`❌ Failed to write .mcp.json: ${error.message}`);
    rl.close();
    return;
  }

  // Check and update Claude settings
  const claudeDir = path.join(projectRoot, '.claude');
  const settingsPath = path.join(claudeDir, 'settings.local.json');

  if (fs.existsSync(settingsPath)) {
    console.log('\n🔍 Checking Claude Code settings...');

    try {
      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      const settings = JSON.parse(settingsContent);

      let updated = false;

      // Enable all project MCP servers
      if (!settings.enableAllProjectMcpServers) {
        settings.enableAllProjectMcpServers = true;
        updated = true;
      }

      // Add enabled servers
      if (!settings.enabledMcpjsonServers) {
        settings.enabledMcpjsonServers = [];
      }

      const newServers = Object.keys(mcpConfig.mcpServers);
      newServers.forEach(server => {
        if (!settings.enabledMcpjsonServers.includes(server)) {
          settings.enabledMcpjsonServers.push(server);
          updated = true;
        }
      });

      // Add permissions
      if (!settings.permissions) {
        settings.permissions = { allow: [], deny: [], ask: [] };
      }

      if (!settings.permissions.allow.includes('mcp__ticktick__*')) {
        settings.permissions.allow.push('mcp__ticktick__*');
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        console.log('✅ Updated Claude Code settings');
      } else {
        console.log('✅ Claude Code settings are already configured');
      }

    } catch (error) {
      console.log('⚠️  Could not update Claude Code settings automatically');
      console.log('   Please add the following to your .claude/settings.local.json:');
      console.log('   "enableAllProjectMcpServers": true,');
      console.log('   "enabledMcpjsonServers": ' + JSON.stringify(Object.keys(mcpConfig.mcpServers)));
    }
  } else {
    console.log('\n📋 Claude Code settings not found. Manual setup required:');
    console.log('   Create .claude/settings.local.json with:');
    console.log('   {');
    console.log('     "enableAllProjectMcpServers": true,');
    console.log('     "enabledMcpjsonServers": ' + JSON.stringify(Object.keys(mcpConfig.mcpServers)));
    console.log('   }');
  }

  console.log('\n🎉 Installation Complete!');
  console.log('========================');
  console.log('\nNext steps:');
  console.log('1. Start Claude Code CLI from this directory:');
  console.log(`   cd ${projectRoot}`);
  console.log('   claude');
  console.log('\n2. Test TickTick integration:');
  console.log('   "TickTick MCPサーバーが利用可能か確認して"');
  console.log('\n3. For first-time setup (if using real TickTick):');
  console.log('   npx ticktick-mcp-server-interactive --setup');
  console.log('\n4. To test with demo data:');
  console.log('   Use the ticktick-demo server configuration');

  rl.close();
}

main().catch(error => {
  console.error('❌ Installation failed:', error);
  rl.close();
  process.exit(1);
});