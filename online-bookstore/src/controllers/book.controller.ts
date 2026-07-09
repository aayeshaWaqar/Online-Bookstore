import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';

const bookService = new BookService();

export class BookController {
    // Get all books with pagination
    async getAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract query parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Call service
            const result = await bookService.getAllBooks({ page, limit });

            // Send response
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error); // Send to error handler
        }
    }
}