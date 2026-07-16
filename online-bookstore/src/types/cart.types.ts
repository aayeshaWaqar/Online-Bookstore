export interface CartItem {
    id: number;              // Primary key
    user_id: number;         // User who owns the cart
    book_id: number;         // Book in the cart
    quantity: number;        // Quantity of the book (default: 1)
    created_at: Date;
    updated_at: Date;
}

// 2. ADD TO CART DTO - Request Body
export interface AddToCartDTO {
    book_id: number;
    quantity?: number;  // Optional (default: 1)
}

                              // VIEW CART TYPES 

// Cart Item with Book Details
export interface CartItemWithBook extends CartItem {
    title: string;         // Book title
    author: string;        // Book author
    price: number;         // Book price
    image_url?: string;    // Book image (optional)
    total_price: number;   // quantity * price
}

// Cart Response
export interface CartResponse {
    items: CartItemWithBook[];
    total_items: number;   // Total quantity of all items
    total_price: number;   // Sum of all item totals
}