import { CartRepository } from '../repositories/cart.repository';
import { BookRepository } from '../repositories/book.repository';
import { CartItem, CartResponse, CartItemWithBook, AddToCartDTO } from '../types/cart.types';

const cartRepository = new CartRepository();
const bookRepository = new BookRepository();

export class CartService {
    // 1. ADD TO CART 
    /**
     * Add a book to user's cart
     * @param userId - User ID
     * @param data - Book ID and quantity
     * @returns Cart item
     * @throws Error if book not found, stock insufficient, or quantity invalid
     */

    async addToCart(userId: number, data: AddToCartDTO): Promise<CartItem> {
        const { book_id, quantity = 1 } = data;

        // 1. Business Logic: Check if book exists
        const book = await bookRepository.findById(book_id);
        if (!book) {
            const error = new Error('Book not found');
            (error as any).status = 404;
            throw error;
        }

         // 2. Business Logic: Check if stock is sufficient
        if (book.stock < quantity) {
            const error = new Error(`Insufficient stock. Available: ${book.stock}`);
            (error as any).status = 400;
            throw error;
        }

        // 3. Business Logic: Check if book already in cart
        const existingItem = await cartRepository.findCartItem(userId, book_id);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            
            if (book.stock < newQuantity) {
                const error = new Error(`Insufficient stock. Available: ${book.stock}`);
                (error as any).status = 400;
                throw error;
            }
            const updatedItem = await cartRepository.updateQuantity(userId, book_id, newQuantity);
            return updatedItem!;
        }

        // 4. Business Logic: Add new item to cart
        const cartItem = await cartRepository.create(userId, book_id, quantity);
        return cartItem;
    }

    // 2. VIEW CART 
    /**
     * Get user's cart with book details
     * @param userId - User ID
     * @returns Cart response with items, total items, total price
     */
    async getCart(userId: number): Promise<CartResponse> {
        // 1. Get cart items with book details from repository
        const cartItems = await cartRepository.findUserCart(userId);
        
        // 2. Calculate totals
        let totalItems = 0;
        let totalPrice = 0;
        
        const items: CartItemWithBook[] = cartItems.map((item: any) => {
            totalItems += item.quantity;
            totalPrice += parseFloat(item.total_price);
            
            return {
                id: item.id,
                user_id: item.user_id,
                book_id: item.book_id,
                quantity: item.quantity,
                created_at: item.created_at,
                updated_at: item.updated_at,
                title: item.title,
                author: item.author,
                price: parseFloat(item.price),
                image_url: item.image_url,
                total_price: parseFloat(item.total_price)
                };
        });

        // 3. Return cart response
        return {
            items,
            total_items: totalItems,
            total_price: totalPrice
        };
    }

    // 3. UPDATE QUANTITY
    /**
     * Update quantity of a book already in user's cart
     * @param userId - User ID
     * @param bookId - Book ID
     * @param quantity - New quantity
     * @returns Updated cart item
     * @throws Error if item not in cart or stock insufficient
     */

    async updateCartQuantity(userId: number, bookId: number, quantity: number): Promise<CartItem> {
        // Check if item exists in cart
        const existingItem = await cartRepository.findCartItem(userId, bookId);
        if (!existingItem) {
            const error = new Error('Item not found in cart');
            (error as any).status = 404;
            throw error;
        }

        // Check if book still has enough stock
    const book = await bookRepository.findById(bookId);
        if (!book) {
            const error = new Error('Book not found');
            (error as any).status = 404;
            throw error;
        }

        if (book.stock < quantity) {
            const error = new Error(`Insufficient stock. Available: ${book.stock}`);
            (error as any).status = 400;
            throw error;
        }

        // 3. Update quantity
        const updatedItem = await cartRepository.updateQuantity(userId, bookId, quantity);
        return updatedItem!;
    }

    // 4. REMOVE ITEM
    /**
     * Remove a book from user's cart
     * @param userId - User ID
     * @param bookId - Book ID
     * @returns Removed cart item
     * @throws Error if item not found in cart
     */
    async removeFromCart(userId: number, bookId: number): Promise<CartItem> {
        //  Check if item exists in cart
        const existingItem = await cartRepository.findCartItem(userId, bookId);
        if (!existingItem) {
            const error = new Error('Item not found in cart');
            (error as any).status = 404;
            throw error;
        }

        // 2. Remove item
        const removedItem = await cartRepository.remove(userId, bookId);
        return removedItem!;
    }

    // 5. CLEAR CART
    /**
     * Clear all items from user's cart
     * @param userId - User ID
     * @returns Number of items removed
     */
    async clearCart(userId: number): Promise<{ itemsRemoved: number }> {
        const itemsRemoved = await cartRepository.clearCart(userId);
        return { itemsRemoved };
    }
}