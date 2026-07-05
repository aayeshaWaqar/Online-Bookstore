// USER TYPES 

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  address?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

// BOOK TYPES

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  image_url?: string;
  isbn?: string;
  published_year?: number;
  is_active: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookDTO {
  title: string;
  author: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  image_url?: string;
  isbn?: string;
  published_year?: number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  image_url?: string;
  isbn?: string;
  published_year?: number;
  is_active?: boolean;
}

// CATEGORY TYPES

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

// CART TYPES 

export interface CartItem {
  id: number;
  user_id: number;
  book_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface AddToCartDTO {
  book_id: number;
  quantity: number;
}

export interface UpdateCartDTO {
  quantity: number;
}

// ORDER TYPES

export interface Order {
  id: number;
  user_id?: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  order_date: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface CreateOrderDTO {
  shipping_address: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// REVIEW TYPES

export interface Review {
  id: number;
  user_id: number;
  book_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
}

export interface CreateReviewDTO {
  book_id: number;
  rating: number;
  comment?: string;
}

//  API RESPONSE 

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// PAGINATION 

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// FILTERS 

export interface BookFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  author?: string;
  search?: string;
}