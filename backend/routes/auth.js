const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const { 
    hashPassword, 
    comparePassword, 
    generateToken, 
    handleValidationErrors,
    authenticateToken,
    errorResponse,
    successResponse,
    asyncHandler
} = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return errorResponse(res, 400, 'Email already registered');
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return errorResponse(res, 400, 'Username already taken');
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password);
        const userId = await User.create({ username, email, passwordHash });

        // Get the created user
        const user = await User.findById(userId);
        
        // Generate token
        const token = generateToken(user);

        // Remove password hash from response
        delete user.password_hash;

        successResponse(res, {
            user,
            token
        }, 'User registered successfully');

    } catch (error) {
        console.error('Registration error:', error);
        errorResponse(res, 500, 'Registration failed');
    }
}));

// Login user
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        // Generate token
        const token = generateToken(user);

        // Remove password hash from response
        delete user.password_hash;

        successResponse(res, {
            user,
            token
        }, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        errorResponse(res, 500, 'Login failed');
    }
}));

// Get current user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        // Remove password hash from response
        delete user.password_hash;

        // Get achievements count
        const achievementsCount = await User.getAchievementsCount(user.id);

        successResponse(res, {
            ...user,
            achievements_count: achievementsCount
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        errorResponse(res, 500, 'Failed to fetch profile');
    }
}));

// Update user preferences
router.put('/preferences', authenticateToken, [
    body('avatar_id')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Avatar ID must be between 1 and 20'),
    body('theme_preference')
        .optional()
        .isIn(['default', 'dark', 'light', 'forest', 'ocean'])
        .withMessage('Invalid theme preference'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    const { avatar_id, theme_preference } = req.body;

    try {
        await User.updatePreferences(req.user.id, {
            avatar_id: avatar_id || 1,
            theme_preference: theme_preference || 'default'
        });

        successResponse(res, null, 'Preferences updated successfully');

    } catch (error) {
        console.error('Preferences update error:', error);
        errorResponse(res, 500, 'Failed to update preferences');
    }
}));

// Verify token (for frontend authentication checks)
router.get('/verify', authenticateToken, asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        delete user.password_hash;
        successResponse(res, { user }, 'Token is valid');

    } catch (error) {
        console.error('Token verification error:', error);
        errorResponse(res, 500, 'Token verification failed');
    }
}));

// Delete user account
router.delete('/account', authenticateToken, [
    body('password')
        .notEmpty()
        .withMessage('Password confirmation is required'),
    handleValidationErrors
], asyncHandler(async (req, res) => {
    const { password } = req.body;

    try {
        // Verify password before deletion
        const user = await User.findById(req.user.id);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid password');
        }

        // Delete user account
        await User.delete(req.user.id);

        successResponse(res, null, 'Account deleted successfully');

    } catch (error) {
        console.error('Account deletion error:', error);
        errorResponse(res, 500, 'Failed to delete account');
    }
}));

module.exports = router;
