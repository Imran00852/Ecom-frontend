export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

export type Product = {
  name: string;
  category: string;
  photos: [
    {
      public_id: string;
      url: string;
    }
  ];
  ratings: number;
  numOfReviews: number;
  price: number;
  stock: number;
  description: string;
  _id: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  stock: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  _id: string;
};

export type Order = {
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  total: number;
  discount: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type UserRatio = {
  male: number;
  female: number;
};

type LatestTransactions = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  count: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: UserRatio;
  latestTransactions: LatestTransactions[];
};

//pie types
type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};

type UsersAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

export type Pie = {
  orderFullfillment: OrderFullfillment;
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  usersAgeGroup: UsersAgeGroup;
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};

export type Coupon = {
  _id: string;
  code: string;
  amount: number;
};

export type Review = {
  _id: string;
  comment: string;
  rating: number;
  user: {
    name: string;
    photo: string;
    _id: string;
  };
  product: string;
};
