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

// BOOK QUERY PARAMS - For GET All Books
export interface BookQueryParams {
    page?: number;    // OPTIONAL - Page number (default: 1)
    limit?: number;   // OPTIONAL - Books per page (default: 10, max: 100)
    search?: string;  // OPTIONAL - Search by title or author

    // Filter fields (Only price and author)
    minPrice?: number;    // OPTIONAL - Minimum price filter
    maxPrice?: number;    // OPTIONAL - Maximum price filter
    author?: string;      // OPTIONAL - Filter by author name
}

// BOOK RESPONSE - For Single Book Operations
export interface BookResponse {
    success: boolean;
    message?: string;
    data?: {
        book: Book;
    };
}


// 2. CREATE BOOK DTO - For Admin to Add New Book
export interface CreateBookDTO {
    title: string;             // REQUIRED - Book title
    author: string;            // REQUIRED - Author name
    description?: string;      // OPTIONAL - Book description
    price: number;             // REQUIRED - Price (must be > 0)
    stock: number;             // REQUIRED - Stock quantity (must be >= 0)
    category_id?: number;      // OPTIONAL - Category ID (references categories table)
    image_url?: string;        // OPTIONAL - Book cover image URL
    isbn?: string;             // OPTIONAL - ISBN number (should be unique)
    published_year?: number;   // OPTIONAL - Year of publication
}

// 3. UPDATE BOOK DTO - For Admin to Edit Book
// Partial<CreateBookDTO> means all fields are optional
export interface UpdateBookDTO extends Partial<CreateBookDTO> {
    // All fields from CreateBookDTO are optional here
    // Admin can update any field partially
}


