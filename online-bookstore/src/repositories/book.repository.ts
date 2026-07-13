import pool from '../config/database';
import { Book, CreateBookDTO, UpdateBookDTO } from '../types/book.types';

export class BookRepository {
    
    // 1. GET ALL BOOKS 
   
    async findAll(page: number = 1, limit: number = 10, search?: string, minPrice?: number, maxPrice?: number, author?: string, category?: number): Promise<{ books: Book[]; total: number }> {
        // Calculate offset for pagination
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM books WHERE is_active = true';
        // Get total count of active books
        let countQuery = 'SELECT COUNT(*) FROM books WHERE is_active = true';
        const values: any[] = [];
        let paramCount = 1;

        // Add search condition
    if (search) {
        const searchTerm = `%${search}%`;
        query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
        countQuery += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount})`;
        values.push(searchTerm);
        paramCount++;
    }

    // Category filter
    if (category) {
        query += ` AND category_id = $${paramCount}`;
        countQuery += ` AND category_id = $${paramCount}`;
        values.push(category);
        paramCount++;
    }


        // Price Range Filter
    if (minPrice !== undefined) {
            query += ` AND price >= $${paramCount}`;
            countQuery += ` AND price >= $${paramCount}`;
            values.push(minPrice);
            paramCount++;
        }

    if (maxPrice !== undefined) {
            query += ` AND price <= $${paramCount}`;
            countQuery += ` AND price <= $${paramCount}`;
            values.push(maxPrice);
            paramCount++;
        }

         // Author Filter
    if (author) {
            const authorTerm = `%${author}%`;
            query += ` AND author ILIKE $${paramCount}`;
            countQuery += ` AND author ILIKE $${paramCount}`;
            values.push(authorTerm);
            paramCount++;
        }

        // Add pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

        // Execute queries
    const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));
    const total = parseInt(countResult.rows[0].count);
       

        const result = await pool.query(query, values);
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


    // 3. find book by ID
async findById(id: number): Promise<Book | null> {
    const result = await pool.query(
        'SELECT * FROM books WHERE id = $1 AND is_active = true',
        [id]
    );
    return (result.rows[0] as Book) || null;
}

    // 4. Update Book
 async update(id: number, data: UpdateBookDTO): Promise<Book | null> {
        // Build dynamic update query
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        const allowedFields = [
            'title', 'author', 'description', 'price', 'stock',
            'category_id', 'image_url', 'isbn', 'published_year'
        ];

        // Only include fields that are provided
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE books 
            SET ${fields.join(', ')} 
            WHERE id = $${paramCount} AND is_active = true
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return (result.rows[0] as Book) || null;  // Return null if not found
    }

    // 5. DELETE BOOK - Soft Delete 
    /**
     * Soft delete a book (set is_active = false)
     * @param id - Book ID to delete
     * @returns Deleted book or null if not found
     */
    async delete(id: number): Promise<Book | null> {
        const result = await pool.query(
            `UPDATE books 
             SET is_active = false, 
                 deleted_at = CURRENT_TIMESTAMP 
             WHERE id = $1 AND is_active = true 
             RETURNING *`,
            [id]
        );
        return (result.rows[0] as Book) || null;

}

}