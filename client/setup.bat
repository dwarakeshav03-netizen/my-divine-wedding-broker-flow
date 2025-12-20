@echo off
REM Divine Matrimony - Quick Start Setup Script (Windows)
REM This script automates the initial setup process

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     Divine Matrimony Platform - Setup Wizard                   ║
echo ║     Secure Backend Integration with MySQL & JWT                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please download from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MySQL is installed
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MySQL is not found in PATH. Ensure MySQL is installed.
    echo    You can continue setup, but will need to manually create the database.
    pause
)

echo ✓ Node.js detected
echo.

REM Step 1: Frontend Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 1: Installing Frontend Dependencies
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

REM Step 2: Backend Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 2: Installing Backend Dependencies
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend installation failed
    cd ..
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

REM Step 3: Create .env files
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 3: Creating Environment Files
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if not exist ".env" (
    copy .env.example .env
    echo ✓ Created server/.env
) else (
    echo ⊘ server/.env already exists
)

cd ..

if not exist ".env.local" (
    copy .env.example .env.local
    echo ✓ Created .env.local
) else (
    echo ⊘ .env.local already exists
)
echo.

REM Step 4: Create Database
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 4: Database Setup
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Please ensure MySQL is running and then follow these steps:
echo.
echo   1. Open MySQL Command Line or MySQL Workbench
echo   2. Run these commands:
echo.
echo      CREATE DATABASE divnematrimony CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo.
echo      (Optional: Create dedicated user)
echo      CREATE USER 'divine'@'localhost' IDENTIFIED BY 'SecurePass123!@#';
echo      GRANT ALL PRIVILEGES ON divnematrimony.* TO 'divine'@'localhost';
echo      FLUSH PRIVILEGES;
echo.
echo   3. Update server/.env with your DB credentials
echo.
pause

REM Step 5: Configure Environment
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 5: Environment Configuration
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⚠️  IMPORTANT: Update these files with your configuration:
echo.
echo   1. server/.env
echo      - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
echo      - JWT_SECRET (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo      - JWT_REFRESH_SECRET (generate another strong secret)
echo.
echo   2. .env.local
echo      - VITE_API_URL=http://localhost:5000/api/v1
echo      - VITE_GEMINI_API_KEY (if using AI features)
echo.
pause

REM Step 6: Run Migrations
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo STEP 6: Running Database Migrations
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd server
call npm run migrate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Migrations failed. Check your database configuration.
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Database migrations completed
echo.

REM Step 7: Success
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           ✅ Setup Completed Successfully!                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 To start the application, run the following commands:
echo.
echo   Terminal 1 (Backend):
echo     cd server
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     npm run dev
echo.
echo 📍 Application URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo 📚 For detailed setup guide, see: SETUP_GUIDE.md
echo.
pause
