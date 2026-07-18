import pool from '../config/database';
import { CartItem } from '../types/cart.types';

export class CartRepository {
    // 1. FIND CART ITEM - Check if book already in cart
    async findCartItem(userId: number, bookId: number): Promise<CartItem | null> {
        const result = await pool.query(
            'SELECT * FROM cart WHERE user_id = $1 AND book_id = $2',
            [userId, bookId]
        );
        return (result.rows[0] as CartItem) || null;
    }
    
    // 2. ADD TO CART - Insert new item 
    async create(userId: number, bookId: number, quantity: number = 1): Promise<CartItem> {
        const result = await pool.query(
            `INSERT INTO cart (user_id, book_id, quantity) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [userId, bookId, quantity]
        );
        return result.rows[0] as CartItem;
    }

    // 3. UPDATE QUANTITY - Update existing item 
     async updateQuantity(userId: number, bookId: number, quantity: number): Promise<CartItem | null> {
        const result = await pool.query(
            `UPDATE cart 
             SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = $2 AND book_id = $3 
             RETURNING *`,
            [quantity, userId, bookId]
        );
        return (result.rows[0] as CartItem) || null;
    }

    // 4. FIND USER CART - Get all cart items for a user 
    /**
     * Get all cart items for a user with book details
     * @param userId - User ID
     * @returns Array of cart items with book details
     */
    async findUserCart(userId: number): Promise<any[]> {
        const result = await pool.query(
            `SELECT 
                c.id,
                c.user_id,
                c.book_id,
                c.quantity,
                c.created_at,
                c.updated_at,
                b.title,
                b.author,
                b.price,
                b.image_url,
                (b.price * c.quantity) AS total_price
             FROM cart c
             JOIN books b ON c.book_id = b.id
             WHERE c.user_id = $1
             ORDER BY c.created_at ASC`,
            [userId]
        );
        return result.rows;
    }

    // 5. REMOVE ITEM - Delete a specific book from user's cart
    /**
     * Remove a specific book from user's cart
     * @param userId - User ID
     * @param bookId - Book ID
     * @returns Deleted cart item, or null if not found
     */
    async remove(userId: number, bookId: number): Promise<CartItem | null> {
        const result = await pool.query(
            `DELETE FROM cart 
             WHERE user_id = $1 AND book_id = $2 
             RETURNING *`,
            [userId, bookId]
        );
        return (result.rows[0] as CartItem) || null;
    }

    // 6. CLEAR CART - Delete all items from user's cart
    /**
     * Remove all items from user's cart
     * @param userId - User ID
     * @returns Number of items deleted
     */
    async clearCart(userId: number): Promise<number> {
        const result = await pool.query(
            `DELETE FROM cart WHERE user_id = $1`,
            [userId]
        );
        return result.rowCount ?? 0;
    }
}
