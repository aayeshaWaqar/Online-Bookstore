import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../types/book.types';

const bookService = new BookService();

export class BookController {
    // 1. GET ALL BOOKS - With Pagination 
    /**
     * Get all books with pagination
     * @param req - Request object (query params: page, limit)
     * @param res - Response object
     * @param next - Next function for error handling
     */
    async getAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract and parse query parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Call service to get books
            const result = await bookService.getAllBooks({ page, limit });

            // Send success response
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            // Pass error to global error handler
            next(error);
        }
    }

    // 2. CREATE BOOK - Admin Add New Book 
    /**
     * Create a new book (Admin only)
     * @param req - Request object (body: book data)
     * @param res - Response object
     * @param next - Next function for error handling
     */
    async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extract book data from request body
            const bookData: CreateBookDTO = req.body;

            // Call service to create book
            const book = await bookService.createBook(bookData);

            // Send success response with 201 Created status
            res.status(201).json({
                success: true,
                message: 'Book created successfully',
                data: { book }
            });
        } catch (error) {
            // Pass error to global error handler
            next(error);
        }
    }
}