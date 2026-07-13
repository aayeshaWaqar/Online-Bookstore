import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDTO } from '../types/category.types';

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
}