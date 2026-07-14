import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types/category.types';

const categoryService = new CategoryService();

export class CategoryController {
    // 1. CREATE CATEGORY 
    /**
     * Create a new category (Admin only)
     * @param req - Request with category data in body
     * @param res - Response
     * @param next - Error handler
     */
    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryData: CreateCategoryDTO = req.body;

            const category = await categoryService.createCategory(categoryData);

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: { category }
            });
        }catch (error) {
            next(error);
        }
    }

    /**
     * Get all categories
     * @param req - Request
     * @param res - Response
     * @param next - Error handler
     */
    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();

            res.json({
                success: true,
                data: { categories }
            });
        } catch (error){
            next(error);
        }
    }

    // 3. GET CATEGORY BY ID 
    /**
     * Get a single category by ID
     * @param req - Request with category ID in params
     * @param res - Response
     * @param next - Error handler
     */
    async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const category = await categoryService.getCategoryById(id);

            res.json({
                success: true,
                data: { category }
            });
        } catch (error) {
            next(error);
        }
    }

    // 4. UPDATE CATEGORY 
    /**
     * Update a category (Admin only)
     * @param req - Request with category ID in params and data in body
     * @param res - Response
     * @param next - Error handler
     */
    async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const updateData: UpdateCategoryDTO = req.body;

            const category = await categoryService.updateCategory(id, updateData);

            res.json({
                success: true,
                 message: 'Category updated successfully',
                data: { category }
            });
        } catch (error) {
            next(error);
        }
    }

    // 5. DELETE CATEGORY 
    /**
     * Delete a category (Admin only)
     * @param req - Request with category ID in params
     * @param res - Response
     * @param next - Error handler
     */
    async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);

            await categoryService.deleteCategory(id);

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
    
}