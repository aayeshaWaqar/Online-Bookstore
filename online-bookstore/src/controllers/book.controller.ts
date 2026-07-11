import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/book.service';
import { CreateBookDTO, UpdateBookDTO } from '../types/book.types';

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
            const search = req.query.search as string;
            const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
            const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
            const author = req.query.author as string;

            // Call service to get books
            const result = await bookService.getAllBooks({ page, limit, search, minPrice, maxPrice, author });

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

    // get book by ID
    async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = parseInt(req.params.id as string); 
        const book = await bookService.getBookById(id);
        
        res.json({
            success: true,
            data: { book }
        });
    } catch (error) {
        next(error);
    }
}
    
    // Update Book
    async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validation already done by middleware
            // ID already validated by validateId middleware
            const id = parseInt(req.params.id as string);
            const updateData: UpdateBookDTO = req.body;

            // Call service
            const book = await bookService.updateBook(id, updateData);

            // Send response
            res.json({
                success: true,
                message: 'Book updated successfully',
                data: { book }
            });
        } catch (error) {
            // Pass error to global error handler
            next(error);
        }
    }

    // 5. DELETE BOOK - Soft Delete 
    /**
     * Soft delete a book (Admin only)
     * @param req - Request with book ID in params
     * @param res - Response
     * @param next - Error handler
     */
    async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            
            await bookService.deleteBook(id);

            res.json({
                success: true,
                 message: 'Book deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}