// input type for user registration
import { User, UserWithoutPassword } from './user.types';

export interface RegisterUserDTO {
 name: string;
 email: string;
 password: string;
 address?: string;
 phone?: string;
}

// User login input type
export interface LoginUserDTO {
    email: string;
    password: string;
}

// Auth response type
export interface AuthResponse {
    token: string;
    user: UserWithoutPassword;
}

// Re-export User types for convenience
export type { User, UserWithoutPassword };

