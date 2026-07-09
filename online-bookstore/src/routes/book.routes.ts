import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { validatePagination } from '../middleware/validation.middleware';

const router = Router();
const bookController = new BookController();

// Public routes
router.get('/', validatePagination, bookController.getAllBooks.bind(bookController));
export default router;