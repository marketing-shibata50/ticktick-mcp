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
# Install and run in demo mode
npm install -g @ticktick-ecosystem/mcp-server
ticktick-mcp-server --demo
```

Or with npx:
```bash
npx @ticktick-ecosystem/mcp-server --demo
```

### Claude Desktop Integration (Demo Mode)

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ticktick": {
      "command": "npx",
      "args": ["@ticktick-ecosystem/mcp-server", "--demo"],
      "env": {
        "TICKTICK_DEMO_MODE": "true"
      }
    }
  }
}
```

Restart Claude Desktop and start asking about your tasks!

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