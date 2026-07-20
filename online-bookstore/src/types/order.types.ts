// Order interface (matches database schema)
export interface Order {
    id: number;
    user_id: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    shipping_address: string;
    order_date: Date;
    updated_at: Date;
}

// Order Item interface (matches database schema)
export interface OrderItem {
    id: number;
    order_id: number;
    book_id: number;
    quantity: number;
    price: number;       // price snapshot at order time
    created_at: Date;
}

// Order Item with book details (for response)
export interface OrderItemWithBook extends OrderItem {
    title: string;
    author: string;
    image_url?: string;
}

// PLACE ORDER DTO - Request Body
export interface PlaceOrderDTO {
    shipping_address: string;
}

// Full order response (order + its items)
export interface OrderWithItems extends Order {
    items: OrderItemWithBook[];
}