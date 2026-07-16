import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateAddToCart } from '../middleware/validation.middleware'; 

const router = Router();
const cartController = new CartController();

/*
 * POST /api/cart
 * Add a book to user's cart
 * Body: { book_id, quantity? }
 * Access: Authenticated user only
 */
router.post(
    '/', 
    authenticate,  // Check if user is logged in
    validateAddToCart,
    cartController.addToCart.bind(cartController)
);

// GET /api/cart - View cart 
router.get(
    '/', 
    authenticate, 
    cartController.getCart.bind(cartController)
);

export default router;
