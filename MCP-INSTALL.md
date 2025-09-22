# TickTick MCP Server - Claude Code CLI Integration

## 🚀 Quick Install

### Method 1: Git Clone Installation (Recommended)

```bash
# Clone repository
git clone https://github.com/marketing-shibata50/ticktick-mcp.git
cd ticktick-mcp/ticktick-mcp-server

# Install dependencies and build
npm install
npm run build

# Run automatic setup
node install-mcp.js
```

This will:
- ✅ Clone the complete project with all dependencies
- ✅ Build from source for maximum compatibility
- ✅ Run interactive setup wizard
- ✅ Configure `.mcp.json` and Claude Code CLI settings

### Method 2: NPM Installation

```bash
# Install and configure TickTick MCP for Claude Code CLI
npx ticktick-mcp-install
```

**Note**: NPM installation may have dependency issues. Git clone method is more reliable.

### Method 3: Manual Installation

1. **Create `.mcp.json` in your project root:**

```json
{
  "mcpServers": {
    "ticktick": {
      "command": "npx",
      "args": ["ticktick-mcp-server-interactive"]
    },
    "ticktick-demo": {
      "command": "npx",
      "args": ["ticktick-mcp-server-interactive", "--demo"]
    }
  }
}
```

2. **Update `.claude/settings.local.json`:**

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["ticktick", "ticktick-demo"],
  "permissions": {
    "allow": ["mcp__ticktick__*"]
  }
}
```

## 🎯 Usage

### Start Claude Code CLI

```bash
cd your-project-directory
claude
```

### Test TickTick Integration

```
TickTick MCPサーバーが利用可能か確認して
```

### TickTick Commands

```
今日のタスクを表示して
新しいタスク「コードレビュー」を追加して
プロジェクト一覧を見せて
期限切れのタスクを確認して
```

## 🔧 Configuration Options

### 1. NPM Package (Production)
```json
{
  "ticktick": {
    "command": "npx",
    "args": ["ticktick-mcp-server-interactive"]
  }
}
```

### 2. Demo Mode (No Authentication)
```json
{
  "ticktick-demo": {
    "command": "npx",
    "args": ["ticktick-mcp-server-interactive", "--demo"]
  }
}
```

### 3. Local Development
```json
{
  "ticktick-local": {
    "command": "node",
    "args": ["/path/to/ticktick-mcp-server/dist/index.js"]
  }
}
```

## 🛠️ First-Time Setup

### For Real TickTick Integration

```bash
# Setup authentication (only needed once)
npx ticktick-mcp-server-interactive --setup
```

### For Demo/Testing

Use the `ticktick-demo` configuration - no setup required!

## 📋 Troubleshooting

### MCP Server Not Recognized

1. Check `.mcp.json` syntax
2. Restart Claude Code CLI
3. Verify settings in `.claude/settings.local.json`

### Authentication Issues

```bash
# Re-run setup
npx ticktick-mcp-server-interactive --setup
```

### Test Commands

```bash
# Test NPM package
npx ticktick-mcp-server-interactive --version

# Test demo mode
npx ticktick-mcp-server-interactive --demo
```

## 🎉 Success!

Once installed, you can manage your TickTick tasks directly from Claude Code CLI using natural language!