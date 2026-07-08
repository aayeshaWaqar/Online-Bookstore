import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserController {
    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: 'Unauthorized'
                });
                return;
            }

            const user = await userService.getProfile(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
                return;
            }

            res.json({
                success: true,
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }
}