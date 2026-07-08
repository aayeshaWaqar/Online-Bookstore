import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserWithoutPassword } from '../types/user.types';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password, address, phone } = req.body;
            
            // only basic validation
            if (!name || !email || !password) {
                const error = new Error('Name, email and password are required');
                (error as any).status = 400;
                throw error;
            }
 
const user = await authService.register({ 
                name, 
                email, 
                password, 
                address, 
                phone 
            });
            
 res.status(201).json({ 
                success: true,
                message: 'User registered successfully',
                data: { user }
            });
        } catch (error) {
            next(error); // Send error to middleware
        }
    }

// LOGIN 
async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;
            
         // Basic validation
         if (!email || !password) {
            const error = new Error('Email and password are required');
            (error as any).status = 400;
              throw error;
        }
          
// Call service 
            const result = await authService.login({ email, password });
            
            res.json({ 
                success: true,
                message: 'Login successful',
                data: result  // { token, user }
            });
        } catch (error) {
            next(error);
        }
    }   
       

}            



