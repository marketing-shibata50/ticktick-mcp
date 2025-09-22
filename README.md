# @ticktick-ecosystem/mcp-server

A Model Context Protocol (MCP) server for integrating TickTick task management with AI applications like Claude, ChatGPT, and other LLM-powered tools.

[![npm version](https://badge.fury.io/js/%40ticktick-ecosystem%2Fmcp-server.svg)](https://badge.fury.io/js/%40ticktick-ecosystem%2Fmcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

## ✨ Features

### 🛠️ Tools (AI Actions)
- **Task Management**
  - `create_task` - Create new tasks with due dates, priorities, and projects
  - `get_tasks` - Retrieve tasks with filtering options
  - `update_task` - Modify existing tasks
  - `complete_task` - Mark tasks as completed
  - `delete_task` - Remove tasks
  - `search_tasks` - Search tasks by title or content
  - `get_today_tasks` - Get today's scheduled tasks
  - `get_overdue_tasks` - Get overdue tasks

- **Project Management**
  - `get_projects` - List all projects
  - `create_project` - Create new projects
  - `update_project` - Modify project details
  - `delete_project` - Remove projects
  - `get_project_tasks` - Get tasks within a specific project

### 📊 Resources (Data Access)
- `ticktick://tasks/today` - Today's tasks
- `ticktick://tasks/overdue` - Overdue tasks
- `ticktick://tasks/completed` - Recently completed tasks
- `ticktick://projects/all` - All projects
- `ticktick://stats/summary` - Productivity statistics

### 💡 Prompts (AI Assistance)
- `daily_planning` - AI-powered daily task planning
- `task_breakdown` - Break complex tasks into subtasks
- `priority_analysis` - Analyze and suggest task priorities
- `weekly_review` - Review productivity and plan ahead
- `project_planning` - Comprehensive project planning

## 🚀 Quick Start

### Demo Mode (No Authentication Required)

Perfect for testing and evaluation:

```bash
# Clone and set up
git clone https://github.com/marketing-shibata50/ticktick-mcp.git
cd ticktick-mcp/ticktick-mcp-server
npm install
npm run build

# Run in demo mode
node dist/index.js --demo
```

### Claude Code CLI Integration (Demo Mode)

```bash
# Auto-configure for Claude Code CLI
node install-mcp.js
# Select "Demo Mode" option

# Start Claude Code CLI in your project
cd /your/project/directory
claude
```

### Claude Desktop Integration (Demo Mode)

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ticktick-demo": {
      "command": "node",
      "args": ["/FULL/PATH/TO/ticktick-mcp-server/dist/index.js", "--demo"]
    }
  }
}
```

Restart Claude Desktop and start asking about your tasks!

## 🛠️ Step-by-Step Installation Guide

Choose your preferred installation method based on your use case:

### 🎯 Method A: Git Clone Installation (Recommended for Developers)

Perfect for customization, development, or local modifications:

#### Step 1: Clone Repository and Setup
```bash
# 1. Clone the repository
git clone https://github.com/marketing-shibata50/ticktick-mcp.git

# 2. Navigate to the directory
cd ticktick-mcp/ticktick-mcp-server

# 3. Install dependencies and build
npm install
npm run build
```

#### Step 2: Get TickTick API Credentials
1. Visit [TickTick Developer Portal](https://developer.ticktick.com/)
2. Login with your TickTick account
3. Click "Manage Apps" → "+App Name"
4. Enter app name (e.g., "My Personal MCP Server")
5. Set redirect URI to: `http://localhost:3000/callback`
6. Copy your **Client ID** and **Client Secret**

#### Step 3: Production Setup (Real TickTick Data)
```bash
# 4. Run production setup (NOT demo mode)
node dist/index.js --setup
```

**Important**: Do NOT use `--demo` flag for production!

The interactive setup will:
1. **Prompt for API credentials** (Client ID & Secret from Step 2)
2. **Start OAuth server** on `http://localhost:3000`
3. **Open browser** for TickTick authorization
4. **Exchange authorization code** for access tokens
5. **Save configuration** to `~/.ticktick-mcp/config.json`

**Expected Output:**
```
🔧 TickTick MCP Server セットアップを開始します...
📋 TickTick API認証情報の取得方法：
Client ID を入力してください: [your_client_id]
Client Secret を入力してください: [your_client_secret]
🚀 OAuth認証を開始します...
🌐 ブラウザが開きます: http://localhost:3000
✅ 認証完了！設定が保存されました
```

#### Step 4: Test Production Installation
```bash
# 5. Test with real TickTick data
node dist/index.js
# or
npm start
```

**Verification Commands:**
```bash
# Check if configuration exists
ls ~/.ticktick-mcp/config.json

# View saved configuration
cat ~/.ticktick-mcp/config.json

# Test MCP server connection
npx @modelcontextprotocol/inspector node dist/index.js
```

**Expected Behavior:**
- ✅ No authentication errors
- ✅ Connects to your real TickTick account
- ✅ Shows actual tasks and projects

#### Step 5: Claude Code CLI Setup (Automatic)
```bash
# 7. Auto-configure Claude Code CLI
node install-mcp.js
```

This will:
- ✅ Create `.mcp.json` in your project root
- ✅ Set up correct local paths automatically
- ✅ Offer production and demo mode options
- ✅ Handle all Claude Code CLI configuration

**For Claude Desktop users**, add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ticktick": {
      "command": "node",
      "args": ["/FULL/PATH/TO/ticktick-mcp-server/dist/index.js"]
    }
  }
}
```

#### Step 6: Start Using with Claude Code CLI
```bash
# 8. Start Claude Code CLI in your project
cd /your/project/directory
claude
```

**Test with natural language:**
- "Show me my TickTick tasks for today"
- "Create a new task: Review quarterly budget"
- "What are my overdue tasks?"
- "Show me all projects"

🎉 **You're now managing real TickTick data with AI!**

**For Claude Desktop users:**
1. Restart Claude Desktop
2. Use the same natural language commands

**Mode Summary:**
| Mode | Command | Data Source | Use Case |
|------|---------|-------------|----------|
| **Production** | `node dist/index.js` | Your real TickTick | Daily use |
| **Demo** | `node dist/index.js --demo` | Mock data | Testing only |

---

### 🚀 Method B: Direct Download (Alternative)

Alternative method if you don't want to use git:

#### Step 1: Download Source
```bash
# 1. Download and extract
curl -L https://github.com/marketing-shibata50/ticktick-mcp/archive/main.zip -o ticktick-mcp.zip
unzip ticktick-mcp.zip
cd ticktick-mcp-main/ticktick-mcp-server
```

#### Step 2-6: Same as Method A
Follow Steps 2-6 from Method A (Git Clone Installation)

---

### 🎭 Method C: Demo Mode (No Authentication)

Perfect for testing and evaluation:

#### Step 1: Quick Demo
```bash
# 1. Install and run demo instantly
npx @ticktick-ecosystem/mcp-server --demo
```

#### Step 2: Claude Desktop Demo Setup
```json
{
  "mcpServers": {
    "ticktick-demo": {
      "command": "npx",
      "args": ["@ticktick-ecosystem/mcp-server", "--demo"],
      "env": {
        "TICKTICK_DEMO_MODE": "true"
      }
    }
  }
}
```

#### Step 3: Test Features
1. Restart Claude Desktop
2. Try: "Show me demo tasks"
3. Test all features with mock data
4. 🎯 **Evaluate before setting up real authentication**

---

## 🔧 Post-Installation Verification

### Verify Installation
```bash
# Check version (from ticktick-mcp-server directory)
node dist/index.js --version

# Test MCP connection
npx @modelcontextprotocol/inspector node dist/index.js --demo
```

### Common Setup Commands
```bash
# Re-run production setup if needed
node dist/index.js --setup

# Test production mode (real data)
node dist/index.js

# Test demo mode (mock data)
node dist/index.js --demo

# View saved configuration
cat ~/.ticktick-mcp/config.json

# Check version
node dist/index.js --version
```

### 🔍 Production vs Demo Quick Reference

#### Production Mode (Real TickTick Data)
```bash
# Setup once (from project directory)
node dist/index.js --setup

# Daily usage
node dist/index.js

# Claude Desktop config
{
  "mcpServers": {
    "ticktick": {
      "command": "node",
      "args": ["/FULL/PATH/TO/ticktick-mcp-server/dist/index.js"]
    }
  }
}
```

#### Demo Mode (Mock Data - Testing Only)
```bash
# No setup needed (from project directory)
node dist/index.js --demo

# Claude Desktop config
{
  "mcpServers": {
    "ticktick-demo": {
      "command": "node",
      "args": ["/FULL/PATH/TO/ticktick-mcp-server/dist/index.js", "--demo"]
    }
  }
}
```

**⚠️ Important**:
- **Production**: Uses your real TickTick account data
- **Demo**: Uses fake test data for evaluation only

## 📦 Installation

```bash
npm install @ticktick-ecosystem/mcp-server
```

Or install globally:
```bash
npm install -g @ticktick-ecosystem/mcp-server
```

## 🔧 Authentication Setup (For Real Data)

### 1. Get TickTick API Credentials

1. Visit [TickTick Developer Portal](https://developer.ticktick.com/)
2. Create a new application
3. Note your Client ID and Client Secret
4. Set OAuth Redirect URL to: `http://localhost:3000/callback`

### 2. Environment Configuration

Create a `.env` file or set environment variables:

```bash
# Required
TICKTICK_CLIENT_ID=your_client_id_here
TICKTICK_CLIENT_SECRET=your_client_secret_here

# Optional (will be obtained through OAuth if not provided)
TICKTICK_REDIRECT_URI=http://localhost:3000/callback
TICKTICK_ACCESS_TOKEN=your_access_token_here
TICKTICK_REFRESH_TOKEN=your_refresh_token_here
```

### 3. Interactive Setup (Recommended)

```bash
# Install the package
npm install -g @ticktick-ecosystem/mcp-server

# Run interactive setup
npx @ticktick-ecosystem/mcp-server --setup
```

This will guide you through:
1. Getting TickTick API credentials
2. OAuth authorization flow
3. Automatic configuration saving to `~/.ticktick-mcp/config.json`

## 🎯 Usage Examples

### Creating Tasks with AI

```
User: "Create a task to review the quarterly budget report, due next Friday with high priority"

AI Response: "I'll create that task for you with high priority and set the due date for next Friday."

Result: New task created in TickTick with proper priority and due date
```

### Daily Planning

```
User: "Help me plan my day"

AI Response: Based on your current tasks, I recommend:
1. Morning: Focus on the quarterly budget review (high priority)
2. Afternoon: Team meeting preparation
3. Evening: Code review for the new feature

Would you like me to adjust any task priorities or deadlines?
```

### Project Management

```
User: "Show me all tasks in my 'Website Redesign' project that are overdue"

AI Response: [Lists overdue tasks with details and suggests next actions]
```

## 🔧 Configuration

### Demo Mode Features
- ✅ No authentication required
- ✅ Uses realistic mock data
- ✅ All functions work with sample tasks and projects
- ✅ Perfect for testing and evaluation
- ✅ Safe for public demonstrations

### Production Mode Features
- 🔄 Real-time TickTick synchronization
- 🔐 OAuth 2.0 secure authentication
- 📊 Access to your actual tasks and projects
- 🔄 Automatic token refresh
- 📈 Real productivity statistics

### Claude Desktop Configuration (Production)

```json
{
  "mcpServers": {
    "ticktick": {
      "command": "npx",
      "args": ["@ticktick-ecosystem/mcp-server"],
      "env": {
        "TICKTICK_CLIENT_ID": "your_client_id",
        "TICKTICK_CLIENT_SECRET": "your_client_secret",
        "TICKTICK_ACCESS_TOKEN": "your_access_token",
        "TICKTICK_REFRESH_TOKEN": "your_refresh_token"
      }
    }
  }
}
```

### Other MCP Clients

The server uses stdio transport and is compatible with any MCP-compliant client:

```bash
# For MCP Inspector
npx @modelcontextprotocol/inspector npx @ticktick-ecosystem/mcp-server --demo

# For custom integrations
npx @ticktick-ecosystem/mcp-server
```

## 📊 API Reference

### Task Priority Levels
- `0` - None
- `1` - Low
- `3` - Medium
- `5` - High

### Date Formats
- Due dates: ISO format (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss`)
- All dates are in UTC unless timezone is specified

### Response Format
All tools return structured responses:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error description"
}
```

## 🧪 Testing

```bash
# Quick demo test
npm run demo

# With MCP Inspector
npm install -g @modelcontextprotocol/inspector
npx @modelcontextprotocol/inspector npx @ticktick-ecosystem/mcp-server --demo
```

See [TESTING.md](TESTING.md) for comprehensive testing instructions.

## 🔒 Security & Privacy

- OAuth 2.0 secure authentication
- Tokens stored locally only
- No data collection or telemetry
- Open source and auditable
- Demo mode uses no real data

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/ticktick-ecosystem/mcp-server
cd mcp-server

# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Run tests
npm test

# Demo mode
npm run demo
```

## 📖 Documentation

- [Authentication Guide](AUTHENTICATION.md) - Detailed authentication setup
- [Testing Guide](TESTING.md) - Comprehensive testing instructions
- [MCP Protocol](https://modelcontextprotocol.io/) - Learn about Model Context Protocol
- [TickTick API](https://developer.ticktick.com/) - Official TickTick API documentation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/ticktick-ecosystem/mcp-server#readme)
- 🐛 [Issue Tracker](https://github.com/ticktick-ecosystem/mcp-server/issues)
- 💬 [Discussions](https://github.com/ticktick-ecosystem/mcp-server/discussions)

## 🌟 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [TickTick](https://ticktick.com/) - The task management platform
- [Claude Desktop](https://claude.ai/desktop) - AI assistant with MCP support
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Tool for testing MCP servers

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com/) for developing the Model Context Protocol
- [TickTick](https://ticktick.com/) for providing the task management API
- The MCP community for feedback and contributions

---

**Made with ❤️ for the TickTick and MCP communities**

🎉 **Ready to supercharge your productivity with AI-powered task management!**