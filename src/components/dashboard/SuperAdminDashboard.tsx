import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Layers,
  Tag,
  Search,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../../context/StoreContext';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_COUPONS } from '../../data/mockData';
import { Product, Order, Coupon } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const { formatPrice, addToast } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'coupons'>('analytics');
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [ordersList, setOrdersList] = useState<Order[]>(MOCK_ORDERS);
  const [couponsList, setCouponsList] = useState<Coupon[]>(MOCK_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(100);

  // Restock Modal
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(15);

  // Analytics mock data
  const revenueTrend = [
    { month: 'Jan', revenue: 145000, orders: 420 },
    { month: 'Feb', revenue: 168000, orders: 490 },
    { month: 'Mar', revenue: 215000, orders: 610 },
    { month: 'Apr', revenue: 198000, orders: 580 },
    { month: 'May', revenue: 265000, orders: 740 },
    { month: 'Jun', revenue: 310000, orders: 890 },
  ];

  const categoryShare = [
    { name: 'Suits & Tuxedos', value: 45, color: '#D97706' },
    { name: 'Normandy Linen Shirts', value: 25, color: '#1E293B' },
    { name: 'Japanese Denim', value: 15, color: '#2563EB' },
    { name: 'Calfskin Footwear', value: 15, color: '#059669' },
  ];

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrdersList(
      ordersList.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    addToast('success', `Order #${orderId} updated to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
    addToast('info', 'Product removed from catalog');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProductsList(productsList.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      addToast('success', 'Garment details updated successfully');
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const coup: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      description: `${newCouponDiscount}% VIP atelier discount`,
      discountType: 'percentage',
      discountValue: newCouponDiscount,
      minPurchase: newCouponMin,
      expiresAt: '2027-01-01',
      usageLimit: 500,
      usedCount: 0,
    };

    setCouponsList([coup, ...couponsList]);
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    addToast('success', `Coupon ${coup.code} Activated`);
  };

  const handleRestock = () => {
    if (!restockProduct) return;
    setProductsList(
      productsList.map((p) => {
        if (p.id === restockProduct.id) {
          return {
            ...p,
            sizes: p.sizes.map((s) => ({ ...s, stock: s.stock + restockQty })),
          };
        }
        return p;
      })
    );
    addToast('success', `Restocked +${restockQty} units for ${restockProduct.title}`);
    setRestockProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-neutral-950 text-white rounded-3xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500 text-neutral-950">
              Super Admin Console
            </span>
            <span className="text-xs text-stone-400">Atelier Executive Headquarters</span>
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold mt-1">Global Commerce & Inventory</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProduct({
                id: `prod-${Date.now()}`,
                title: 'New Sartorial Garment',
                brand: 'Atelier Milano',
                category: 'Suits',
                price: 495,
                originalPrice: 595,
                discountPercent: 15,
                rating: 5.0,
                reviewCount: 1,
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80'],
                colors: [{ name: 'Midnight Navy', hex: '#1E293B' }],
                sizes: [{ size: '38R', stock: 10 }, { size: '40R', stock: 12 }, { size: '42R', stock: 8 }],
                fabric: '100% Super 150s Wool',
                fit: 'Tailored Fit',
                description: 'Bespoke cut piece crafted from Italian fabric.',
                features: ['Full canvas construction', 'Horn buttons'],
                specifications: { 'Origin': 'Biella, Italy', 'Weave': 'Twill' },
                careInstructions: ['Dry clean only'],
                sku: `ATL-${Math.floor(1000 + Math.random() * 9000)}`,
                tags: ['luxury', 'tailored'],
                isNewArrival: true,
                createdAt: new Date().toISOString(),
              });
              setIsProductModalOpen(true);
            }}
            className="px-4 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gross Monthly Revenue', value: '$310,000', change: '+24.8% vs last month', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Active Dispatches', value: '42 Orders', change: '8 pending DHL courier', icon: Truck, color: 'text-amber-500' },
          { label: 'Registered Connoisseurs', value: '1,420 Clients', change: '+18% VIP signups', icon: Users, color: 'text-sky-500' },
          { label: 'Low Stock SKU Warning', value: '3 Garments', change: 'Action required', icon: AlertTriangle, color: 'text-rose-500' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-stone-500">
                <span className="text-xs font-bold uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-extrabold font-serif-luxury text-neutral-950 dark:text-white">
                {kpi.value}
              </div>
              <p className="text-[11px] text-stone-500 font-medium">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-stone-200 dark:border-neutral-800">
        {[
          { id: 'analytics', label: 'Financial & Growth Analytics', icon: BarChart3 },
          { id: 'products', label: `Garments & Catalog (${productsList.length})`, icon: Layers },
          { id: 'orders', label: `Orders Fulfillment (${ordersList.length})`, icon: Package },
          { id: 'inventory', label: 'Stock & Restock Manager', icon: AlertTriangle },
          { id: 'coupons', label: `Promotions & Coupons (${couponsList.length})`, icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-500" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-luxury text-xl font-bold">Revenue Velocity (YTD)</h3>
              <span className="text-xs text-stone-500">Super 150s & French Linen Surging</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Share Pie */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold">Category Distribution</h3>
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45} paddingAngle={4}>
                    {categoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {categoryShare.map((cat) => (
                <div key={cat.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-stone-600 dark:text-stone-400">{cat.name}</span>
                  </div>
                  <span className="font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search products by SKU or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl text-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 dark:border-neutral-700 uppercase font-bold text-stone-400">
                  <th className="py-3">Garment</th>
                  <th className="py-3">SKU</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Stock Units</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                {productsList
                  .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((prod) => {
                    const totalStock = prod.sizes.reduce((sum, s) => sum + s.stock, 0);
                    return (
                      <tr key={prod.id} className="hover:bg-stone-50 dark:hover:bg-neutral-800/50">
                        <td className="py-3 flex items-center gap-3">
                          <img src={prod.images[0]} alt="" className="w-10 h-14 object-cover rounded-lg" />
                          <div>
                            <span className="font-bold text-neutral-950 dark:text-white block">{prod.title}</span>
                            <span className="text-[10px] text-stone-400">{prod.brand}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono font-bold text-stone-500">{prod.sku}</td>
                        <td className="py-3">{prod.category}</td>
                        <td className="py-3 font-bold">{formatPrice(prod.price)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${totalStock < 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {totalStock} pcs
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsProductModalOpen(true);
                            }}
                            className="p-1.5 text-stone-500 hover:text-amber-600"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
          <h3 className="font-serif-luxury text-xl font-bold">Consignment Fulfillment Queue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 dark:border-neutral-700 uppercase font-bold text-stone-400">
                  <th className="py-3">Order Code</th>
                  <th className="py-3">Recipient</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Payment</th>
                  <th className="py-3">Status Pipeline</th>
                  <th className="py-3 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                {ordersList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50 dark:hover:bg-neutral-800/50">
                    <td className="py-3 font-mono font-bold text-amber-600">#{ord.orderNumber}</td>
                    <td className="py-3">
                      <span className="font-bold block">{ord.shippingAddress.fullName}</span>
                      <span className="text-[10px] text-stone-400">{ord.shippingAddress.city}, {ord.shippingAddress.country}</span>
                    </td>
                    <td className="py-3 font-bold">{formatPrice(ord.totalAmount)}</td>
                    <td className="py-3 capitalize">
                      <span className="px-2 py-0.5 bg-stone-100 dark:bg-neutral-800 rounded font-semibold text-[10px]">
                        {ord.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="p-1.5 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs font-bold capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Tailoring / Packing</option>
                        <option value="shipped">Shipped (DHL)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => window.print()}
                        className="text-stone-500 hover:text-amber-600 font-bold underline text-[11px]"
                      >
                        Print Manifest
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INVENTORY LOW STOCK */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
          <h3 className="font-serif-luxury text-xl font-bold">Inventory Low-Stock Alerts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {productsList.map((prod) => {
              const stock = prod.sizes.reduce((s, x) => s + x.stock, 0);
              return (
                <div key={prod.id} className="p-4 rounded-2xl border border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={prod.images[0]} alt="" className="w-12 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[150px]">{prod.title}</h4>
                      <span className="text-[11px] font-bold text-amber-600">{stock} total in stock</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setRestockProduct(prod)}
                    className="px-3 py-1.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-bold uppercase rounded-lg"
                  >
                    Restock +
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif-luxury text-xl font-bold">Active VIP Promotion Vouchers</h3>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {couponsList.map((coup) => (
              <div key={coup.code} className="p-5 rounded-2xl border border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/30 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono font-bold text-amber-600">{coup.code}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded uppercase">Active</span>
                </div>
                <p className="text-xs font-bold">{coup.discountValue}% Discount on Orders {formatPrice(coup.minPurchase)}+</p>
                <p className="text-[10px] text-stone-400">Used {coup.usedCount} times • Limit {coup.usageLimit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setRestockProduct(null)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold">Restock Atelier Inventory</h3>
              <p className="text-xs text-stone-500">{restockProduct.title}</p>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Add Units to all sizes</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRestock}
                  className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase text-xs rounded-xl"
                >
                  Confirm Restock
                </button>
                <button
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-3 border border-stone-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsCouponModalOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold">Create VIP Promo Voucher</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. MILANVIP20"
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Minimum Cart Subtotal ($)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase rounded-xl"
                  >
                    Activate Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-4 py-3 border border-stone-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold">Edit Garment Catalog Details</h3>
              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Fabric & Texture</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase rounded-xl"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-3 border border-stone-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
