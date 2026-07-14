import pool from '../config/database';
import { Category, CreateCategoryDTO } from '../types/category.types';

export class CategoryRepository {
    // 1. FIND CATEGORY BY NAME - For Duplicate Check
    /**
     * Check if category name already exists
     * @param name - Category name to check
     * @returns Category or null
     */
    async findByName(name: string): Promise<Category | null> {
        const result = await pool.query(
            'SELECT * FROM categories WHERE name ILIKE $1',
            [name]
        );
        return (result.rows[0] as Category) || null;
    }

    // 2. CREATE CATEGORY 
    /**
     * Create a new category
     * @param categoryData - Category data from admin
     * @returns Created category object
     */
    async create(categoryData: CreateCategoryDTO): Promise<Category> {
        const { name, description } = categoryData;

        const result = await pool.query(
            `INSERT INTO categories (name, description) 
             VALUES ($1, $2) 
             RETURNING *`,
            [name, description || null]
        );

        return result.rows[0] as Category;
    }

    // ADD THIS METHOD - Get all categories
async findAll(): Promise<Category[]> {
    const result = await pool.query(
        'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows as Category[];
}

// ADD THIS METHOD - Get category by ID
async findById(id: number): Promise<Category | null> {
    const result = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
    );
    return (result.rows[0] as Category) || null;
}

}