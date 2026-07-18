import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateAddToCart, validateUpdateCartQuantity, validateCartBookId } from '../middleware/validation.middleware'; 

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

// PUT /api/cart/:bookId - Update quantity of an item in cart
router.put(
    '/:bookId',
    authenticate,
    validateUpdateCartQuantity,
    cartController.updateQuantity.bind(cartController)
);

// DELETE /api/cart/:bookId - Remove a specific item from cart
router.delete(
    '/:bookId',
    authenticate,
    validateCartBookId,
    cartController.removeItem.bind(cartController)
);

// DELETE /api/cart - Clear entire cart
router.delete(
    '/',
    authenticate,
    cartController.clearCart.bind(cartController)
);

export default router;
