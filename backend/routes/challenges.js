const express = require('express');
const db = require('../models/database');
const Challenge = require('../models/Challenge');
const { 
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get all active challenges
router.get('/', asyncHandler(async (req, res) => {
    try {
        const challenges = await Challenge.getActiveChalllenges();
        successResponse(res, challenges);
    } catch (error) {
        console.error('Fetch challenges error:', error);
        errorResponse(res, 500, 'Failed to fetch challenges');
    }
}));

// Get trending challenges
router.get('/trending', asyncHandler(async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const trendingChallenges = await Challenge.getTrendingChallenges(parseInt(limit));
        successResponse(res, trendingChallenges);
    } catch (error) {
        console.error('Fetch trending challenges error:', error);
        errorResponse(res, 500, 'Failed to fetch trending challenges');
    }
}));

// Get user's active challenges
router.get('/user', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const userChallenges = await Challenge.getUserChallenges(req.user.id);
        successResponse(res, userChallenges);
    } catch (error) {
        console.error('Fetch user challenges error:', error);
        errorResponse(res, 500, 'Failed to fetch user challenges');
    }
}));

// Join a challenge
router.post('/:id/join', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userId = req.user.id;
        
        await Challenge.joinChallenge(userId, challengeId);
        successResponse(res, null, 'Successfully joined challenge');
    } catch (error) {
        console.error('Join challenge error:', error);
        if (error.message === 'Challenge not found or inactive') {
            errorResponse(res, 404, error.message);
        } else if (error.message === 'Already joined this challenge') {
            errorResponse(res, 400, error.message);
        } else {
            errorResponse(res, 500, 'Failed to join challenge');
        }
    }
}));

// Update challenge progress
router.post('/:id/progress', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userId = req.user.id;
        
        const result = await Challenge.updateProgress(userId, challengeId);
        successResponse(res, result, result.completed ? 'Challenge completed!' : 'Progress updated');
    } catch (error) {
        console.error('Update challenge progress error:', error);
        if (error.message === 'Challenge not found or already completed') {
            errorResponse(res, 404, error.message);
        } else if (error.message === 'Challenge has expired') {
            errorResponse(res, 400, error.message);
        } else {
            errorResponse(res, 500, 'Failed to update challenge progress');
        }
    }
}));

// Get challenge leaderboard
router.get('/:id/leaderboard', asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const { limit = 20 } = req.query;
        
        const leaderboard = await Challenge.getLeaderboard(challengeId, parseInt(limit));
        successResponse(res, leaderboard);
    } catch (error) {
        console.error('Fetch challenge leaderboard error:', error);
        errorResponse(res, 500, 'Failed to fetch challenge leaderboard');
    }
}));

// Get challenge statistics
router.get('/:id/stats', asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const stats = await Challenge.getChallengeStats(challengeId);
        successResponse(res, stats);
    } catch (error) {
        console.error('Fetch challenge stats error:', error);
        errorResponse(res, 500, 'Failed to fetch challenge stats');
    }
}));

// Get user's rank in challenge (requires authentication)
router.get('/:id/rank', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const challengeId = req.params.id;
        const userId = req.user.id;
        
        const rank = await Challenge.getUserRank(userId, challengeId);
        successResponse(res, { rank });
    } catch (error) {
        console.error('Fetch user rank error:', error);
        errorResponse(res, 500, 'Failed to fetch user rank');
    }
}));

module.exports = router;
