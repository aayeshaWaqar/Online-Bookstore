import { Request, Response, NextFunction } from 'express';

export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const page = req.query.page;
    const limit = req.query.limit;
    const search = req.query.search;  
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const author = req.query.author;
    const category = req.query.category;   

    // Min Price validation
    if (minPrice !== undefined) {
        const minPriceNum = parseFloat(minPrice as string);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
            res.status(400).json({
                success: false,
                error: 'Min price must be a valid number greater than or equal to 0'
            });
            return;
        }
    }

    // Max Price validation
    if (maxPrice !== undefined) {
        const maxPriceNum = parseFloat(maxPrice as string);
        if (isNaN(maxPriceNum) || maxPriceNum <= 0) {
            res.status(400).json({
                success: false,
                error: 'Max price must be a valid number greater than 0'
            });
            return;
        }
    }

    // Min Price vs Max Price validation 
    if (minPrice !== undefined && maxPrice !== undefined) {
        const minPriceNum = parseFloat(minPrice as string);
        const maxPriceNum = parseFloat(maxPrice as string);
        if (minPriceNum > maxPriceNum) {
            res.status(400).json({
                success: false,
                error: 'Min price cannot be greater than max price'
            });
            return;  // Stop execution
        }
    }

    // Category validation
    if (category !== undefined) {
        const categoryNum = parseInt(category as string);
        if (isNaN(categoryNum) || categoryNum < 1) {
            res.status(400).json({
                success: false,
                error: 'Category must be a positive number'
            });
            return;
        }
    }


    // Author validation
    if (author !== undefined) {
        const authorStr = author as string;
        if (authorStr.trim().length < 2) {
            res.status(400).json({
                success: false,
                error: 'Author must be at least 2 characters long'
            });
            return;
        }
    }



    // Search validation (optional, min 2 chars if provided)
    if (search !== undefined) {
        const searchStr = search as string;
        if (searchStr.trim().length < 2) {
            res.status(400).json({
                success: false,
                error: 'Search term must be at least 2 characters long'
            });
            return;
        }
    }


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

    // Title validation - Only if provided (for update) OR required (for create)
    if (title !== undefined) {
    if (!title || title.trim().length < 2) {
        res.status(400).json({
            success: false,
            error: 'Title must be at least 2 characters long'
        });
        return;
    }
    }

    // Author validation - only if provided (for update) OR required (for create)
    if (author !== undefined) {
    if (!author || author.trim().length < 2) {
        res.status(400).json({
            success: false,
            error: 'Author must be at least 2 characters long'
        });
        return;
    }
    }

    // Price validation - only if provided (for update) OR required (for create)
    if (price !== undefined) {
    if ( price <= 0) {
        res.status(400).json({
            success: false,
            error: 'Price must be greater than 0'
        });
        return;
    }
    }

    // Stock validation - only if provided (for update) OR required (for create)
    if (stock !== undefined) {
    if ( stock < 0) {
        res.status(400).json({
            success: false,
            error: 'Stock must be 0 or greater'
        });
        return;
    }
}

    // ISBN validation - only if provided (for update) OR required (for create)
    if (isbn !== undefined && isbn !== '') {
        const isbnClean = isbn.replace(/-/g, '');
        if (!/^\d{10}$|^\d{13}$/.test(isbnClean)) {
            res.status(400).json({
                success: false,
                error: 'ISBN must be 10 or 13 digits'
            });
            return;
        }
    }

    // Published year validation (optional but if provided (for update) OR required (for create))
    if (published_year !== undefined && published_year !== '') {
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

// ID VALIDATION 
/**
 * Validate ID parameter
 * Checks if ID is a valid positive number
 */
export const validateId = (req: Request, res: Response, next: NextFunction): void => {
    // Type assertion to string
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id) || id < 1) {
        res.status(400).json({
            success: false,
            error: 'Invalid ID. ID must be a positive number'
        });
        return;
    }

    // Store validated ID for controller use
    (req as any).validatedId = id;
    
    next();
};

// CATEGORY VALIDATION 
/**
 * Validate category data for create and update
 * Checks: name (required, min 2 chars)
 */
export const validateCategory = (req: Request, res: Response, next: NextFunction): void => {
    const { name, description } = req.body;

    // Name validation - Only if provided
    if (name !== undefined) {
        const nameStr = String(name).trim(); // Safe string conversion
        if (!nameStr || nameStr.length < 2) {
            res.status(400).json({
                success: false,
                error: 'Category name must be at least 2 characters long'
            });
            return;
        }

    if (nameStr.length > 100) {
            res.status(400).json({
                success: false,
                error: 'Category name must be less than 100 characters'
            });
            return;
        }
    }

     // Description validation - Only if provided
    if (description !== undefined) {
        const descStr = String(description).trim(); // Safe string conversion
        if (descStr.length < 2) {
            res.status(400).json({
                success: false,
                error: 'Description must be at least 2 characters long if provided'
            });
            return;
        }
    }

    next();
};

// 5. CART VALIDATION - ADD TO CART 
/**
 * Validate add to cart request
 * Checks: book_id (required, positive number), quantity (optional, positive number)
 */
export const validateAddToCart = (req: Request, res: Response, next: NextFunction): void => {
    const { book_id, quantity } = req.body;

    // book_id validation - Required, positive number
    if (!book_id) {
        res.status(400).json({
            success: false,
            error: 'Book ID is required'
        });
        return;
    }

    if (isNaN(book_id) || book_id < 1) {
        res.status(400).json({
            success: false,
            error: 'Book ID must be a positive number'
        });
        return;
    }

    // quantity validation - Optional, positive number (if provided)
    if (quantity !== undefined) {
        if (isNaN(quantity) || quantity < 1) {
            res.status(400).json({
                success: false,
                error: 'Quantity must be a positive number (minimum 1)'
            });
            return;
        }
    }

    next();
};