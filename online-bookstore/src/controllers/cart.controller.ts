import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { AddToCartDTO } from '../types/cart.types';

const cartService = new CartService();

export class CartController {
    async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get user ID from authenticated user (set by auth middleware)
            const userId = (req as any).user?.id;
            
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }
            const cartData: AddToCartDTO = req.body;

            const cartItem = await cartService.addToCart(userId, cartData);

            res.status(201).json({
                success: true,
                message: 'Book added to cart successfully',
                data: { cartItem }
            });
        } catch (error) {
            next(error);
        }
    }

     // 2. VIEW CART 
    /**
     * Get user's cart with book details
     * @param req - Request with user info
     * @param res - Response
     * @param next - Error handler
     */
    async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const cart = await cartService.getCart(userId);

            res.json({
                success: true,
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }

    // 3. UPDATE QUANTITY
    /**
     * Update quantity of an item in user's cart
     * @param req - Request with bookId param and quantity in body
     * @param res - Response
     * @param next - Error handler
     */
    async updateQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const bookId = (req as any).validatedBookId;
            const { quantity } = req.body;

            const updatedItem = await cartService.updateCartQuantity(userId, bookId, quantity);

            res.json({
                success: true,
                message: 'Cart quantity updated successfully',
                data: { cartItem: updatedItem }
            });
        } catch (error) {
            next(error);
        }
    }

    // 4. REMOVE ITEM
    /**
     * Remove a specific item from user's cart
     * @param req - Request with bookId param
     * @param res - Response
     * @param next - Error handler
     */
    async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const bookId = parseInt(req.params.bookId as string);

            const removedItem = await cartService.removeFromCart(userId, bookId);

            res.json({
                success: true,
                message: 'Item removed from cart successfully',
                data: { cartItem: removedItem }
            });
        } catch (error) {
            next(error);
        }
    }

    // 5. CLEAR CART
    /**
     * Clear all items from user's cart
     * @param req - Request with user info
     * @param res - Response
     * @param next - Error handler
     */
    async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const result = await cartService.clearCart(userId);

            res.json({
                success: true,
                message: 'Cart cleared successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}