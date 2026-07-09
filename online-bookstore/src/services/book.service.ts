import { BookRepository } from '../repositories/book.repository';
import { PaginatedBooksResponse, BookQueryParams } from '../types/book.types';

const bookRepository = new BookRepository();

export class BookService {
    // Get all books with pagination
    async getAllBooks(params: BookQueryParams): Promise<PaginatedBooksResponse> {
        // Set default values
        const page = Math.max(1, params.page || 1);        // Minimum 1
        const limit = Math.min(100, params.limit || 10);   // Maximum 100
        
        // Get data from repository
        const { books, total } = await bookRepository.findAll(page, limit);
        
        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
        
        // Return paginated response
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
}