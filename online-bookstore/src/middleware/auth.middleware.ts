import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
        name: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            email: string;
            role: string;
            name: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({
            success: false,
            error: 'Access denied. Admin only.'
        });
        return;
    }
    next();
};