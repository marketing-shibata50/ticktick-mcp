#!/bin/bash
cd /Users/takashishibata/Desktop/creative-lab/mcp-research/ticktick-mcp-server

echo "=== Starting TypeScript Build Test ==="
echo "Current directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️ node_modules not found, installing dependencies..."
    npm install
    echo ""
fi

# Check TypeScript compiler
echo "=== Checking TypeScript Installation ==="
npx tsc --version
echo ""

# Run TypeScript compilation with verbose output
echo "=== Running TypeScript Compilation ==="
npx tsc --noEmit --listFiles | head -20
echo ""

echo "=== Checking for compilation errors ==="
npx tsc --noEmit 2>&1

echo ""
echo "=== Attempting full build ==="
npm run build 2>&1

echo ""
echo "=== Build Test Complete ==="