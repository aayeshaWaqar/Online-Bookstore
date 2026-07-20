import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validatePlaceOrder } from '../middleware/validation.middleware';

const router = Router();
const orderController = new OrderController();

// POST /api/orders - Place an order from cart
router.post(
    '/',
    authenticate,
    validatePlaceOrder,
    orderController.placeOrder.bind(orderController)
);

export default router;