import pool from '../config/database';
import { User } from '../types/user.types';

export class UserRepository {
    // Find user by ID 
    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return (result.rows[0] as User) || null;
    }
}