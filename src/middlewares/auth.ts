import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/v2/User.ts';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Access denied. No token provided.',
                code: 'NO_TOKEN'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        
        // Vérifier que l'utilisateur existe encore
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid token. User not found.',
                code: 'USER_NOT_FOUND'
            });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                error: 'Invalid token.',
                code: 'INVALID_TOKEN'
            });
        }
        
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                error: 'Token expired.',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(500).json({ 
            error: 'Internal server error.',
            code: 'INTERNAL_ERROR'
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Authentication required.',
                code: 'AUTH_REQUIRED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Insufficient permissions.',
                code: 'INSUFFICIENT_PERMISSIONS'
            });
        }

        next();
    };
};

export const requireAdmin = requireRole(['admin']);
export const requireUser = requireRole(['user', 'admin']);
