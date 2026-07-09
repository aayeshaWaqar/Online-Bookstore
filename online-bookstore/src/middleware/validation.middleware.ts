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

// 2. BOOK VALIDATION 
export const validateBook = (req: Request, res: Response, next: NextFunction): void => {
    const { title, author, price, stock, isbn, published_year } = req.body;

    // Title validation
    if (!title || title.trim().length < 2) {
        res.status(400).json({
            success: false,
            error: 'Title must be at least 2 characters long'
        });
        return;
    }

    // Author validation
    if (!author || author.trim().length < 2) {
        res.status(400).json({
            success: false,
            error: 'Author must be at least 2 characters long'
        });
        return;
    }

    // Price validation
    if (price === undefined || price <= 0) {
        res.status(400).json({
            success: false,
            error: 'Price must be greater than 0'
        });
        return;
    }

    // Stock validation
    if (stock === undefined || stock < 0) {
        res.status(400).json({
            success: false,
            error: 'Stock must be 0 or greater'
        });
        return;
    }

    // ISBN validation (optional but if provided, validate format)
    if (isbn) {
        const isbnClean = isbn.replace(/-/g, '');
        if (!/^\d{10}$|^\d{13}$/.test(isbnClean)) {
            res.status(400).json({
                success: false,
                error: 'ISBN must be 10 or 13 digits'
            });
            return;
        }
    }

    // Published year validation (optional but if provided, validate range)
    if (published_year) {
        const currentYear = new Date().getFullYear();
        if (published_year < 1000 || published_year > currentYear) {
            res.status(400).json({
                success: false,
                error: `Published year must be between 1000 and ${currentYear}`
            });
            return;
        }
    }

     next();
};