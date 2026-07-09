import pool from '../config/database';
import { Book } from '../types/book.types';

export class BookRepository {
    // Get all books with pagination
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
}