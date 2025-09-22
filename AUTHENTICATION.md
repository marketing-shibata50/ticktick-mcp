# TickTick MCP Server Authentication Guide

## 🔑 Authentication Options

### Option 1: Demo Credentials (Quick Start)

For testing and evaluation purposes, you can use our shared demo credentials:

```bash
# Demo credentials (read-only access to demo account)
export TICKTICK_CLIENT_ID="rbCnP4Mk9YgDdpPR86"
export TICKTICK_CLIENT_SECRET="*0zQ(kyNSzVmi#jBX@D4BKn%r3*9^99G" 
export TICKTICK_REDIRECT_URI="http://localhost:3000/api/ticktick/callback"
export TICKTICK_ACCESS_TOKEN="demo_access_token_here"
export TICKTICK_REFRESH_TOKEN="demo_refresh_token_here"
```

**Demo Account Limitations:**
- ✅ Full MCP functionality testing
- ✅ Tools, Resources, Prompts testing
- ⚠️ Shared with other users
- ⚠️ Data may be reset periodically
- ❌ Not suitable for production use

### Option 2: Your Own TickTick API Credentials (Production)

For production use with your personal TickTick data:

#### Step 1: Create TickTick Developer App
1. Visit [TickTick Developer Portal](https://developer.ticktick.com/)
2. Login with your TickTick account
3. Click "Manage Apps" → "+App Name"
4. Enter app name (e.g., "My Personal MCP Server")
5. Set redirect URI to: `http://localhost:3000/callback`
6. Copy your Client ID and Client Secret

#### Step 2: Configure Environment
```bash
# Your personal credentials
export TICKTICK_CLIENT_ID="your_client_id"
export TICKTICK_CLIENT_SECRET="your_client_secret"
export TICKTICK_REDIRECT_URI="http://localhost:3000/callback"

# Run OAuth flow to get access tokens
npm run test-oauth
```

### Option 3: No-Auth Mode (Limited Functionality)

Run in demo mode without TickTick credentials:

```bash
# No authentication - returns mock data
export TICKTICK_DEMO_MODE="true"
```

**Demo Mode Features:**
- ✅ MCP protocol testing
- ✅ Tool interface validation
- ✅ Mock data responses
- ❌ No real TickTick integration
- ❌ No actual task management

## 🚀 Quick Setup Commands

### Demo Mode (Fastest)
```bash
npm install @ticktick-ecosystem/mcp-server
npx ticktick-mcp-server --demo
```

### Production Mode
```bash
npm install @ticktick-ecosystem/mcp-server
npm run setup-env  # Interactive setup
npm run test-oauth # Get access tokens
npx ticktick-mcp-server
```

## 🔐 Security Considerations

### For Demo Credentials:
- Only use for testing and evaluation
- Demo account data is shared and temporary
- No sensitive personal information

### For Personal Credentials:
- Keep your Client Secret secure
- Never share access tokens publicly
- Use environment variables, not hardcoded values
- Regularly rotate credentials if needed

### For Production Deployment:
```bash
# Secure environment variable setup
echo "TICKTICK_CLIENT_ID=your_client_id" >> .env
echo "TICKTICK_CLIENT_SECRET=your_client_secret" >> .env
chmod 600 .env  # Restrict file permissions
```

## 🎯 Recommended Approach

1. **First Time Users**: Start with demo credentials to test functionality
2. **Personal Use**: Set up your own TickTick app for real data access
3. **Enterprise/Team**: Each user creates their own TickTick app

## 🆘 Troubleshooting

### Demo Credentials Not Working
- Demo account may be temporarily unavailable
- Try personal credentials setup
- Check for API rate limits

### Personal Setup Issues
- Verify TickTick Developer Portal access
- Ensure correct redirect URI
- Check OAuth flow completion

### Production Issues
- Validate environment variables
- Test token refresh mechanism
- Monitor API rate limits

## 📞 Support

Need help with authentication setup?
- 📖 [Main README](README.md)
- 🧪 [Testing Guide](TESTING.md)
- 🐛 [Report Issues](https://github.com/your-username/ticktick-mcp-server/issues)