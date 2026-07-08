// user saved in database like this
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    address?: string;
    phone?: string;
    created_at: Date;
    updated_at: Date;
}

// User without password (for responses)
export interface UserWithoutPassword extends Omit<User, 'password'> {}

// Update profile DTO
export interface UpdateUserDTO {
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
}