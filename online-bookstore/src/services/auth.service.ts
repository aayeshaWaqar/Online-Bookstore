import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterUserDTO, LoginUserDTO, AuthResponse } from '../types/auth.types';
import { UserWithoutPassword } from '../types/user.types'; 

const authRepository = new AuthRepository();
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRY = '7d';

export class AuthService {

// Register
async register(userData: RegisterUserDTO): Promise<UserWithoutPassword> {
        // 1. Check if user already exists
        const existingUser = await authRepository.findByEmail(userData.email);
        if (existingUser) {
            const error = new Error('User already exists with this email');
            (error as any).status = 400;
            throw error;
        }

// 2. Hash password
        const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

// 3. Create user with hashed password
        const user = await authRepository.create({
            ...userData,
            password: hashedPassword
        });

// 4. Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as UserWithoutPassword;
    }

// LOGIN 
    async login(credentials: LoginUserDTO): Promise<AuthResponse> {
        // 1. Find user by email
        const user = await authRepository.findByEmail(credentials.email);
        if (!user) {
            const error = new Error('Invalid email or password');
            (error as any).status = 401;
            throw error;
        }
        
// 2. Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            (error as any).status = 401;
            throw error;
        }
        
// 3. Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
        
// 4. Return token and user (without password)
        const { password, ...userWithoutPassword } = user;
        return {
            token,
            user: userWithoutPassword as UserWithoutPassword
        };
    }   

}        