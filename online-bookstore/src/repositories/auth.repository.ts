import pool from '../config/database';
import { User, RegisterUserDTO } from '../types/auth.types';

export class AuthRepository {  
    // find user by email
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return (result.rows[0] as User) || null;
    }

    // create new user
    async create(userData: RegisterUserDTO & { password: string }): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, phone) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [userData.name, userData.email, userData.password, userData.address || null, userData.phone || null]
        );
        return result.rows[0] as User;
    }
}