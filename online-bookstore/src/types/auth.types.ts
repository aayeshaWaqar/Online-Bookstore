// input type for user registration
export interface RegisterUserDTO {
 name: string;
 email: string;
 password: string;
 address?: string;
 phone?: string;
}

// User response type (hide password)
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
}

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