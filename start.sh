#!/bin/bash

# CounselMate Quick Start Script
# This script helps you start both backend and frontend

echo "🚀 CounselMate Quick Start"
echo "========================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}Checking backend...${NC}"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is already running on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠ Backend is not running${NC}"
    echo "Please start the backend first:"
    echo "  cd /mnt/Storage/Projects/CounselMate"
    echo "  make run"
    echo ""
    read -p "Press Enter when backend is ready..."
fi

# Check Node.js
echo ""
echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"
else
    echo -e "${YELLOW}⚠ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check pnpm
echo ""
echo -e "${BLUE}Checking pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓ pnpm ${PNPM_VERSION} found${NC}"
else
    echo -e "${YELLOW}⚠ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

# Install dependencies
echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check .env.local
echo ""
echo -e "${BLUE}Checking environment variables...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local found${NC}"
else
    echo -e "${YELLOW}⚠ Creating .env.local...${NC}"
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Application
NEXT_PUBLIC_APP_NAME=CounselMate
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✓ .env.local created${NC}"
fi

# Start development server
echo ""
echo -e "${GREEN}🎉 Starting CounselMate Frontend...${NC}"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API is at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev
