import { Request, Response, NextFunction } from 'express';

export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const page = req.query.page;
    const limit = req.query.limit;

    // Check page
    if (page !== undefined) {
        const pageNum = parseInt(page as string);
        if (isNaN(pageNum) || pageNum < 1) {
            res.status(400).json({
                success: false,
                error: 'Page must be a positive number (minimum 1)'
            });
            return;
        }
    }

    // Check limit
    if (limit !== undefined) {
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            res.status(400).json({
                success: false,
                error: 'Limit must be between 1 and 100'
            });
            return;
        }
    }

    next();
};