import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export class OrderController {
    // 1. PLACE ORDER
    /**
     * Place an order from the user's cart
     * @param req - Request with shipping_address in body
     * @param res - Response
     * @param next - Error handler
     */
    async placeOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const { shipping_address } = req.body;

            const order = await orderService.placeOrder(userId, { shipping_address });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }
}