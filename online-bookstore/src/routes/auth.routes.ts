// router is a function that helps to make routes
import {Router} from 'express';

import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// User registration route
router.post('/register', authController.register);

export default router;