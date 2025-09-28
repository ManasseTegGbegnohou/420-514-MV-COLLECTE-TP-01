import { Request, Response, NextFunction } from 'express';
import { operationsLogger } from '../services/LoggingService.ts';

// Simple request/response logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const correlationId = Math.random().toString(36).substring(2, 15);
    
    // Add correlation ID to request object
    (req as any).correlationId = correlationId;
    
    // Log the incoming request
    operationsLogger.info('Request', {
        correlationId,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        body: req.body
    });

    // Override res.json to log the response
    const originalJson = res.json;
    res.json = function(data: any) {
        const duration = Date.now() - startTime;
        
        // Log the response
        operationsLogger.info('Response', {
            correlationId: (req as any).correlationId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
            responseData: data
        });

        return originalJson.call(this, data);
    };

    next();
};
