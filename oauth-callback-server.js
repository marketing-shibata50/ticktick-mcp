#!/usr/bin/env node

import http from 'http';
import url from 'url';

console.log('🚀 TickTick OAuth コールバックサーバーを起動中...');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/callback' || parsedUrl.pathname === '/api/ticktick/callback') {
    const { code, error } = parsedUrl.query;

    if (error) {
      res.writeHead(400, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`
        <html>
          <head><title>認証エラー</title></head>
          <body style="font-family: Arial, sans-serif; margin: 50px; text-align: center;">
            <h1>❌ 認証エラー</h1>
            <p>エラー: ${error}</p>
            <p>ブラウザを閉じて、セットアップを再実行してください。</p>
          </body>
        </html>
      `);
      return;
    }

    if (code) {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`
        <html>
          <head><title>認証成功</title></head>
          <body style="font-family: Arial, sans-serif; margin: 50px; text-align: center;">
            <h1>✅ 認証成功！</h1>
            <div style="background: #f0f0f0; padding: 20px; margin: 20px; border-radius: 8px;">
              <h3>認証コード:</h3>
              <code style="background: white; padding: 10px; display: block; margin: 10px; font-size: 14px; word-break: break-all;">${code}</code>
            </div>
            <p>このコードをターミナルにコピー&ペーストしてください。</p>
            <p>完了後、このブラウザを閉じてください。</p>
          </body>
        </html>
      `);

      console.log('✅ 認証コードを受信しました!');
      console.log('📋 認証コード:', code);
      console.log('');
      console.log('👆 このコードをターミナルの入力プロンプトにペーストしてください');
      return;
    }
  }

  // その他のリクエスト
  res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(`
    <html>
      <head><title>TickTick OAuth Callback</title></head>
      <body style="font-family: Arial, sans-serif; margin: 50px; text-align: center;">
        <h1>🔗 TickTick OAuth Callback Server</h1>
        <p>このサーバーはTickTick認証用です。</p>
        <p>ブラウザでTickTick認証を完了してください。</p>
      </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`📡 OAuth コールバックサーバーが起動しました`);
  console.log(`🌐 URL: http://localhost:${PORT}/callback`);
  console.log(`🌐 URL: http://localhost:${PORT}/api/ticktick/callback`);
  console.log('');
  console.log('✨ 準備完了！別のターミナルで以下を実行してください:');
  console.log('   node dist/index.js --setup');
  console.log('');
  console.log('⏹️  終了するには Ctrl+C を押してください');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 サーバーを終了しています...');
  server.close(() => {
    console.log('✅ サーバーが正常に終了しました');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 サーバーを終了しています...');
  server.close(() => {
    console.log('✅ サーバーが正常に終了しました');
    process.exit(0);
  });
});