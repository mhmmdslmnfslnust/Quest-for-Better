const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Hash password utility
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Compare password utility
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            username: user.username, 
            email: user.email 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Calculate user level based on points
const calculateLevel = (points) => {
    // Level calculation: 1000 points per level, with increasing requirements
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    if (points < 2100) return 6;
    if (points < 2800) return 7;
    if (points < 3600) return 8;
    if (points < 4500) return 9;
    if (points < 5500) return 10;
    
    // For levels above 10, each level requires 1000 more points
    return Math.floor((points - 5500) / 1000) + 11;
};

// Calculate points needed for next level
const pointsForNextLevel = (currentLevel) => {
    if (currentLevel === 1) return 100;
    if (currentLevel === 2) return 300;
    if (currentLevel === 3) return 600;
    if (currentLevel === 4) return 1000;
    if (currentLevel === 5) return 1500;
    if (currentLevel === 6) return 2100;
    if (currentLevel === 7) return 2800;
    if (currentLevel === 8) return 3600;
    if (currentLevel === 9) return 4500;
    if (currentLevel === 10) return 5500;
    
    return 5500 + ((currentLevel - 10) * 1000);
};

// Error response utility
const errorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

// Success response utility
const successResponse = (res, data, message = 'Success') => {
    return res.json({
        success: true,
        message,
        data
    });
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    authenticateToken,
    handleValidationErrors,
    hashPassword,
    comparePassword,
    generateToken,
    calculateLevel,
    pointsForNextLevel,
    errorResponse,
    successResponse,
    asyncHandler,
    JWT_SECRET
};
