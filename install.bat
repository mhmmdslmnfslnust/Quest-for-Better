@echo off
echo 🎯 HabitQuest - Gamified Wellness App Installation
echo ================================================

echo.
echo 📋 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed!
    pause
    exit /b 1
)

echo.
echo 📋 Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo 🗄️ Setting up database...
cd ..\backend
call npm run db:setup
if %errorlevel% neq 0 (
    echo ❌ Database setup failed!
    pause
    exit /b 1
)

echo.
echo 🌱 Seeding database with initial data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ❌ Database seeding failed!
    pause
    exit /b 1
)

echo.
echo 📝 Creating environment file...
if not exist .env (
    copy .env.example .env
    echo ✅ Environment file created! Please configure your settings in backend\.env
) else (
    echo ⚠️  Environment file already exists.
)

echo.
echo ✅ Installation completed successfully!
echo.
echo 🚀 To start the application:
echo    1. Open two terminal windows
echo    2. Terminal 1: cd backend && npm run dev
echo    3. Terminal 2: cd frontend && npm start
echo    4. Open http://localhost:3000 in your browser
echo.
echo 🎮 Happy habit building! Your wellness adventure awaits!
pause
