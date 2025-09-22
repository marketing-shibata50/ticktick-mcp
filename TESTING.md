# Testing TickTick MCP Server

This guide covers how to test the TickTick MCP Server with various MCP clients.

## Prerequisites

1. Build the server:
```bash
npm run build
```

2. For testing with real TickTick data, set up your environment:
```bash
cp .env.example .env
# Edit .env with your TickTick credentials
```

## Quick Demo Test

A simple test script is included to verify functionality:

```bash
# Build and run quick demo test
npm run build
node test-demo.js
```

## Testing with MCP Inspector

MCP Inspector is the official testing tool for MCP servers.

### Install MCP Inspector
```bash
npm install -g @modelcontextprotocol/inspector
```

### Test Demo Mode (Recommended)
```bash
# Start server in demo mode - no authentication needed
TICKTICK_DEMO_MODE=true npx @modelcontextprotocol/inspector node dist/index.js --demo
```

### Test with Real Credentials
```bash
# Make sure .env is configured, then:
npx @modelcontextprotocol/inspector node dist/index.js
```

## Testing with Claude Desktop

### Configuration

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Demo Mode Configuration (Recommended for Testing)
```json
{
  "mcpServers": {
    "ticktick": {
      "command": "node",
      "args": ["/Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server/dist/index.js", "--demo"],
      "env": {
        "TICKTICK_DEMO_MODE": "true"
      }
    }
  }
}
```

#### Production Configuration
```json
{
  "mcpServers": {
    "ticktick": {
      "command": "node",
      "args": ["/path/to/ticktick-mcp-server/dist/index.js"],
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

**Note**: A sample configuration file is provided at `claude-desktop-config.json` for reference.

### Restart Claude Desktop

After updating the configuration, restart Claude Desktop to load the new MCP server.

## Available Functions

### Task Management
- `create_task` - Create a new task
- `get_tasks` - Get all tasks with filters
- `update_task` - Update an existing task
- `complete_task` - Mark a task as completed
- `delete_task` - Delete a task
- `search_tasks` - Search tasks by title/content
- `get_today_tasks` - Get today's tasks
- `get_overdue_tasks` - Get overdue tasks

### Project Management
- `create_project` - Create a new project
- `get_projects` - Get all projects
- `update_project` - Update a project
- `delete_project` - Delete a project
- `get_project_tasks` - Get tasks in a specific project

### Resources
- `ticktick://tasks/today` - Today's tasks
- `ticktick://tasks/overdue` - Overdue tasks
- `ticktick://tasks/completed` - Recently completed tasks
- `ticktick://projects/all` - All projects
- `ticktick://stats/summary` - Productivity statistics

### Prompts
- `daily_planning` - Plan your day with current tasks
- `task_breakdown` - Break down complex tasks
- `priority_analysis` - Analyze task priorities
- `weekly_review` - Review weekly progress
- `project_planning` - Plan project milestones

## Demo Mode Features

When running in demo mode (`--demo` or `TICKTICK_DEMO_MODE=true`):

- ✅ Uses mock data instead of real TickTick API
- ✅ No authentication required
- ✅ Safe for testing and demonstrations
- ✅ Includes realistic sample tasks and projects
- ✅ All functions work with mock data
- ✅ Perfect for NPM package evaluation

## Testing Examples

### Create a Task
```
Can you create a task called "Review MCP documentation" for tomorrow?
```

### Get Today's Tasks
```
What tasks do I have scheduled for today?
```

### Plan My Day
```
Can you help me plan my day using the daily_planning prompt?
```

### Search Tasks
```
Find all tasks related to "documentation"
```

### Check Resources
```
Show me my productivity statistics from the TickTick resource
```

## OAuth Setup (For Real Data)

### 1. Get TickTick API Credentials

1. Visit [TickTick Developer Portal](https://developer.ticktick.com/)
2. Login with your TickTick account
3. Click "Manage Apps" in the top right
4. Click "+App Name" to create a new app
5. Enter any app name (e.g., "My MCP Server")
6. Copy the generated Client ID and Client Secret
7. Set OAuth Redirect URL to: `http://localhost:3000/callback`

### 2. Environment Setup
```bash
# Set up environment variables
npm run setup-env
# Follow the prompts to enter your TickTick API credentials

# Build the project
npm run build
```

### 3. OAuth Authentication
```bash
# Run OAuth helper to get access tokens
npm run test-oauth
```

This will:
- Start a local server on port 3000
- Open your browser to authorize the app
- Exchange the authorization code for access tokens
- Display the tokens to add to your .env file

## Troubleshooting

### Server Won't Start
- Check that Node.js version is 18 or higher
- Verify the build completed successfully: `npm run build`
- Check environment variables are set correctly

### Authentication Issues (Real Data Mode)
- Verify your TickTick credentials in `.env`
- Check that your TickTick app has the correct redirect URI
- Try demo mode to isolate authentication issues: `--demo`

### Claude Desktop Integration
- Verify the path to `dist/index.js` is correct in the configuration
- Check Claude Desktop logs for connection errors
- Restart Claude Desktop after configuration changes
- Use the provided `claude-desktop-config.json` as a reference

### Connection Errors
- Ensure the server executable has proper permissions
- Check that all dependencies are installed: `npm install`
- Verify the MCP SDK version compatibility
- Try the simple test script: `node test-demo.js`

### Demo Mode Not Working
- Ensure `TICKTICK_DEMO_MODE=true` is set in environment
- Or use the `--demo` command line flag
- Check that mock data is loading properly in console output

## API Rate Limits

TickTick API has rate limits:
- Be mindful of request frequency
- Implement proper error handling for rate limit responses
- Consider caching for frequently accessed data

## Next Steps

After successful testing:
1. ✅ All tools work correctly
2. ✅ Resources return proper data
3. ✅ Prompts generate helpful content
4. ✅ Claude Desktop integration works
5. ✅ Ready for NPM publication

## Support

- 📖 [Main README](README.md)
- 🔛 [Authentication Guide](AUTHENTICATION.md)
- 🐛 Issue Tracker (will be available after GitHub repository creation)
- 💬 Discussions (will be available after GitHub repository creation)