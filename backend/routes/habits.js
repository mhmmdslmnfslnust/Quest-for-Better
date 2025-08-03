const express = require('express');
const { body, param } = require('express-validator');
const Habit = require('../models/Habit');
const { 
    authenticateToken,
    handleValidationErrors,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Get all habits for the authenticated user
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const habits = await Habit.findByUserId(req.user.id);
        successResponse(res, habits);
    } catch (error) {
        console.error('Fetch habits error:', error);
        errorResponse(res, 500, 'Failed to fetch habits');
    }
}));

// Get today's habit status
router.get('/today', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todayStatus = await Habit.getTodayStatus(req.user.id, today);
        successResponse(res, todayStatus);
    } catch (error) {
        console.error('Fetch today status error:', error);
        errorResponse(res, 500, 'Failed to fetch today\'s status');
    }
}));

// Create a new habit
router.post('/', authenticateToken, [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Habit name must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('category')
        .isIn(['health', 'productivity', 'social', 'mindfulness', 'fitness', 'nutrition', 'learning', 'creativity', 'other'])
        .withMessage('Invalid category'),
    body('type')
        .isIn(['break', 'build'])
        .withMessage('Type must be either "break" or "build"'),
    body('difficulty')
        .isInt({ min: 1, max: 5 })
        .withMessage('Difficulty must be between 1 and 5'),
    body('target_frequency')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Target frequency must be between 1 and 7'),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex color code'),
    body('icon')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('Icon must be between 1 and 10 characters'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const habitData = {
            ...req.body,
            user_id: req.user.id
        };

        const result = await Habit.create(habitData);
        const newHabit = await Habit.findById(result.id);

        successResponse(res, newHabit, 'Habit created successfully');
    } catch (error) {
        console.error('Create habit error:', error);
        errorResponse(res, 500, 'Failed to create habit');
    }
}));

// Get specific habit by ID
router.get('/:id', authenticateToken, [
    param('id').isInt().withMessage('Habit ID must be a number'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        
        if (!habit) {
            return errorResponse(res, 404, 'Habit not found');
        }

        if (habit.user_id !== req.user.id) {
            return errorResponse(res, 403, 'Access denied');
        }

        // Get habit statistics
        const stats = await Habit.getStatistics(req.params.id);

        successResponse(res, {
            ...habit,
            statistics: stats
        });
    } catch (error) {
        console.error('Fetch habit error:', error);
        errorResponse(res, 500, 'Failed to fetch habit');
    }
}));

// Update habit
router.put('/:id', authenticateToken, [
    param('id').isInt().withMessage('Habit ID must be a number'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Habit name must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('category')
        .optional()
        .isIn(['health', 'productivity', 'social', 'mindfulness', 'fitness', 'nutrition', 'learning', 'creativity', 'other'])
        .withMessage('Invalid category'),
    body('difficulty')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Difficulty must be between 1 and 5'),
    body('target_frequency')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Target frequency must be between 1 and 7'),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex color code'),
    body('icon')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('Icon must be between 1 and 10 characters'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        
        if (!habit) {
            return errorResponse(res, 404, 'Habit not found');
        }

        if (habit.user_id !== req.user.id) {
            return errorResponse(res, 403, 'Access denied');
        }

        await Habit.update(req.params.id, req.body);
        const updatedHabit = await Habit.findById(req.params.id);

        successResponse(res, updatedHabit, 'Habit updated successfully');
    } catch (error) {
        console.error('Update habit error:', error);
        errorResponse(res, 500, 'Failed to update habit');
    }
}));

// Delete habit
router.delete('/:id', authenticateToken, [
    param('id').isInt().withMessage('Habit ID must be a number'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        
        if (!habit) {
            return errorResponse(res, 404, 'Habit not found');
        }

        if (habit.user_id !== req.user.id) {
            return errorResponse(res, 403, 'Access denied');
        }

        await Habit.delete(req.params.id);
        successResponse(res, null, 'Habit deleted successfully');
    } catch (error) {
        console.error('Delete habit error:', error);
        errorResponse(res, 500, 'Failed to delete habit');
    }
}));

// Log habit completion
router.post('/:id/log', authenticateToken, [
    param('id').isInt().withMessage('Habit ID must be a number'),
    body('date')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date must be in YYYY-MM-DD format'),
    body('success')
        .isBoolean()
        .withMessage('Success must be a boolean value'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const { date, success, notes } = req.body;
        
        const habit = await Habit.findById(req.params.id);
        
        if (!habit) {
            return errorResponse(res, 404, 'Habit not found');
        }

        if (habit.user_id !== req.user.id) {
            return errorResponse(res, 403, 'Access denied');
        }

        // Check if date is not in the future
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            return errorResponse(res, 400, 'Cannot log for future dates');
        }

        const result = await Habit.logCompletion(req.params.id, date, success, notes || '');
        
        successResponse(res, result, 'Habit logged successfully');
    } catch (error) {
        console.error('Log habit error:', error);
        errorResponse(res, 500, 'Failed to log habit');
    }
}));

// Get habit logs for a specific period
router.get('/:id/logs', authenticateToken, [
    param('id').isInt().withMessage('Habit ID must be a number'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        
        const habit = await Habit.findById(req.params.id);
        
        if (!habit) {
            return errorResponse(res, 404, 'Habit not found');
        }

        if (habit.user_id !== req.user.id) {
            return errorResponse(res, 403, 'Access denied');
        }

        // Default to last 30 days if no dates provided
        const endDate = end_date || new Date().toISOString().split('T')[0];
        const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const logs = await Habit.getLogsForPeriod(req.params.id, startDate, endDate);
        
        successResponse(res, logs);
    } catch (error) {
        console.error('Fetch logs error:', error);
        errorResponse(res, 500, 'Failed to fetch habit logs');
    }
}));

// Get habits by category
router.get('/category/:category', authenticateToken, [
    param('category')
        .isIn(['health', 'productivity', 'social', 'mindfulness', 'fitness', 'nutrition', 'learning', 'creativity', 'other'])
        .withMessage('Invalid category'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    try {
        const habits = await Habit.findByCategory(req.user.id, req.params.category);
        successResponse(res, habits);
    } catch (error) {
        console.error('Fetch habits by category error:', error);
        errorResponse(res, 500, 'Failed to fetch habits by category');
    }
}));

module.exports = router;
