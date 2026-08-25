import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS, MOCK_COUPONS, INITIAL_USER_PROFILE, MOCK_ORDERS, MOCK_REVIEWS, MOCK_TICKETS, CATEGORIES, BRANDS } from './src/data/mockData';
import { Product, Order, Coupon, ProductReview, SupportTicket, UserProfile, UserRole } from './src/types';

// In-Memory Database Stores with clone of initial data
let productsDb: Product[] = [...MOCK_PRODUCTS];
let ordersDb: Order[] = [...MOCK_ORDERS];
let couponsDb: Coupon[] = [...MOCK_COUPONS];
let reviewsDb: ProductReview[] = [...MOCK_REVIEWS];
let ticketsDb: SupportTicket[] = [...MOCK_TICKETS];
let usersDb: Record<string, UserProfile> = {
  'usr-customer-01': { ...INITIAL_USER_PROFILE },
  'usr-admin-01': {
    id: 'usr-admin-01',
    name: 'Lord Arthur Sterling (Super Admin)',
    email: 'admin@menswear.com',
    role: 'super_admin',
    phone: '+1 (555) 000-1111',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isEmailVerified: true,
    addresses: [],
    walletBalance: 500,
    walletTransactions: [],
    loyaltyPoints: 9999,
    createdAt: '2025-01-01',
  },
  'usr-manager-01': {
    id: 'usr-manager-01',
    name: 'Julian Montgomery (Store Manager)',
    email: 'manager@menswear.com',
    role: 'store_manager',
    phone: '+1 (555) 777-2222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    isEmailVerified: true,
    addresses: [],
    walletBalance: 200,
    walletTransactions: [],
    loyaltyPoints: 3500,
    createdAt: '2025-06-15',
  },
};

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. PRODUCTS API
  app.get('/api/products', (req, res) => {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      fit,
      fabric,
      search,
      badge,
      sortBy,
      inStock,
    } = req.query;

    let results = [...productsDb];

    if (category && category !== 'all') {
      results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (brand) {
      const brandList = String(brand).split(',');
      results = results.filter((p) => brandList.includes(p.brand));
    }

    if (minPrice) {
      results = results.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter((p) => p.price <= Number(maxPrice));
    }

    if (size) {
      const sizeList = String(size).split(',');
      results = results.filter((p) => p.sizes.some((s) => sizeList.includes(s.size) && s.stock > 0));
    }

    if (fit) {
      const fitList = String(fit).split(',');
      results = results.filter((p) => fitList.includes(p.fit));
    }

    if (badge) {
      results = results.filter((p) => p.badge === badge);
    }

    if (inStock === 'true') {
      results = results.filter((p) => p.sizes.some((s) => s.stock > 0));
    }

    if (search) {
      const q = String(search).toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'discount') {
      results.sort((a, b) => b.discountPercent - a.discountPercent);
    }

    res.json({ products: results, total: results.length });
  });

  app.get('/api/products/:id', (req, res) => {
    const product = productsDb.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      reviewCount: 0,
      rating: 5.0,
    };
    productsDb.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const index = productsDb.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    productsDb[index] = { ...productsDb[index], ...req.body };
    res.json(productsDb[index]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const index = productsDb.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const removed = productsDb.splice(index, 1);
    res.json({ message: 'Product deleted', product: removed[0] });
  });

  // 2. CATEGORIES & BRANDS
  app.get('/api/categories', (req, res) => {
    res.json(CATEGORIES);
  });

  app.get('/api/brands', (req, res) => {
    res.json(BRANDS);
  });

  // 3. AUTHENTICATION & USERS
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    let user = Object.values(usersDb).find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      // Auto create customer or manager for seamless demo testing
      const newRole: UserRole = role || (email?.includes('admin') ? 'super_admin' : email?.includes('manager') ? 'store_manager' : 'customer');
      user = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role: newRole,
        isEmailVerified: true,
        addresses: [],
        walletBalance: 50,
        walletTransactions: [{ id: `tx-${Date.now()}`, type: 'credit', amount: 50, description: 'Welcome Gift Credit', date: new Date().toISOString().split('T')[0] }],
        loyaltyPoints: 500,
        createdAt: new Date().toISOString().split('T')[0],
      };
      usersDb[user.id] = user;
    }

    res.json({
      token: `jwt-token-${user.id}-${Date.now()}`,
      user,
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, role } = req.body;
    const existing = Object.values(usersDb).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      role: role || 'customer',
      isEmailVerified: false,
      addresses: [],
      walletBalance: 50,
      walletTransactions: [
        { id: `tx-${Date.now()}`, type: 'credit', amount: 50, description: 'Welcome Sign-up Bonus', date: new Date().toISOString().split('T')[0] },
      ],
      loyaltyPoints: 250,
      createdAt: new Date().toISOString().split('T')[0],
    };

    usersDb[newUser.id] = newUser;
    res.status(201).json({ user: newUser, token: `jwt-token-${newUser.id}` });
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const user = Object.values(usersDb).find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
    if (user) {
      user.isEmailVerified = true;
      return res.json({ success: true, message: 'Email verified successfully', user });
    }
    res.json({ success: true, message: 'OTP verified successfully' });
  });

  // 4. ORDERS API
  app.get('/api/orders', (req, res) => {
    const { userId, status, search } = req.query;
    let orders = [...ordersDb];

    if (userId) {
      orders = orders.filter((o) => o.userId === userId);
    }
    if (status && status !== 'all') {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === String(status).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q)
      );
    }

    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    const orderNumber = `ATL-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `DHL-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingNumber,
      courierPartner: 'DHL Express Luxury Air',
      orderStatus: 'Confirmed',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: 'Order placed securely.',
        },
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          note: 'Order payment verified and routed to Milan Atelier warehouse.',
        },
      ],
    };

    // Deduct stock
    orderData.items.forEach((item: any) => {
      const product = productsDb.find((p) => p.id === item.productId);
      if (product) {
        const sizeObj = product.sizes.find((s) => s.size === item.selectedSize);
        if (sizeObj && sizeObj.stock >= item.quantity) {
          sizeObj.stock -= item.quantity;
        }
      }
    });

    ordersDb.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status, note, location } = req.body;
    const order = ordersDb.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.orderStatus = status;
    order.timeline.push({
      status,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      location: location || 'Central Distribution Facility',
      note: note || `Order status updated to ${status}`,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    res.json(order);
  });

  // 5. COUPONS API
  app.get('/api/coupons', (req, res) => {
    res.json(couponsDb);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    const coupon = couponsDb.find((c) => c.code.toUpperCase() === (code || '').toUpperCase().trim());

    if (!coupon) {
      return res.status(404).json({ valid: false, error: 'Invalid coupon code' });
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, error: 'This coupon has expired' });
    }

    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({
        valid: false,
        error: `Minimum spend of $${coupon.minPurchase} required for this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'free_shipping') {
      discount = 15; // standard shipping fee offset
    }

    res.json({
      valid: true,
      code: coupon.code,
      discount: Math.min(discount, subtotal),
      discountType: coupon.discountType,
      description: coupon.description,
    });
  });

  // 6. REVIEWS API
  app.get('/api/reviews/:productId', (req, res) => {
    const productReviews = reviewsDb.filter((r) => r.productId === req.params.productId);
    res.json(productReviews);
  });

  app.post('/api/reviews', (req, res) => {
    const review: ProductReview = {
      ...req.body,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulVotes: 0,
      verifiedPurchase: true,
    };
    reviewsDb.unshift(review);

    // Update product rating
    const product = productsDb.find((p) => p.id === review.productId);
    if (product) {
      const allProductReviews = reviewsDb.filter((r) => r.productId === product.id);
      const avg = allProductReviews.reduce((acc, r) => acc + r.rating, 0) / allProductReviews.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewCount = allProductReviews.length;
    }

    res.status(201).json(review);
  });

  // 7. ANALYTICS & STATS (ADMIN & STORE MANAGER)
  app.get('/api/analytics/dashboard', (req, res) => {
    const totalRevenue = ordersDb
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = ordersDb.length;
    const pendingOrders = ordersDb.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
    const deliveredOrders = ordersDb.filter((o) => o.orderStatus === 'Delivered').length;

    const lowStockProducts = productsDb
      .map((p) => ({
        ...p,
        totalStock: p.sizes.reduce((sum, s) => sum + s.stock, 0),
      }))
      .filter((p) => p.totalStock < 10);

    const monthlySales = [
      { month: 'Jan', sales: 34500, orders: 120, profit: 14200 },
      { month: 'Feb', sales: 42100, orders: 145, profit: 18900 },
      { month: 'Mar', sales: 38900, orders: 135, profit: 16100 },
      { month: 'Apr', sales: 51200, orders: 180, profit: 22400 },
      { month: 'May', sales: 48000, orders: 165, profit: 20100 },
      { month: 'Jun', sales: 62400, orders: 210, profit: 27800 },
      { month: 'Jul', sales: 58900, orders: 195, profit: 25400 },
      { month: 'Aug', sales: 74200, orders: 245, profit: 33100 },
    ];

    const categoryBreakdown = [
      { name: 'Suits & Blazers', value: 42, color: '#1E293B' },
      { name: 'Shirts & Knits', value: 26, color: '#2563EB' },
      { name: 'Trousers & Denim', value: 16, color: '#D97706' },
      { name: 'Footwear & Accs', value: 16, color: '#059669' },
    ];

    res.json({
      revenue: totalRevenue + 128400,
      totalOrders: totalOrders + 820,
      totalCustomers: 2450,
      conversionRate: 3.84,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
      monthlySales,
      categoryBreakdown,
      topSelling: productsDb.slice(0, 5),
    });
  });

  // 8. AI FASHION STYLIST (GEMINI API)
  app.post('/api/stylist/advise', async (req, res) => {
    const { occasion, preferences, budget } = req.body;

    const catalogContext = productsDb.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: p.price,
      fabric: p.fabric,
      fit: p.fit,
      colors: p.colors.map((c) => c.name),
    }));

    try {
      const gemini = getGeminiClient();
      if (gemini) {
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the Master Fashion Stylist at Atelier & Co., an ultra-luxury men's wear fashion house.
A gentleman has requested personal styling consultation for the following occasion:
Occasion: "${occasion}"
Client Preferences: "${preferences || 'Refined modern sartorial'}"
Budget Target: "${budget || 'Any'}"

Available products in our Atelier catalog:
${JSON.stringify(catalogContext, null, 2)}

Provide a structured luxury style consultation. Return ONLY valid JSON in this exact structure without markdown code blocks:
{
  "occasion": "${occasion}",
  "styleAdvice": "A sophisticated, evocative paragraph explaining the sartorial philosophy for this look.",
  "recommendedProductIds": ["prod-01", "prod-02", "prod-07"],
  "stylingTips": [
    "Tip 1 on proportions or collar choice",
    "Tip 2 on footwear pairing or pocket square",
    "Tip 3 on grooming or scent"
  ]
}`,
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const recommendedProducts = productsDb.filter((p) => parsed.recommendedProductIds?.includes(p.id));
        const totalPrice = recommendedProducts.reduce((sum, p) => sum + p.price, 0);

        return res.json({
          occasion: parsed.occasion || occasion,
          styleAdvice: parsed.styleAdvice,
          recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : productsDb.slice(0, 3),
          totalPrice,
          stylingTips: parsed.stylingTips || [
            'Match your leather belt precisely with the patina of your footwear.',
            'Leave the bottom button of your waistcoat or suit jacket unbuttoned at all times.',
            'Ensure 1.5 cm of shirt cuff extends past the sleeve of your tailored jacket.',
          ],
        });
      }
    } catch (err) {
      console.warn('Gemini API call skipped or fallback triggered:', err);
    }

    // Fallback intelligent outfit recommendation
    let matchingProds = productsDb.slice(0, 3);
    const lowerOccasion = (occasion || '').toLowerCase();

    if (lowerOccasion.includes('wedding') || lowerOccasion.includes('formal') || lowerOccasion.includes('black tie')) {
      matchingProds = productsDb.filter((p) => ['Suits', 'Shirts', 'Shoes', 'Accessories'].includes(p.category)).slice(0, 3);
    } else if (lowerOccasion.includes('summer') || lowerOccasion.includes('beach') || lowerOccasion.includes('vacation')) {
      matchingProds = productsDb.filter((p) => ['Shirts', 'Trousers', 'Shoes'].includes(p.category)).slice(0, 3);
    } else if (lowerOccasion.includes('ethnic') || lowerOccasion.includes('traditional') || lowerOccasion.includes('diwali')) {
      matchingProds = productsDb.filter((p) => ['Ethnic Wear', 'Shoes', 'Perfumes'].includes(p.category)).slice(0, 3);
    }

    res.json({
      occasion: occasion || 'Smart Sartorial Occasion',
      styleAdvice: `For ${occasion || 'this occasion'}, our tailoring house recommends an ensemble balancing architectural shoulder structure with effortless Mediterranean breathability. Crisp tones ground the silhouette while tactile fabrics provide subtle luxury.`,
      recommendedProducts: matchingProds,
      totalPrice: matchingProds.reduce((sum, p) => sum + p.price, 0),
      stylingTips: [
        'Ensure 1.5 cm of shirt cuff extends past the jacket sleeve.',
        'Pair your leather footwear with an unpolished natural edge sole for contemporary elegance.',
        'Apply Eau de Parfum to collarbone and pulse points 15 minutes before dressing.',
      ],
    });
  });

  // 9. SUPPORT TICKETS
  app.get('/api/support-tickets', (req, res) => {
    res.json(ticketsDb);
  });

  app.post('/api/support-tickets', (req, res) => {
    const ticket: SupportTicket = {
      ...req.body,
      id: `tkt-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          sender: 'user',
          senderName: req.body.userName || 'Customer',
          text: req.body.initialMessage || req.body.subject,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };
    ticketsDb.unshift(ticket);
    res.status(201).json(ticket);
  });

  app.post('/api/support-tickets/:id/reply', (req, res) => {
    const ticket = ticketsDb.find((t) => t.id === req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const newMsg = {
      sender: req.body.sender || 'agent',
      senderName: req.body.senderName || 'Concierge Tailor',
      text: req.body.text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    ticket.messages.push(newMsg as any);
    if (req.body.status) ticket.status = req.body.status;
    res.json(ticket);
  });

  // Vite Middleware for SPA Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Luxury Men's Wear Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
