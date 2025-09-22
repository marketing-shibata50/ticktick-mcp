import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TickTickConfig } from '../types/ticktick.js';
import { InteractiveSetup, SetupConfig } from '../setup/interactive-setup.js';

export class ConfigManager {
  private static instance: ConfigManager;
  private configPath: string;
  private config: TickTickConfig | null = null;

  private constructor() {
    const configDir = os.homedir();
    this.configPath = path.join(configDir, '.ticktick-mcp', 'config.json');
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Load configuration from multiple sources in priority order:
   * 1. Environment variables
   * 2. Saved config file
   * 3. Demo mode config
   */
  public loadConfig(): TickTickConfig | null {
    // Check for demo mode first
    if (this.isDemoMode()) {
      return this.getDemoConfig();
    }

    // Try environment variables first
    const envConfig = this.loadFromEnvironment();
    if (envConfig && this.isValidConfig(envConfig)) {
      this.config = envConfig;
      return envConfig;
    }

    // Try saved config file
    const fileConfig = this.loadFromFile();
    if (fileConfig && this.isValidConfig(fileConfig)) {
      this.config = fileConfig;
      return fileConfig;
    }

    return null;
  }

  private isDemoMode(): boolean {
    return process.env.TICKTICK_DEMO_MODE === 'true' ||
           process.argv.includes('--demo') ||
           process.argv.includes('--demo-mode');
  }

  private getDemoConfig(): TickTickConfig {
    return {
      clientId: 'demo-client-id',
      clientSecret: 'demo-client-secret',
      redirectUri: 'http://localhost:3000/callback',
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    };
  }

  private loadFromEnvironment(): TickTickConfig | null {
    const clientId = process.env.TICKTICK_CLIENT_ID;
    const clientSecret = process.env.TICKTICK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return null;
    }

    return {
      clientId,
      clientSecret,
      redirectUri: process.env.TICKTICK_REDIRECT_URI || 'http://localhost:3000/callback',
      accessToken: process.env.TICKTICK_ACCESS_TOKEN,
      refreshToken: process.env.TICKTICK_REFRESH_TOKEN,
    };
  }

  private loadFromFile(): TickTickConfig | null {
    const savedConfig = InteractiveSetup.loadConfig();
    if (!savedConfig) {
      return null;
    }

    return {
      clientId: savedConfig.clientId,
      clientSecret: savedConfig.clientSecret,
      redirectUri: savedConfig.redirectUri,
      accessToken: savedConfig.accessToken,
      refreshToken: savedConfig.refreshToken,
    };
  }

  private isValidConfig(config: TickTickConfig): boolean {
    return !!(config.clientId && config.clientSecret);
  }

  public hasValidConfig(): boolean {
    const config = this.loadConfig();
    return config !== null && this.isValidConfig(config);
  }

  public hasAuthentication(): boolean {
    const config = this.loadConfig();
    return config !== null && !!(config.accessToken && config.refreshToken);
  }

  public getConfig(): TickTickConfig | null {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  public async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    const currentConfig = this.loadConfig();
    if (!currentConfig) {
      throw new Error('設定が見つかりません。まずセットアップを実行してください。');
    }

    const updatedConfig: SetupConfig = {
      clientId: currentConfig.clientId,
      clientSecret: currentConfig.clientSecret,
      redirectUri: currentConfig.redirectUri,
      accessToken,
      refreshToken
    };

    // Save to file
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(this.configPath, JSON.stringify(updatedConfig, null, 2));
    fs.chmodSync(this.configPath, 0o600); // Read/write for owner only

    // Update in-memory config
    this.config = {
      ...currentConfig,
      accessToken,
      refreshToken
    };
  }

  public getAuthenticationStatus(): {
    hasConfig: boolean;
    hasAuth: boolean;
    isDemoMode: boolean;
    configSource: 'environment' | 'file' | 'demo' | 'none';
  } {
    const isDemoMode = this.isDemoMode();
    const hasConfig = this.hasValidConfig();
    const hasAuth = this.hasAuthentication();

    let configSource: 'environment' | 'file' | 'demo' | 'none' = 'none';

    if (isDemoMode) {
      configSource = 'demo';
    } else if (process.env.TICKTICK_CLIENT_ID) {
      configSource = 'environment';
    } else if (InteractiveSetup.hasConfig()) {
      configSource = 'file';
    }

    return {
      hasConfig,
      hasAuth,
      isDemoMode,
      configSource
    };
  }

  public displayAuthenticationStatus(): void {
    const status = this.getAuthenticationStatus();

    if (status.isDemoMode) {
      console.error('🎭 TickTick MCP Server - デモモード');
      console.error('📊 モックデータを使用（実際のTickTickデータには接続されません）');
      console.error('');
      return;
    }

    if (!status.hasConfig) {
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
      return;
    }

    console.error('🚀 TickTick MCP Server起動中...');
    console.error(`📁 設定ソース: ${this.getConfigSourceName(status.configSource)}`);

    if (status.hasAuth) {
      console.error('✅ TickTick認証: 完了');
    } else {
      console.error('⚠️  TickTick認証: 必要');
      console.error('   OAuth認証を完了してください');
    }

    console.error('📡 MCP Server listening on stdio...');
    console.error('');
  }

  private getConfigSourceName(source: string): string {
    switch (source) {
      case 'environment': return '環境変数';
      case 'file': return '設定ファイル';
      case 'demo': return 'デモモード';
      default: return '不明';
    }
  }

  public getSetupInstructions(): void {
    console.error('🔧 TickTick MCP Server セットアップ');
    console.error('====================================');
    console.error('');
    console.error('次のコマンドで対話式セットアップを開始してください：');
    console.error('');
    console.error('  npx @ticktick-ecosystem/mcp-server --setup');
    console.error('');
    console.error('または、今すぐデモモードでテストしてみてください：');
    console.error('');
    console.error('  npx @ticktick-ecosystem/mcp-server --demo');
    console.error('');
  }
}