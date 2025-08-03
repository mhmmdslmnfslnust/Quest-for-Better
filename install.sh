#!/bin/bash

echo "🎯 HabitQuest - Gamified Wellness App Installation"
echo "================================================"

echo ""
echo "📋 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi

echo ""
echo "📋 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi

echo ""
echo "🗄️ Setting up database..."
cd ../backend
npm run db:setup
if [ $? -ne 0 ]; then
    echo "❌ Database setup failed!"
    exit 1
fi

echo ""
echo "🌱 Seeding database with initial data..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed!"
    exit 1
fi

echo ""
echo "📝 Creating environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Environment file created! Please configure your settings in backend/.env"
else
    echo "⚠️  Environment file already exists."
fi

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "   1. Open two terminal windows"
echo "   2. Terminal 1: cd backend && npm run dev"
echo "   3. Terminal 2: cd frontend && npm start"
echo "   4. Open http://localhost:3000 in your browser"
echo ""
echo "🎮 Happy habit building! Your wellness adventure awaits!"
