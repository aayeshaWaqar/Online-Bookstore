import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO, Category } from '../types/category.types';

const categoryRepository = new CategoryRepository();

export class CategoryService {
    // 1. CREATE CATEGORY 
    /**
     * Create a new category (Admin only)
     * @param categoryData - Category data from admin
     * @returns Created category
     * @throws Error if name already exists or validation fails
     */
    async createCategory(categoryData: CreateCategoryDTO): Promise<Category> {
        // Check if category name already exists
        const existingCategory = await categoryRepository.findByName(categoryData.name);
        if (existingCategory) {
            const error = new Error('Category with this name already exists');
            (error as any).status = 400;
            throw error;
        }
        // Create category
        const category = await categoryRepository.create(categoryData);
        return category;
    }

    // 2. GET ALL CATEGORIES 
    /**
     * Get all categories
     * @returns Array of categories sorted by name
     */
    async getAllCategories(): Promise<Category[]> {
        const categories = await categoryRepository.findAll();
        return categories;
    }

    // 3. GET CATEGORY BY ID 
    /**
     * Get a single category by its ID
     * @param id - Category ID
     * @returns Category object
     * @throws Error if category not found
     */
    async getCategoryById(id: number): Promise<Category> {
        const category = await categoryRepository.findById(id);
        if (!category) {
            const error = new Error('Category not found');
            (error as any).status = 404;
            throw error;
        }
        return category;
    }
}
