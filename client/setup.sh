#!/bin/bash

# Divine Matrimony - Quick Start Setup Script (Linux/Mac)
# This script automates the initial setup process

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Divine Matrimony Platform - Setup Wizard                   ║"
echo "║     Secure Backend Integration with MySQL & JWT                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please download from https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not found in PATH. Ensure MySQL is installed."
    read -p "Press enter to continue..."
fi

echo "✓ Node.js detected ($(node -v))"
echo ""

# Step 1: Frontend Setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Installing Frontend Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

# Step 2: Backend Setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Installing Backend Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd server || exit
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    cd ..
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""
cd ..

# Step 3: Create .env files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Creating Environment Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "✓ Created server/.env"
else
    echo "⊘ server/.env already exists"
fi

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✓ Created .env.local"
else
    echo "⊘ .env.local already exists"
fi
echo ""

# Step 4: Database Instructions
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Database Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Please ensure MySQL is running and then follow these steps:"
echo ""
echo "  1. Open Terminal and run:"
echo ""
echo "     mysql -u root -p"
echo ""
echo "  2. Run these commands:"
echo ""
echo "     CREATE DATABASE divnematrimony CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo ""
echo "     (Optional: Create dedicated user)"
echo "     CREATE USER 'divine'@'localhost' IDENTIFIED BY 'SecurePass123!@#';"
echo "     GRANT ALL PRIVILEGES ON divnematrimony.* TO 'divine'@'localhost';"
echo "     FLUSH PRIVILEGES;"
echo ""
echo "  3. Update server/.env with your DB credentials"
echo ""
read -p "Press enter when database is ready..."

# Step 5: Configure Environment
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 5: Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: Update these files with your configuration:"
echo ""
echo "  1. server/.env"
echo "     - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD"
echo "     - JWT_SECRET (generate: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
echo "     - JWT_REFRESH_SECRET (generate another strong secret)"
echo ""
echo "  2. .env.local"
echo "     - VITE_API_URL=http://localhost:5000/api/v1"
echo "     - VITE_GEMINI_API_KEY (if using AI features)"
echo ""
read -p "Press enter after updating .env files..."

# Step 6: Run Migrations
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 6: Running Database Migrations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd server || exit
npm run migrate
if [ $? -ne 0 ]; then
    echo "❌ Migrations failed. Check your database configuration."
    cd ..
    exit 1
fi
cd ..
echo "✓ Database migrations completed"
echo ""

# Step 7: Success
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           ✅ Setup Completed Successfully!                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the application, run the following commands:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd server"
echo "    npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    npm run dev"
echo ""
echo "📍 Application URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "📚 For detailed setup guide, see: SETUP_GUIDE.md"
echo ""
