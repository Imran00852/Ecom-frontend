import {
  Bar,
  CartItem,
  Coupon,
  Line,
  Order,
  Pie,
  Product,
  Review,
  ShippingInfo,
  Stats,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
  user?: User;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SearchProductsResponse = {
  success: boolean;
  products: Product[];
  totalPages: number;
};

export type SearchProductsQuery = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type ProductDetailsResponse = {
  success: boolean;
  product: Product;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type AllCouponsResponse = {
  success: boolean;
  coupons: Coupon[];
};

export type NewCouponResponse = {
  success: boolean;
  message: string;
};

export type UpdateCouponResponse = {
  success: boolean;
  message: string;
};

export type SingleCouponResponse = {
  success: boolean;
  coupon: Coupon;
};

export type AllReviewsResponse = {
  success: boolean;
  reviews: Review[];
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  total: number;
  discount: number;
  user: string;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: String;
};

export type NewCouponRequest = {
  id: string;
  code: string;
  amount: number;
};

export type UpdateCouponRequest = {
  adminId: string;
  couponId: string;
  code: string;
  amount: number;
};

export type DeleteCouponRequest = {
  adminId: string;
  couponId: string;
};

export type SingleCouponRequest = {
  adminId: string;
  couponId: string;
};

export type NewReviewRequest = {
  productId: string;
  userId: string;
  comment: string;
  rating: number;
};

export type DeleteReviewRequest = {
  reviewId: string;
  userId?: string;
};
