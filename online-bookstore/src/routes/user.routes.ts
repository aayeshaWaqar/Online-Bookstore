import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Protected route - Use auth middleware 
router.get('/profile', authenticate, userController.getProfile.bind(userController));

export default router;