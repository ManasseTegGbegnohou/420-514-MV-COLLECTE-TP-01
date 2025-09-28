import { Request, Response, NextFunction } from 'express';
import { operationsLogger, errorsLogger } from '../services/LoggingService.ts';

// Simple request/response logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const correlationId = Math.random().toString(36).substring(2, 15);
    
    // Add correlation ID to request object
    (req as any).correlationId = correlationId;
    
    // Log the incoming request
    operationsLogger.info('Request', {
        correlationId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
        body: req.body
    });

    // Override res.json to log the response
    const originalJson = res.json;
    res.json = function(data: any) {
        const duration = Date.now() - startTime;
        
        // Log successful responses to operations
        if (res.statusCode < 400) {
            operationsLogger.info('Response', {
                correlationId: (req as any).correlationId,
                url: req.url,
                method: req.method,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                responseData: data
            });
        } else {
            // Log error responses to errors logger
            errorsLogger.error('Error Response', {
                correlationId: (req as any).correlationId,
                url: req.url,
                method: req.method,
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                timestamp: new Date().toISOString(),
                errorData: data
            });
        }

        return originalJson.call(this, data);
    };

    next();
};

// Global error handler middleware
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const correlationId = (req as any).correlationId || 'unknown';
    
    // Log the error
    errorsLogger.error('Unhandled Error', {
        correlationId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
    });

    // Send error response
    res.status(500).json({
        error: 'Internal Server Error',
        correlationId
    });
};
