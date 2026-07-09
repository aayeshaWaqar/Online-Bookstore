import { BookRepository } from '../repositories/book.repository';
import { CreateBookDTO, PaginatedBooksResponse, BookQueryParams, Book } from '../types/book.types';

const bookRepository = new BookRepository();

export class BookService {
    // 1. GET ALL BOOKS - With Pagination
    /**
     * Get all active books with pagination
     * @param params - Query parameters (page, limit)
     * @returns Paginated books with pagination info
     */
    async getAllBooks(params: BookQueryParams): Promise<PaginatedBooksResponse> {
        // Set default values for pagination
        const page = Math.max(1, params.page || 1);
        const limit = Math.min(100, params.limit || 10);
        
        // Get data from repository
        const { books, total } = await bookRepository.findAll(page, limit);
        
        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
        
        return {
            books,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        };
    }

    
    // 2. CREATE BOOK - Admin Add New Book 
    /**
     * Create a new book (Admin only)
     * Note: Validation is handled by middleware
     * @param bookData - Book data from admin (already validated)
     * @returns Created book object
     */
    async createBook(bookData: CreateBookDTO): Promise<Book> {
        // Business logic: Create book in database
        const book = await bookRepository.create(bookData);
        
        return book;
    }
}