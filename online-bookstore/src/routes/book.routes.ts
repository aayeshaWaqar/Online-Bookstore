import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { validatePagination, validateBook } from '../middleware/validation.middleware';

const router = Router();
const bookController = new BookController();

// PUBLIC ROUTES - No Authentication Required
/**
 * GET /api/books
 * Get all books with pagination
 * Query params: page, limit
 * Access: Public (anyone can view books)
 */
router.get(
    '/', 
    validatePagination,              // Validate page & limit
    bookController.getAllBooks.bind(bookController)
);

// ADMIN ROUTES - Authentication + Admin Required

/**
 * POST /api/books
 * Create a new book
 * Body: title, author, price, stock, description, category_id, etc.
 * Access: Admin only
 */
router.post(
    '/', 
    authenticate,                    // 1. Check if user is logged in
    isAdmin,                         // 2. Check if user is admin
    validateBook,                    // 3. Validate book data
    bookController.createBook.bind(bookController)
);

export default router;