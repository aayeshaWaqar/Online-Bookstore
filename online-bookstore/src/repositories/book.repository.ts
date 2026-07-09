import pool from '../config/database';
import { Book, CreateBookDTO } from '../types/book.types';

export class BookRepository {
    
    // 1. GET ALL BOOKS - With Pagination 
    /**
     * Fetch all active books with pagination
     * @param page - Page number (default: 1)
     * @param limit - Books per page (default: 10)
     * @returns Object containing books array and total count
     */
    async findAll(page: number = 1, limit: number = 10): Promise<{ books: Book[]; total: number }> {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        // Get total count of active books
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM books WHERE is_active = true'
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated books
        const result = await pool.query(
            `SELECT * FROM books 
             WHERE is_active = true 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return {
            books: result.rows as Book[],
            total
        };
    }

    // 2. CREATE BOOK - Admin Add New Book 
    /**
     * Create a new book in the database
     * @param bookData - Book data from admin
     * @returns Created book object
     */
    async create(bookData: CreateBookDTO): Promise<Book> {
        const {
            title,
            author,
            description,
            price,
            stock,
            category_id,
            image_url,
            isbn,
            published_year
        } = bookData;

        // Insert new book with is_active = true by default
        const result = await pool.query(
            `INSERT INTO books (
                title, 
                author, 
                description, 
                price, 
                stock, 
                category_id, 
                image_url, 
                isbn, 
                published_year,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) 
            RETURNING *`,
            [
                title,
                author,
                description || null,
                price,
                stock,
                category_id || null,
                image_url || null,
                isbn || null,
                published_year || null
            ]
        );

        return result.rows[0] as Book;
    }
}