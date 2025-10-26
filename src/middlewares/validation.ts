import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors.array().map(error => ({
                field: 'path' in error ? error.path : 'unknown',
                message: error.msg,
                value: 'value' in error ? error.value : undefined
            }))
        });
    }
    next();
};

// User registration validation
export const validateUserRegistration: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('username')
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9._-]+$/)
        .withMessage('Username must be 3-30 characters and contain only alphanumeric characters, dots, underscores, and hyphens'),
    body('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// User login validation
export const validateUserLogin: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Movie validation
export const validateMovie: ValidationChain[] = [
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('genres')
        .isArray({ min: 1 })
        .withMessage('At least one genre is required'),
    body('genres.*')
        .isLength({ min: 1, max: 30 })
        .withMessage('Each genre must be between 1 and 30 characters'),
    body('durationMin')
        .isInt({ min: 1, max: 600 })
        .withMessage('Duration must be between 1 and 600 minutes'),
    body('synopsis')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Synopsis must be less than 2000 characters'),
    body('releaseDate')
        .optional()
        .isISO8601()
        .withMessage('Release date must be a valid date')
];

// Series validation
export const validateSeries: ValidationChain[] = [
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('genres')
        .isArray({ min: 1 })
        .withMessage('At least one genre is required'),
    body('genres.*')
        .isLength({ min: 1, max: 30 })
        .withMessage('Each genre must be between 1 and 30 characters'),
    body('status')
        .optional()
        .isIn(['ongoing', 'ended'])
        .withMessage('Status must be either ongoing or ended')
];

// Season validation
export const validateSeason: ValidationChain[] = [
    body('seasonNo')
        .isInt({ min: 1 })
        .withMessage('Season number must be at least 1'),
    body('episodes')
        .isInt({ min: 0 })
        .withMessage('Number of episodes must be at least 0')
];

// Episode validation
export const validateEpisode: ValidationChain[] = [
    body('epNo')
        .isInt({ min: 1 })
        .withMessage('Episode number must be at least 1'),
    body('title')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('durationMin')
        .isInt({ min: 1, max: 300 })
        .withMessage('Duration must be between 1 and 300 minutes')
];

// Rating validation
export const validateRating: ValidationChain[] = [
    body('target')
        .isIn(['movie', 'episode'])
        .withMessage('Target must be either movie or episode'),
    body('targetId')
        .isMongoId()
        .withMessage('Target ID must be a valid MongoDB ObjectId'),
    body('score')
        .isFloat({ min: 0, max: 10 })
        .withMessage('Score must be between 0 and 10'),
    body('review')
        .optional()
        .isLength({ max: 2000 })
        .withMessage('Review must be less than 2000 characters')
];
