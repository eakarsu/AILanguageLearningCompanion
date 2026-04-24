#!/bin/bash

echo "============================================="
echo "   LinguaAI - AI Language Learning Companion"
echo "============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo -e "${GREEN}[OK]${NC} Environment variables loaded"
else
  echo -e "${RED}[ERROR]${NC} .env file not found!"
  exit 1
fi

SERVER_PORT=${PORT:-3001}
CLIENT_PORT=${CLIENT_PORT:-3000}

# Function to kill processes on ports
cleanup_ports() {
  echo -e "${YELLOW}[CLEANUP]${NC} Checking for processes on ports $SERVER_PORT and $CLIENT_PORT..."

  # Kill process on server port
  PID=$(lsof -ti:$SERVER_PORT 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo -e "${YELLOW}[CLEANUP]${NC} Killing process on port $SERVER_PORT (PID: $PID)"
    kill -9 $PID 2>/dev/null
    sleep 1
  fi

  # Kill process on client port
  PID=$(lsof -ti:$CLIENT_PORT 2>/dev/null)
  if [ ! -z "$PID" ]; then
    echo -e "${YELLOW}[CLEANUP]${NC} Killing process on port $CLIENT_PORT (PID: $PID)"
    kill -9 $PID 2>/dev/null
    sleep 1
  fi

  echo -e "${GREEN}[OK]${NC} Ports cleaned up"
}

# Function to check if PostgreSQL is running
check_postgres() {
  echo -e "${BLUE}[CHECK]${NC} Checking PostgreSQL..."
  if command -v pg_isready &> /dev/null; then
    pg_isready -q
    if [ $? -ne 0 ]; then
      echo -e "${YELLOW}[INFO]${NC} Starting PostgreSQL..."
      if command -v brew &> /dev/null; then
        brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null
      fi
      sleep 2
    fi
  fi
  echo -e "${GREEN}[OK]${NC} PostgreSQL check complete"
}

# Function to create database if not exists
setup_database() {
  echo -e "${BLUE}[DB]${NC} Setting up database..."
  createdb language_learning 2>/dev/null
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}[OK]${NC} Database 'language_learning' created"
  else
    echo -e "${YELLOW}[INFO]${NC} Database 'language_learning' already exists"
  fi
}

# Cleanup ports first
cleanup_ports

# Check PostgreSQL
check_postgres

# Setup database
setup_database

# Install dependencies
echo ""
echo -e "${BLUE}[INSTALL]${NC} Installing server dependencies..."
npm install 2>&1 | tail -1

echo -e "${BLUE}[INSTALL]${NC} Installing client dependencies..."
cd client && npm install 2>&1 | tail -1
cd ..

# Seed the database
echo ""
echo -e "${BLUE}[SEED]${NC} Seeding database with sample data..."
node server/seed.js
echo ""

# Start the application with hot reload
echo -e "${GREEN}============================================="
echo -e "   Starting LinguaAI Application"
echo -e "=============================================${NC}"
echo ""
echo -e "${GREEN}[SERVER]${NC} Backend running on http://localhost:$SERVER_PORT (with nodemon hot reload)"
echo -e "${GREEN}[CLIENT]${NC} Frontend running on http://localhost:$CLIENT_PORT (with React hot reload)"
echo ""
echo -e "${YELLOW}[LOGIN]${NC} Demo credentials:"
echo -e "   Email:    demo@linguaai.com"
echo -e "   Password: password123"
echo ""
echo -e "${BLUE}[TIP]${NC} Click 'Auto-Fill Demo Credentials' button on login page"
echo ""

# Start both server (with nodemon for hot reload) and client concurrently
npx concurrently \
  --names "SERVER,CLIENT" \
  --prefix-colors "blue,green" \
  "npx nodemon --watch server server/index.js" \
  "cd client && PORT=$CLIENT_PORT BROWSER=none npx react-scripts start"
