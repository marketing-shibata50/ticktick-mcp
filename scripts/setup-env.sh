#!/bin/bash

# TickTick MCP Server Environment Setup Script

echo "🚀 TickTick MCP Server Environment Setup"
echo "========================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ $overwrite != "y" && $overwrite != "Y" ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Copy example file
cp .env.example .env
echo "✅ Created .env file from template"
echo ""

# Prompt for credentials
echo "📋 Please enter your TickTick API credentials:"
echo "   (Get these from https://developer.ticktick.com/)"
echo ""

read -p "Client ID: " client_id
read -p "Client Secret: " client_secret
read -p "Redirect URI (default: http://localhost:3000/callback): " redirect_uri

# Set default redirect URI if empty
if [ -z "$redirect_uri" ]; then
    redirect_uri="http://localhost:3000/callback"
fi

# Update .env file
sed -i.bak "s/your_client_id_here/$client_id/g" .env
sed -i.bak "s/your_client_secret_here/$client_secret/g" .env
sed -i.bak "s|http://localhost:3000/callback|$redirect_uri|g" .env

# Remove backup file
rm .env.bak

echo ""
echo "✅ Environment configured successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Run: npm run dev"
echo "2. Follow the OAuth URL to authenticate"
echo "3. Test with MCP Inspector or Claude Desktop"
echo ""
echo "📖 For more info, see README.md"