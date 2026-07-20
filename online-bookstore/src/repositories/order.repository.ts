import pool from '../config/database';
import { PoolClient } from 'pg';
import { Order, OrderItem, OrderItemWithBook } from '../types/order.types';

export class OrderRepository {
    // 1. CREATE ORDER - inside a transaction
    async createOrder(
        client: PoolClient,
        userId: number,
        totalAmount: number,
        shippingAddress: string
    ): Promise<Order> {
        const result = await client.query(
            `INSERT INTO orders (user_id, total_amount, status, shipping_address)
             VALUES ($1, $2, 'pending', $3)
             RETURNING *`,
            [userId, totalAmount, shippingAddress]
        );
        return result.rows[0] as Order;
    }

    // 2. CREATE ORDER ITEM - inside a transaction
    async createOrderItem(
        client: PoolClient,
        orderId: number,
        bookId: number,
        quantity: number,
        price: number
    ): Promise<OrderItem> {
        const result = await client.query(
            `INSERT INTO order_items (order_id, book_id, quantity, price)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [orderId, bookId, quantity, price]
        );
        return result.rows[0] as OrderItem;
    }

    // 3. DECREMENT BOOK STOCK - inside a transaction
    async decrementStock(client: PoolClient, bookId: number, quantity: number): Promise<void> {
        await client.query(
            `UPDATE books SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [quantity, bookId]
        );
    }

    // 4. CLEAR USER CART - inside a transaction (same DB connection as the rest of the order)
    async clearCartTx(client: PoolClient, userId: number): Promise<void> {
        await client.query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
    }

    // 5. GET ORDER BY ID (with items) - normal pool, read-only
    async findOrderById(orderId: number, userId: number): Promise<Order | null> {
        const result = await pool.query(
            `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
            [orderId, userId]
        );
        return (result.rows[0] as Order) || null;
    }

    async findOrderItems(orderId: number): Promise<OrderItemWithBook[]> {
        const result = await pool.query(
            `SELECT oi.*, b.title, b.author, b.image_url
             FROM order_items oi
             JOIN books b ON oi.book_id = b.id
             WHERE oi.order_id = $1`,
            [orderId]
        );
        return result.rows as OrderItemWithBook[];
    }
}