// Book interface (matches database schema)
export interface Book {
    id: number;               // Primary key
    title: string;            // Book title (required)
    author: string;           // Author name (required)
    description?: string;     // Optional description
    price: number;            // Book price (decimal)
    stock: number;            // Available quantity
    category_id?: number;     // Foreign key to categories table
    image_url?: string;       // Optional image URL
    isbn?: string;            // Unique ISBN number
    published_year?: number;  // Year published
    is_active: boolean;       // Soft delete flag (true = active)
    deleted_at?: Date;        // Soft delete timestamp
    created_at: Date;         // Record creation timestamp
    updated_at: Date;         // Record update timestamp
}

// Response with pagination
export interface PaginatedBooksResponse {
    books: Book[];            // Array of books
    pagination: {
        total: number;        // Total books in database
        page: number;         // Current page number
        limit: number;        // Books per page
        totalPages: number;   // Total pages
    };
}

// Query params for pagination
export interface BookQueryParams {
    page?: number;    // Default: 1
    limit?: number;   // Default: 10
}