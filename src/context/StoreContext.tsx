import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  UserProfile,
  UserRole,
  CurrencyCode,
  Coupon,
  Order,
  NotificationItem,
  UserAddress,
} from '../types';
import { CURRENCIES, INITIAL_USER_PROFILE, MOCK_PRODUCTS, MOCK_COUPONS } from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
}

interface StoreContextType {
  // User & Auth
  currentUser: UserProfile;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  loginUser: (email: string, role?: UserRole) => Promise<boolean>;
  logoutUser: () => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: any, quantity?: number, giftWrap?: boolean) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  toggleGiftWrap: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  shippingFee: number;
  estimatedTax: number;
  cartTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // UI Modals & Drawers
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isAiStylistOpen: boolean;
  setIsAiStylistOpen: (open: boolean) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  isLiveSearchOpen: boolean;
  setIsLiveSearchOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;

  // Orders
  userOrders: Order[];
  createOrder: (orderData: Partial<Order>) => Promise<Order>;

  // Toasts
  toasts: Toast[];
  addToast: (type: Toast['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('atelier_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('atelier_currency') as CurrencyCode) || 'USD';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // UI Drawer states
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isLiveSearchOpen, setIsLiveSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Private Sale Access Unlocked',
      message: 'As an Atelier VIP, enjoy 20% off all Tailored Suits with code SARTORIAL20.',
      type: 'promo',
      isRead: false,
      timestamp: '2 hours ago',
    },
    {
      id: 'notif-2',
      title: 'Order ATL-98421 Dispatched',
      message: 'Your Italian wool suit is in transit via DHL Express.',
      type: 'order',
      isRead: false,
      timestamp: 'Yesterday',
    },
  ]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('atelier_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch initial user orders
  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserOrders(data);
        }
      })
      .catch(() => {});
  }, []);

  const addToast = (type: Toast['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('atelier_currency', code);
    addToast('info', `Currency Switched to ${code}`);
  };

  const formatPrice = (amountInUSD: number): string => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = amountInUSD * curr.rate;
    if (currency === 'INR') {
      return `${curr.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${curr.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // User & Role
  const setUserRole = (role: UserRole) => {
    let name = 'Alexandre DuPont';
    let email = 'alex@example.com';
    let avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

    if (role === 'super_admin') {
      name = 'Lord Arthur Sterling (Super Admin)';
      email = 'admin@menswear.com';
      avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
    } else if (role === 'store_manager') {
      name = 'Julian Montgomery (Store Manager)';
      email = 'manager@menswear.com';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80';
    }

    const updated: UserProfile = {
      ...currentUser,
      role,
      name,
      email,
      avatar,
    };
    setCurrentUser(updated);
    addToast('success', `Active Role Changed to: ${role.replace('_', ' ').toUpperCase()}`);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...profile }));
    addToast('success', 'Profile updated successfully');
  };

  const addAddress = (addrData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    setCurrentUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    addToast('success', 'New shipping address added');
  };

  const removeAddress = (id: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    addToast('info', 'Address removed');
  };

  const loginUser = async (email: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        addToast('success', `Welcome back, ${data.user.name}`);
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser({
      id: `usr-guest-${Date.now()}`,
      name: 'Guest Gentleman',
      email: 'guest@menswear.com',
      role: 'customer',
      isEmailVerified: false,
      addresses: [],
      walletBalance: 0,
      walletTransactions: [],
      loyaltyPoints: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });
    addToast('info', 'Signed out successfully');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    size: string,
    color: any,
    quantity = 1,
    giftWrap = false
  ) => {
    const colorObj = color || product.colors[0] || { name: 'Standard', hex: '#000000' };
    const cartItemId = `${product.id}-${size}-${colorObj.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedSize: size || (product.sizes[0]?.size ?? 'M'),
          selectedColor: colorObj,
          quantity,
          giftWrap,
        },
      ];
    });

    addToast('success', 'Added to Shopping Bag', `${product.title} (${size || 'M'})`);
    setIsMiniCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: qty } : item)));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    addToast('info', 'Item removed from bag');
  };

  const toggleGiftWrap = (itemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, giftWrap: !item.giftWrap } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const giftWrapTotal = cart.reduce((sum, item) => sum + (item.giftWrap ? 10 * item.quantity : 0), 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
        if (found) {
          setAppliedCoupon(found);
          addToast('success', `Coupon '${code}' Applied!`, found.description);
          return { success: true, message: 'Coupon applied successfully' };
        }
      }
      addToast('error', data.error || 'Invalid promotional code');
      return { success: false, message: data.error || 'Invalid code' };
    } catch {
      // Local fallback
      const found = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
      if (found && cartSubtotal >= found.minPurchase) {
        setAppliedCoupon(found);
        addToast('success', `Coupon '${code}' Applied!`, found.description);
        return { success: true, message: 'Coupon applied' };
      }
      addToast('error', 'Invalid code or minimum purchase not met');
      return { success: false, message: 'Invalid code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('info', 'Coupon removed');
  };

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
        couponDiscount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const shippingFee = cartSubtotal > 150 || appliedCoupon?.discountType === 'free_shipping' || cartSubtotal === 0 ? 0 : 15;
  const estimatedTax = (Math.max(0, cartSubtotal - couponDiscount) * 0.08); // 8% GST / State Tax
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee + giftWrapTotal + estimatedTax);

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast('info', 'Removed from Wishlist', product.title);
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast('success', 'Saved to Wishlist', product.title);
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.some((p) => p.id === productId);

  // Compare
  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast('info', 'Removed from comparison');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        addToast('warning', 'Maximum 4 garments can be compared simultaneously');
        return prev;
      }
      addToast('success', 'Added to comparison list');
      return [...prev, product];
    });
  };

  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);
  const clearCompare = () => setCompareList([]);

  // Recently Viewed
  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Create Order
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const orderPayload = {
      ...orderData,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || '+1 (555) 234-8900',
      items: cart.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        brand: item.product.brand,
        image: item.product.images[0],
        price: item.product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        sku: item.product.sku,
      })),
      subtotal: cartSubtotal,
      discount: couponDiscount,
      appliedCoupon: appliedCoupon?.code,
      tax: estimatedTax,
      shippingFee,
      giftWrapFee: giftWrapTotal,
      total: cartTotal,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const newOrder = await res.json();
      setUserOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return newOrder;
    } catch {
      // Local fallback
      const mockNewOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `ATL-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || '',
        items: orderPayload.items as any,
        shippingAddress: orderPayload.shippingAddress as any,
        billingAddress: orderPayload.billingAddress as any,
        paymentMethod: orderPayload.paymentMethod as any || 'card',
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        trackingNumber: `DHL-${Math.floor(10000000 + Math.random() * 90000000)}`,
        courierPartner: 'DHL Express Luxury Air',
        estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        subtotal: cartSubtotal,
        discount: couponDiscount,
        appliedCoupon: appliedCoupon?.code,
        tax: estimatedTax,
        shippingFee,
        giftWrapFee: giftWrapTotal,
        total: cartTotal,
        createdAt: new Date().toISOString(),
        timeline: [
          { status: 'Pending', timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '), note: 'Order placed securely.' },
          { status: 'Confirmed', timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '), note: 'Payment verified.' },
        ],
      };
      setUserOrders((prev) => [mockNewOrder, ...prev]);
      clearCart();
      return mockNewOrder;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        setUserRole,
        updateUserProfile,
        addAddress,
        removeAddress,
        loginUser,
        logoutUser,
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleGiftWrap,
        clearCart,
        cartSubtotal,
        cartCount,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        shippingFee,
        estimatedTax,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        isMiniCartOpen,
        setIsMiniCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAiStylistOpen,
        setIsAiStylistOpen,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isLiveSearchOpen,
        setIsLiveSearchOpen,
        recentlyViewed,
        addRecentlyViewed,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        unreadNotificationsCount,
        userOrders,
        createOrder,
        toasts,
        addToast,
        removeToast,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
