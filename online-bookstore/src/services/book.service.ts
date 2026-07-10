import { BookRepository } from '../repositories/book.repository';
import { CreateBookDTO, UpdateBookDTO, PaginatedBooksResponse, BookQueryParams, Book } from '../types/book.types';

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


    // 3. GET BOOK BY ID 
    /**
     * Get a single book by its ID
     * @param id - Book ID
     * @returns Book object
     * @throws Error if book not found
     */
    async getBookById(id: number): Promise<Book> {
        const book = await bookRepository.findById(id);
        if (!book) {
            const error = new Error('Book not found');
            (error as any).status = 404;
            throw error;
        }
        return book;
    }
    
    // 4. Update Book
    // Before update book, check if book exist or not 
    async updateBook(id: number, data: UpdateBookDTO): Promise<Book> {
        // Check if book exists
        const existingBook = await bookRepository.findById(id);
        if (!existingBook) {
            // Book must be exist to update
            const error = new Error('Book not found');
            (error as any).status = 404;
            throw error;  
        }

        // Check if any fields to update
        if (Object.keys(data).length === 0) {
            const error = new Error('No fields to update');
            (error as any).status = 400;
            throw error;
        }

        //Update book
        const updatedBook = await bookRepository.update(id, data);
        if (!updatedBook) {
            const error = new Error('Failed to update book');
            (error as any).status = 500;
            throw error;  
        }

        return updatedBook;
    }    
}