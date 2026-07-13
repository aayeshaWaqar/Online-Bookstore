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
}