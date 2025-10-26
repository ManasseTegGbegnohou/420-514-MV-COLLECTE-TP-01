import { Request, Response, NextFunction } from 'express';
import { errorsLogger } from '../services/LoggingService.ts';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
    isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
    statusCode: number;
    code: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    let error = { ...err };
    error.message = err.message;

    // Log error
    errorsLogger.error('Error occurred', {
        correlationId,
        error: error.message,
        stack: error.stack,
        statusCode: error.statusCode || 500,
        code: error.code || 'INTERNAL_ERROR',
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Invalid ID format';
        error = new CustomError(message, 400, 'INVALID_ID_FORMAT');
    }

    // Mongoose duplicate key
    if (err.name === 'MongoError' && (err as any).code === 11000) {
        const message = 'Duplicate field value entered';
        error = new CustomError(message, 400, 'DUPLICATE_FIELD');
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
        error = new CustomError(message, 400, 'VALIDATION_ERROR');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new CustomError(message, 401, 'INVALID_TOKEN');
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new CustomError(message, 401, 'TOKEN_EXPIRED');
    }

    res.status(error.statusCode || 500).json({
        error: error.message,
        code: error.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId;
    
    errorsLogger.error('Route not found', {
        correlationId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    res.status(404).json({
        error: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        message: `Cannot ${req.method} ${req.url}`,
        availableRoutes: {
            movies: '/api/v2/movies',
            series: '/api/v2/series',
            auth: '/api/v2/auth',
            ratings: '/api/v2/ratings',
            docs: '/docs/v2'
        }
    });
};
