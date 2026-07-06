import bcrypt from 'bcryptjs';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterUserDTO, UserResponse } from '../types/auth.types';

const authRepository = new AuthRepository();
const SALT_ROUNDS = 10;

export class AuthService {
    async register(userData: RegisterUserDTO): Promise<UserResponse> {
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
        return userWithoutPassword as UserResponse;
    }
}        