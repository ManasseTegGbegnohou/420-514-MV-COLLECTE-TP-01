import { Request, Response, NextFunction } from 'express';

export const deprecationWarning = (req: Request, res: Response, next: NextFunction) => {
    // Add deprecation warning headers
    res.set({
        'Deprecation': 'true',
        'Sunset': '2024-12-31',
        'Link': '</api/v2/movies>; rel="successor-version"',
        'Warning': '299 - "API v1 is deprecated. Please use API v2 instead."'
    });

    // Add deprecation message to response body for JSON responses
    const originalJson = res.json;
    res.json = function(body: any) {
        if (typeof body === 'object' && body !== null) {
            body.deprecation = {
                warning: 'API v1 is deprecated',
                message: 'Please use API v2 instead',
                sunset: '2024-12-31',
                successor: '/api/v2/movies',
                documentation: 'http://localhost:3000/docs/v2'
            };
        }
        return originalJson.call(this, body);
    };

    next();
};
