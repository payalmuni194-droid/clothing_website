export type UserRole = 'super_admin' | 'store_manager' | 'customer';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD (1.0)
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  addresses: UserAddress[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  loyaltyPoints: number;
  createdAt: string;
}

export interface ProductVariantSize {
  size: string; // 'XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
  photos?: string[];
  helpfulVotes: number;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  category: string; // 'Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Blazers', 'Suits', 'Jackets', 'Ethnic Wear', 'Accessories', 'Shoes', 'Perfumes'
  subcategory: string;
  sku: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductVariantSize[];
  videoUrl?: string;
  description: string;
  fabric: string; // '100% Italian Linen', 'Japanese Selvedge Denim', 'Pure Mulberry Silk', etc.
  fit: 'Slim Fit' | 'Regular Fit' | 'Relaxed Fit' | 'Tailored Fit' | 'Oversized';
  sleeve?: 'Full Sleeve' | 'Half Sleeve' | 'Sleeveless';
  specifications: Record<string, string>;
  features: string[];
  careInstructions: string[];
  tags: string[];
  badge?: 'New Arrival' | 'Best Seller' | 'Trending' | 'Limited Edition' | 'Flash Sale';
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  giftWrap?: boolean;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Refunded';

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: string;
  location?: string;
  note: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  brand: string;
  image: string;
  price: number;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  shippingAddress: UserAddress;
  billingAddress: UserAddress;
  paymentMethod: 'stripe' | 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber: string;
  courierPartner: string;
  estimatedDelivery: string;
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  tax: number; // GST
  shippingFee: number;
  giftWrapFee: number;
  total: number;
  createdAt: string;
  timeline: OrderTimelineItem[];
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'inventory';
  isRead: boolean;
  timestamp: string;
  link?: string;
}

export interface HeroBanner {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  accentColor: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderNumber?: string;
  subject: string;
  category: 'Order Issue' | 'Return & Refund' | 'Sizing & Fit' | 'Payment' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  messages: {
    sender: 'user' | 'agent';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface FilterState {
  category: string | null;
  subcategory: string | null;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  fits: string[];
  fabrics: string[];
  ratings: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount';
  searchQuery: string;
}

export type Address = UserAddress;

export type PaymentMethod = 'stripe' | 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod';

export const PaymentMethod = {
  STRIPE: 'stripe' as const,
  RAZORPAY: 'razorpay' as const,
  COD: 'cod' as const,
  CARD: 'card' as const,
  UPI: 'upi' as const,
  NETBANKING: 'netbanking' as const,
};

export interface AIStylistOutfit {
  occasion: string;
  styleAdvice: string;
  recommendedProducts: Product[];
  totalPrice: number;
  stylingTips: string[];
}
