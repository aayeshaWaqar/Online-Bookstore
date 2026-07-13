// 1. CATEGORY INTERFACE - Matches Database Schema
export interface Category {
    id: number;                // Primary key - Auto generated
    name: string;              // REQUIRED - Category name (unique)
    description?: string;      // OPTIONAL - Category description
    created_at: Date;          // Record creation timestamp
}

// 2. CREATE CATEGORY DTO - For Admin to Add Category
export interface CreateCategoryDTO {
    name: string;              // REQUIRED - Category name (min 2 chars)
    description?: string;      // OPTIONAL - Category description
}

// 3. UPDATE CATEGORY DTO - For Admin to Edit Category
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
    // All fields optional - partial update allowed
}

