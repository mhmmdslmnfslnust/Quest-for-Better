# HabitQuest Deployment Guide

## Overview
This is a full-stack application with:
- **Frontend**: React application (port 3000 in development)
- **Backend**: Node.js/Express API with SQLite database (port 3001 in development)

## Deployment Options

### Option 1: Vercel (Full-stack - Recommended)

#### Prerequisites
1. Push your code to GitHub
2. Create a Vercel account at https://vercel.com
3. Connect your GitHub repository to Vercel

#### Step-by-step Deployment

1. **Import Project to Vercel**
   - Go to Vercel dashboard
   - Click "New Project" 
   - Import your GitHub repository

2. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-for-production
   REACT_APP_API_URL=https://your-app-name.vercel.app/api
   ```

3. **Deploy**
   - Vercel will automatically build and deploy your app
   - The `vercel.json` configuration file handles routing between frontend and backend

#### Important Notes
- SQLite database will be ephemeral on Vercel (resets on each deployment)
- For production, consider upgrading to PostgreSQL using Vercel's database add-on

### Option 2: Separate Deployments

#### Backend Options
- **Railway**: Easy deployment with persistent database
- **Render**: Free tier with PostgreSQL support  
- **Heroku**: Classic choice (requires credit card for free tier)

#### Frontend Options
- **Vercel**: Excellent for React apps
- **Netlify**: Great alternative with good features
- **Surge.sh**: Simple static hosting

## Database Considerations

### For Production (Recommended)
Consider upgrading to PostgreSQL for data persistence:

1. **Vercel Postgres**
   ```bash
   # Add to your Vercel project
   npm install @vercel/postgres
   ```

2. **Railway PostgreSQL**
   - Built-in PostgreSQL with persistent storage
   - Easy migration from SQLite

3. **Supabase**
   - PostgreSQL with real-time features
   - Excellent for React applications

### SQLite Limitations in Serverless
- File-based database doesn't persist in serverless environments
- Each function invocation may get a fresh database
- OK for development/demo, not recommended for production

## Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up database**
   ```bash
   cd backend
   npm run db:setup
   npm run db:seed
   ```

3. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
DB_PATH=./database/habitquest.db
```

### Frontend
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Build Process

The `vercel.json` configuration handles:
- Backend: Builds as serverless functions
- Frontend: Builds as static site
- Routing: API calls to `/api/*` go to backend, everything else to frontend

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL environment variable in backend
2. **Database Issues**: Verify database setup and seeding
3. **API Connection**: Ensure REACT_APP_API_URL is correct for environment

### Local Testing
Test the build locally:
```bash
# Build frontend
cd frontend && npm run build

# Start backend in production mode
cd ../backend && NODE_ENV=production npm start
```

## Next Steps After Deployment

1. **Monitor Performance**: Use Vercel Analytics
2. **Database Migration**: Consider PostgreSQL for production
3. **Custom Domain**: Add your domain in Vercel settings
4. **SSL**: Automatically provided by Vercel
5. **CI/CD**: Automatic deployments on git push
