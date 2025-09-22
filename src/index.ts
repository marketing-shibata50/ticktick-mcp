#!/usr/bin/env node

import { TickTickMCPServer } from './server.js';
import { TickTickConfig } from './types/ticktick.js';
import { ConfigManager } from './config/config-manager.js';
import { InteractiveSetup } from './setup/interactive-setup.js';

async function main() {
  // Check for version command
  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    console.log('1.0.0');
    return;
  }

  // Check for setup command
  if (process.argv.includes('--setup') || process.argv.includes('--configure')) {
    console.error('🔧 TickTick MCP Server セットアップを開始します...\n');
    const setup = new InteractiveSetup();
    await setup.run();
    return;
  }

  // Check for demo mode
  const isDemoMode = process.env.TICKTICK_DEMO_MODE === 'true' ||
                    process.argv.includes('--demo') ||
                    process.argv.includes('--demo-mode');

  if (isDemoMode) {
    console.error('🎭 TickTick MCP Server - デモモード起動中...');
    console.error('📊 モックデータを使用（実際のTickTickデータには接続されません）');
    console.error('');

    const demoConfig: TickTickConfig = {
      clientId: 'demo-client-id',
      clientSecret: 'demo-client-secret',
      redirectUri: 'http://localhost:3000/callback',
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    };

    const server = new TickTickMCPServer(demoConfig, true); // true = demo mode
    console.error('✅ デモモード: 準備完了');
    console.error('📡 MCP Server listening on stdio...');
    console.error('');

    await server.start();
    return;
  }

  // Use ConfigManager to load configuration
  const configManager = ConfigManager.getInstance();
  const config = configManager.loadConfig();

  if (!config) {
    console.error('❌ TickTick設定が見つかりません！');
    console.error('');
    console.error('設定を行うには以下のいずれかを実行してください：');
    console.error('');
    console.error('1. 対話式セットアップ（推奨）:');
    console.error('   npx @ticktick-ecosystem/mcp-server --setup');
    console.error('');
    console.error('2. 環境変数設定:');
    console.error('   export TICKTICK_CLIENT_ID="your_client_id"');
    console.error('   export TICKTICK_CLIENT_SECRET="your_client_secret"');
    console.error('');
    console.error('3. デモモードでテスト:');
    console.error('   npx @ticktick-ecosystem/mcp-server --demo');
    console.error('');
    process.exit(1);
  }

  try {
    // Display configuration status
    configManager.displayAuthenticationStatus();

    const server = new TickTickMCPServer(config);

    await server.start();
  } catch (error) {
    console.error('❌ TickTick MCP Server起動エラー:', error);
    console.error('');
    console.error('エラーが発生しました。以下を確認してください：');
    console.error('- 設定ファイルの内容');
    console.error('- ネットワーク接続');
    console.error('- TickTick API認証情報');
    console.error('');
    console.error('再セットアップが必要な場合：');
    console.error('  npx @ticktick-ecosystem/mcp-server --setup');
    console.error('');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('\n🛑 TickTick MCP Server を終了しています...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('\n🛑 TickTick MCP Server を終了しています...');
  process.exit(0);
});

main().catch((error) => {
  console.error('💥 未処理エラー:', error);
  console.error('');
  console.error('問題が継続する場合は、セットアップを再実行してください：');
  console.error('  npx @ticktick-ecosystem/mcp-server --setup');
  console.error('');
  process.exit(1);
});