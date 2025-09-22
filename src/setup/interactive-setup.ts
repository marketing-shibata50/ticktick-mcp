import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TickTickAuth } from '../auth/ticktick-auth.js';

export interface SetupConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string;
}

export class InteractiveSetup {
  private rl: readline.Interface;
  private configDir: string;
  private configPath: string;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.configDir = path.join(os.homedir(), '.ticktick-mcp');
    this.configPath = path.join(this.configDir, 'config.json');
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async displayWelcome() {
    console.log('\n🎉 TickTick MCP Server セットアップ');
    console.log('=====================================\n');
    console.log('このセットアップでは、TickTick APIの認証情報を設定します。');
    console.log('完了後、Claude DesktopやMCP Inspectorで実際のTickTickデータを使用できます。\n');
  }

  private async displayApiCredentialsInstructions() {
    console.log('📋 TickTick API認証情報の取得方法：');
    console.log('-----------------------------------');
    console.log('1. https://developer.ticktick.com/ にアクセス');
    console.log('2. TickTickアカウントでログイン');
    console.log('3. 右上の「Manage Apps」をクリック');
    console.log('4. 「+App Name」をクリックして新しいアプリを作成');
    console.log('5. アプリ名を入力（例：「My MCP Server」）');
    console.log('6. Client IDとClient Secretをコピー');
    console.log('7. OAuth Redirect URLを http://localhost:3000/callback に設定\n');

    const proceed = await this.question('上記の手順を完了しましたか？ (y/N): ');
    if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
      console.log('\n手順を完了してから再度実行してください。');
      process.exit(0);
    }
    console.log('');
  }

  private async collectCredentials(): Promise<SetupConfig> {
    console.log('🔑 API認証情報の入力');
    console.log('---------------------');

    const clientId = await this.question('Client ID: ');
    if (!clientId) {
      throw new Error('Client IDは必須です');
    }

    const clientSecret = await this.question('Client Secret: ');
    if (!clientSecret) {
      throw new Error('Client Secretは必須です');
    }

    const redirectUri = await this.question('Redirect URI (default: http://localhost:3000/callback): ') || 'http://localhost:3000/callback';

    return {
      clientId,
      clientSecret,
      redirectUri
    };
  }

  private async performOAuthFlow(config: SetupConfig): Promise<SetupConfig> {
    console.log('\n🔐 OAuth認証フロー');
    console.log('-------------------');

    const auth = new TickTickAuth({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri
    });

    const authUrl = auth.getAuthorizationUrl();
    console.log('\n1. 以下のURLをブラウザで開いてください：');
    console.log(`   ${authUrl}\n`);
    console.log('2. TickTickでアプリを承認');
    console.log('3. リダイレクト後のURLからauthorization codeをコピー');
    console.log('   (例: http://localhost:3000/callback?code=XXXXXX の XXXXXXの部分)\n');

    const authCode = await this.question('Authorization code: ');
    if (!authCode) {
      throw new Error('Authorization codeは必須です');
    }

    console.log('\n🔄 アクセストークンを取得中...');
    try {
      const tokens = await auth.exchangeCodeForToken(authCode);

      console.log('✅ 認証成功！');

      return {
        ...config,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      };
    } catch (error) {
      console.error('❌ 認証エラー:', error);
      throw new Error('OAuth認証に失敗しました。Client IDとClient Secretを確認してください。');
    }
  }

  private async saveConfig(config: SetupConfig) {
    console.log('\n💾 設定を保存中...');

    // Create config directory if it doesn't exist
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    // Save config to file
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));

    // Set file permissions (readable only by owner)
    fs.chmodSync(this.configPath, 0o600);

    console.log(`✅ 設定ファイルを保存しました: ${this.configPath}`);
  }

  private async displayCompletion() {
    console.log('\n🎉 セットアップ完了！');
    console.log('===================\n');
    console.log('次の手順：');
    console.log('1. TickTick MCP Serverを起動:');
    console.log('   node dist/index.js\n');
    console.log('2. Claude Code CLIで使用する場合:');
    console.log('   node install-mcp.js で自動設定\n');
    console.log('3. Claude Desktopで使用する場合:');
    console.log('   設定ファイルに以下を追加:');
    console.log('   {');
    console.log('     "mcpServers": {');
    console.log('       "ticktick": {');
    console.log('         "command": "node",');
    console.log(`         "args": ["${process.cwd()}/dist/index.js"]`);
    console.log('       }');
    console.log('     }');
    console.log('   }\n');
    console.log('4. MCP Inspectorでテスト:');
    console.log('   npx @modelcontextprotocol/inspector node dist/index.js\n');
    console.log('これで実際のTickTickデータでAI支援のタスク管理が可能になります！');
  }

  public async run(): Promise<void> {
    try {
      await this.displayWelcome();

      // Check if config already exists
      if (fs.existsSync(this.configPath)) {
        console.log('⚠️  既存の設定が見つかりました。');
        const overwrite = await this.question('設定を上書きしますか？ (y/N): ');
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
          console.log('セットアップをキャンセルしました。');
          this.rl.close();
          return;
        }
        console.log('');
      }

      await this.displayApiCredentialsInstructions();

      const credentials = await this.collectCredentials();

      const completeConfig = await this.performOAuthFlow(credentials);

      await this.saveConfig(completeConfig);

      await this.displayCompletion();

    } catch (error) {
      console.error('\n❌ セットアップエラー:', error instanceof Error ? error.message : error);
      console.log('\nエラーが発生しました。手順を確認して再度実行してください。');
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  public static loadConfig(): SetupConfig | null {
    const configDir = path.join(os.homedir(), '.ticktick-mcp');
    const configPath = path.join(configDir, 'config.json');

    if (!fs.existsSync(configPath)) {
      return null;
    }

    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.error('設定ファイルの読み込みエラー:', error);
      return null;
    }
  }

  public static hasConfig(): boolean {
    const configDir = path.join(os.homedir(), '.ticktick-mcp');
    const configPath = path.join(configDir, 'config.json');
    return fs.existsSync(configPath);
  }

  public static getConfigPath(): string {
    const configDir = path.join(os.homedir(), '.ticktick-mcp');
    return path.join(configDir, 'config.json');
  }
}