import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO, Category, UpdateCategoryDTO } from '../types/category.types';

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

    async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category> {
    // Check if category exists
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
        const error = new Error('Category not found');
        (error as any).status = 404;
        throw error;
    }

    // Check if any fields to update
    if (Object.keys(data).length === 0) {
        const error = new Error('No fields to update');
        (error as any).status = 400;
        throw error;
    }
    // Check duplicate name
    if (data.name && data.name !== existingCategory.name) {
        const nameExists = await categoryRepository.findByName(data.name);
        if (nameExists) {
            const error = new Error('Category with this name already exists');
            (error as any).status = 400;
            throw error;
        }
    }

    const updatedCategory = await categoryRepository.update(id, data);
    if (!updatedCategory) {
        const error = new Error('Failed to update category');
        (error as any).status = 500;
        throw error;
    }
    return updatedCategory;
}

// 5. DELETE CATEGORY 
    /**
     * Delete a category (Admin only)
     * @param id - Category ID to delete
     * @throws Error if category not found
     */
    async deleteCategory(id: number): Promise<void> {
        // 1. Business Logic: Check if category exists
        const existingCategory = await categoryRepository.findById(id);
        if (!existingCategory) {
            const error = new Error('Category not found');
            (error as any).status = 404;
            throw error;
        }

    const deleted = await categoryRepository.delete(id);
        if (!deleted) {
            const error = new Error('Failed to delete category');
            (error as any).status = 500;
            throw error;
        }
    }
}
