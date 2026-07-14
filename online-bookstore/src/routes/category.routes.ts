import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { validateCategory, validateId } from '../middleware/validation.middleware';

const router = Router();
const categoryController = new CategoryController();

// ADMIN ROUTES - Authentication + Admin Required
/**
 * POST /api/categories
 * Create a new category (Admin only)
 * Body: name, description
 * Access: Admin only
 */
router.post(
    '/', 
    authenticate,     // 1. Check if user is logged in
    isAdmin,          // 2. Check if user is admin
    validateCategory,
    categoryController.createCategory.bind(categoryController)
);

// GET /api/categories - Get all categories 
router.get('/', categoryController.getAllCategories.bind(categoryController));

// GET /api/categories/:id - Get category by ID 
router.get('/:id', validateId, categoryController.getCategoryById.bind(categoryController));

// PUT /api/categories/:id - Update category (Admin only) 
router.put(
    '/:id', 
    authenticate, 
    isAdmin, 
    validateId, 
    validateCategory, 
    categoryController.updateCategory.bind(categoryController)
);

// DELETE /api/categories/:id - Delete category (Admin only) 
router.delete(
    '/:id', 
    authenticate, 
    isAdmin, 
    validateId, 
    categoryController.deleteCategory.bind(categoryController)
);

export default router;
