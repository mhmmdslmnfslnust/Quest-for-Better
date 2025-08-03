const express = require('express');
const db = require('../models/database');
const Achievement = require('../models/Achievement');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get all achievements
router.get('/', asyncHandler(async (req, res) => {
    try {
        const achievements = await Achievement.getAllAchievements();
        successResponse(res, achievements);
    } catch (error) {
        console.error('Fetch achievements error:', error);
        errorResponse(res, 500, 'Failed to fetch achievements');
    }
}));

// Get user's achievements
router.get('/user', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userAchievements = await Achievement.getUserAchievements(req.user.id);
        successResponse(res, userAchievements);
    } catch (error) {
        console.error('Fetch user achievements error:', error);
        errorResponse(res, 500, 'Failed to fetch user achievements');
    }
}));

// Get achievement progress for user
router.get('/progress', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const progress = await Achievement.getAchievementProgress(req.user.id);
        successResponse(res, progress);
    } catch (error) {
        console.error('Fetch achievement progress error:', error);
        errorResponse(res, 500, 'Failed to fetch achievement progress');
    }
}));

// Check and award achievements for a user
router.post('/check', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const newAchievements = await Achievement.checkAndAwardAchievements(req.user.id);
        successResponse(res, { 
            message: 'Achievements checked successfully',
            newAchievements,
            count: newAchievements.length
        });
    } catch (error) {
        console.error('Check achievements error:', error);
        errorResponse(res, 500, 'Failed to check achievements');
    }
}));

module.exports = router;
