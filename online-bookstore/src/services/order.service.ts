import { transaction } from '../config/database';
import { OrderRepository } from '../repositories/order.repository';
import { CartRepository } from '../repositories/cart.repository';
import { BookRepository } from '../repositories/book.repository';
import { PlaceOrderDTO, OrderWithItems } from '../types/order.types';

const orderRepository = new OrderRepository();
const cartRepository = new CartRepository();
const bookRepository = new BookRepository();

export class OrderService {
    // 1. PLACE ORDER
    /**
     * Convert user's cart into an order
     * @param userId - User ID
     * @param data - Shipping address
     * @returns The created order with its items
     * @throws Error if cart is empty or stock insufficient
     */
    async placeOrder(userId: number, data: PlaceOrderDTO): Promise<OrderWithItems> {
        const { shipping_address } = data;

        // 1. Get current cart items (with book price/details)
        const cartItems = await cartRepository.findUserCart(userId);
    if (cartItems.length === 0) {
            const error = new Error('Cart is empty. Add items before placing an order.');
            (error as any).status = 400;
            throw error;
        }

        // 2. Re-validate stock for every item (fresh check, cart data can be stale)
        for (const item of cartItems) {
            const book = await bookRepository.findById(item.book_id);
            if (!book) {
                const error = new Error(`Book "${item.title}" is no longer available`);
                (error as any).status = 400;
                throw error;
            }
             if (book.stock < item.quantity) {
                const error = new Error(
                    `Insufficient stock for "${item.title}". Available: ${book.stock}, requested: ${item.quantity}`
                );
                (error as any).status = 400;
                throw error;
            }
        }

        // 3. Calculate total amount
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + parseFloat(item.total_price),
            0
        );
        // 4. Run everything atomically in a single transaction
        const order = await transaction(async (client) => {
            // a. Create the order
            const newOrder = await orderRepository.createOrder(
                client,
                userId,
                totalAmount,
                shipping_address
            );

            // b. Create an order_item for each cart item + decrement stock
            for (const item of cartItems) {
                await orderRepository.createOrderItem(
                    client,
                    newOrder.id,
                    item.book_id,
                    item.quantity,
                    item.price
                );
                await orderRepository.decrementStock(client, item.book_id, item.quantity);
            }
        // c. Clear the cart (same transaction/connection)
            await orderRepository.clearCartTx(client, userId);

            return newOrder;
        });

        // 5. Fetch and return the full order with items (outside transaction, read-only)
        const items = await orderRepository.findOrderItems(order.id);
        return { ...order, items };
    }
}