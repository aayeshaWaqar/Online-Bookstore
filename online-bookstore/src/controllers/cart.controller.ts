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
}