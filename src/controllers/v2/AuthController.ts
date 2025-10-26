import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../models/v2/User.ts';
import { operationsLogger, errorsLogger } from '../../services/LoggingService.ts';
import { CustomError } from '../../middlewares/errorHandler.ts';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// POST /api/v2/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            errorsLogger.error('User registration failed - user already exists', {
                correlationId,
                email,
                username,
                timestamp: new Date().toISOString()
            });
            
            return res.status(409).json({
                error: 'User already exists',
                code: 'USER_EXISTS'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            email,
            username,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any }
        );

        operationsLogger.info('User registered successfully', {
            correlationId,
            userId: user._id,
            email: user.email,
            timestamp: new Date().toISOString()
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token
        });
    } catch (error) {
        errorsLogger.error('Error registering user', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/v2/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            errorsLogger.error('Login failed - user not found', {
                correlationId,
                email,
                timestamp: new Date().toISOString()
            });
            
            return next(new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            errorsLogger.error('Login failed - invalid password', {
                correlationId,
                email,
                timestamp: new Date().toISOString()
            });
            
            return next(new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS'));
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any }
        );

        operationsLogger.info('User logged in successfully', {
            correlationId,
            userId: user._id,
            email: user.email,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token
        });
    } catch (error) {
        errorsLogger.error('Error during login', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/users/me
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const user = await User.findById(req.user!.id).select('-password');
        
        if (!user) {
            return next(new CustomError(`User with ID '${req.params.id}' not found`, 404, 'USER_NOT_FOUND'));
        }

        operationsLogger.info('User profile retrieved', {
            correlationId,
            userId: user._id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                favorites: user.favorites
            }
        });
    } catch (error) {
        errorsLogger.error('Error getting user profile', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// PATCH /api/v2/users/me
export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { username, email } = req.body;
        const updateData: any = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            req.user!.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(new CustomError(`User with ID '${req.params.id}' not found`, 404, 'USER_NOT_FOUND'));
        }

        operationsLogger.info('User profile updated', {
            correlationId,
            userId: user._id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                favorites: user.favorites
            }
        });
    } catch (error) {
        errorsLogger.error('Error updating user profile', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/v2/users/:id (admin only)
export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return next(new CustomError(`User with ID '${req.params.id}' not found`, 404, 'USER_NOT_FOUND'));
        }

        operationsLogger.info('User retrieved by admin', {
            correlationId,
            userId: user._id,
            requestedBy: req.user!.id,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                favorites: user.favorites,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        errorsLogger.error('Error getting user by ID', {
            correlationId,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ error: 'Internal server error' });
    }
};