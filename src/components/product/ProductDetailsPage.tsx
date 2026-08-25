import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  Share2,
  Check,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Layers,
  ArrowRightLeft,
  Plus,
  Minus,
  MessageSquare,
  Camera,
  RotateCw,
} from 'lucide-react';
import { Product, ProductColor, ProductReview } from '../../types';
import { useStore } from '../../context/StoreContext';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';

interface ProductDetailsPageProps {
  productId: string;
  onSelectProduct: (product: Product) => void;
  onNavigateToCheckout: () => void;
  setCurrentView: (view: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onSelectProduct,
  onNavigateToCheckout,
  setCurrentView,
}) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isInCompare,
    addToast,
    addRecentlyViewed,
  } = useStore();

  const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      window.scrollTo(0, 0);
    }
  }, [product]);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotationFrame, setRotationFrame] = useState(0);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.size || 'M');
  const [quantity, setQuantity] = useState(1);

  // UI state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'fit' | 'shipping' | 'care'>('specs');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review form
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(MOCK_REVIEWS);

  // Frequently bought together bundle
  const bundleItems = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);
  const [includeBundle, setIncludeBundle] = useState(true);

  const isFavorite = isWishlisted(product.id);
  const inComparison = isInCompare(product.id);
  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const stock = currentSizeObj?.stock || 0;

  // Zoom magnifier
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[selectedImageIndex] || product.images[0]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '250%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onNavigateToCheckout();
  };

  const handleAddBundleToBag = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    bundleItems.forEach((item) => {
      addToCart(item, item.sizes[0]?.size || 'M', item.colors[0], 1);
    });
    addToast('success', 'Complete 3-Piece Look Added to Bag with 10% Bundle Discount!');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: 'u-curr',
      userName: reviewerName.trim() || 'Lord Gentleman',
      rating: newRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
      date: 'Today',
      helpfulVotes: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    addToast('success', 'Review published. Thank you for your feedback!');
  };

  // Bundle pricing
  const bundleSubtotal = product.price + bundleItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscounted = bundleSubtotal * 0.9;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => setCurrentView('home')} className="hover:text-black">Home</button>
        <span>/</span>
        <button onClick={() => setCurrentView('shop')} className="hover:text-black">Collections</button>
        <span>/</span>
        <button onClick={() => setCurrentView('shop')} className="hover:text-black">{product.category}</button>
        <span>/</span>
        <span className="text-neutral-950 dark:text-white font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Garment Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Image Gallery & 360 viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnail rail */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[560px] pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setIs360Mode(false);
                  }}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx && !is360Mode
                      ? 'border-neutral-950 dark:border-white ring-2 ring-amber-500/50'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* 360 Interactive Simulation button */}
              <button
                onClick={() => setIs360Mode(true)}
                className={`w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden shrink-0 border-2 bg-stone-900 text-amber-400 flex flex-col items-center justify-center text-center p-1 transition-all ${
                  is360Mode ? 'border-amber-400 ring-2 ring-amber-500' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                title="360 Rotation View"
              >
                <RotateCw className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold uppercase">360° View</span>
              </button>
            </div>

            {/* Main Stage Image with Zoom Magnifier */}
            <div
              className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-800 cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {is360Mode ? (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-white select-none cursor-ew-resize"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const frame = Math.floor(percent * product.images.length);
                    setRotationFrame(Math.max(0, Math.min(product.images.length - 1, frame)));
                  }}
                >
                  <img
                    src={product.images[rotationFrame] || product.images[0]}
                    alt=""
                    className="h-4/5 object-contain"
                  />
                  <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Drag horizontally across image to inspect full 360° drape</span>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    ref={imageRef}
                    src={product.images[selectedImageIndex] || product.images[0]}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />

                  {/* Zoom Lens Box */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl border border-white/20 shadow-2xl transition-opacity duration-200"
                    style={zoomStyle}
                  />

                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.badge && (
                      <span className="px-3 py-1 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Product Meta & Purchase Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & SKU */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="uppercase font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400">
                {product.brand}
              </span>
              <span className="text-stone-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white leading-tight">
              {product.title}
            </h1>

            {product.subtitle && (
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Rating & Reviews counter */}
          <div className="flex items-center gap-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-950 dark:text-white">
              {product.rating} / 5.0
            </span>
            <span className="text-xs text-stone-400">({product.reviewCount} Verified Client Reviews)</span>
          </div>

          {/* Price & Taxes */}
          <div className="p-4 bg-stone-50 dark:bg-neutral-900 rounded-xl border border-stone-200 dark:border-neutral-800">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-neutral-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-md">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Inclusive of all custom duties & GST. Complimentary express shipping over $150.
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2">
              <span>Shade: {selectedColor.name}</span>
            </div>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor.name === c.name
                      ? 'border-neutral-950 dark:border-white ring-2 ring-amber-500 scale-110'
                      : 'border-stone-300 dark:border-neutral-700 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector & Fit Guide Trigger */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-2">
              <span>Select Size: {selectedSize}</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline lowercase first-letter:uppercase"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide & Fit Calculator</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`py-3 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                    selectedSize === s.size
                      ? 'bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950 shadow-md'
                      : 'bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-800 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                  } disabled:opacity-30 disabled:line-through`}
                >
                  <div>{s.size}</div>
                  <div className="text-[10px] font-normal opacity-70">
                    {s.stock === 0 ? 'Out of Stock' : `${s.stock} left`}
                  </div>
                </button>
              ))}
            </div>

            {stock < 5 && stock > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2">
                ⚡ Limited availability: Only {stock} pieces remaining in atelier inventory.
              </p>
            )}
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              {/* Quantity counter */}
              <div className="flex items-center border border-stone-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 px-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 text-stone-500 hover:text-black dark:hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
                  className="p-2 text-stone-500 hover:text-black dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 py-4 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{stock === 0 ? 'Sold Out' : 'Add to Shopping Bag'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-800'
                    : 'bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={stock === 0}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              Express Checkout • Buy Now
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-200 dark:border-neutral-800 text-center text-[11px] text-stone-600 dark:text-stone-400">
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-neutral-900">
              <Truck className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              <span>Complimentary Express</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-neutral-900">
              <RefreshCw className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              <span>30-Day Doorstep Returns</span>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-neutral-900">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-amber-600" />
              <span>Italian Authenticity</span>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      <section className="p-6 sm:p-8 bg-stone-900 text-white rounded-3xl border border-stone-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> The Complete Wardrobe Ensemble
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold mt-1">Frequently Acquired Together</h3>
          </div>
          <div className="text-xs text-stone-300">
            Bundle Discount: <strong className="text-amber-400">Save 10% on the complete look</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-wrap sm:flex-nowrap items-center gap-4">
            {/* Primary garment */}
            <div className="w-28 sm:w-32 bg-neutral-950 p-2 rounded-xl border border-stone-800 shrink-0">
              <img src={product.images[0]} alt="" className="w-full aspect-[3/4] object-cover rounded-lg mb-2" />
              <p className="text-[11px] font-bold truncate">{product.title}</p>
              <p className="text-[10px] text-amber-400">{formatPrice(product.price)}</p>
            </div>

            <span className="text-2xl font-bold text-stone-500">+</span>

            {/* Bundle item 1 */}
            <div className="w-28 sm:w-32 bg-neutral-950 p-2 rounded-xl border border-stone-800 shrink-0">
              <img src={bundleItems[0]?.images[0]} alt="" className="w-full aspect-[3/4] object-cover rounded-lg mb-2" />
              <p className="text-[11px] font-bold truncate">{bundleItems[0]?.title}</p>
              <p className="text-[10px] text-amber-400">{formatPrice(bundleItems[0]?.price || 0)}</p>
            </div>

            <span className="text-2xl font-bold text-stone-500">+</span>

            {/* Bundle item 2 */}
            <div className="w-28 sm:w-32 bg-neutral-950 p-2 rounded-xl border border-stone-800 shrink-0">
              <img src={bundleItems[1]?.images[0]} alt="" className="w-full aspect-[3/4] object-cover rounded-lg mb-2" />
              <p className="text-[11px] font-bold truncate">{bundleItems[1]?.title}</p>
              <p className="text-[10px] text-amber-400">{formatPrice(bundleItems[1]?.price || 0)}</p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-neutral-950 p-6 rounded-2xl border border-stone-800 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Individual Total:</span>
                <span className="line-through">{formatPrice(bundleSubtotal)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white">
                <span>Bundle Price:</span>
                <span className="text-amber-400">{formatPrice(bundleDiscounted)}</span>
              </div>
            </div>

            <button
              onClick={handleAddBundleToBag}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All 3 to Bag (Save 10%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED SPECIFICATIONS ACCORDION TABS */}
      <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-wrap gap-4 border-b border-stone-200 dark:border-neutral-800 pb-4 mb-8">
          {[
            { id: 'specs', label: 'Fabric & Specifications' },
            { id: 'fit', label: 'Tailoring & Measurements' },
            { id: 'shipping', label: 'Shipping & White-Glove Returns' },
            { id: 'care', label: 'Garment Longevity Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? 'text-neutral-950 dark:text-white border-b-2 border-amber-600'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-6 animate-fadeIn">
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl">
              {product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2.5 border-b border-stone-100 dark:border-neutral-800 text-xs">
                  <span className="font-semibold text-stone-500">{key}</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">{val}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white mb-3">
                Key Sartorial Features
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Fit & Tailoring */}
        {activeTab === 'fit' && (
          <div className="space-y-4 animate-fadeIn text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Cut Profile: {product.fit}
            </h4>
            <p>
              Designed with balanced ease across the chest and shoulders, gently tapering along the waistline. Our tailored cut provides modern sleekness without restricting movement.
            </p>
            <div className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-xl border border-stone-200 dark:border-neutral-700">
              <span className="font-bold block mb-1">Master Tailor Recommendation:</span>
              <span>If you are between chest sizes or prefer a traditional English drape with layering, we suggest taking one size up.</span>
            </div>
          </div>
        )}

        {/* Tab 3: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 animate-fadeIn text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Express Global Logistics
            </h4>
            <p>
              All orders are dispatched from our Milan or Mayfair fulfillment hubs via DHL Express. Estimated transit time is 3–5 business days with full door-to-door tracking and direct signature requirement.
            </p>
            <p>
              We offer 30-day complimentary returns and size exchanges. Simply request a return via your Customer Dashboard and our courier will collect the package from your residence.
            </p>
          </div>
        )}

        {/* Tab 4: Care Guide */}
        {activeTab === 'care' && (
          <div className="space-y-3 animate-fadeIn text-xs text-stone-600 dark:text-stone-300">
            <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Care Instructions for Longevity
            </h4>
            <ul className="space-y-2">
              {product.careInstructions.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* CUSTOMER REVIEWS & RATINGS SECTION */}
      <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-neutral-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400">
              Verified Client Impressions
            </span>
            <h3 className="font-serif-luxury text-3xl font-bold text-neutral-950 dark:text-white mt-1">
              Customer Reviews ({reviewsList.length})
            </h3>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl bg-stone-50 dark:bg-neutral-800/40 border border-stone-100 dark:border-neutral-800 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs">
                    {rev.userName[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-950 dark:text-white flex items-center gap-1.5">
                      {rev.userName}
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          ✓ Verified Buyer
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                </div>

                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">{rev.title}</h5>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WRITE A REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsReviewModalOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-6">
              <h3 className="font-serif-luxury text-2xl font-bold">Write a Client Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Alexandre DuPont"
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`p-2 rounded-lg border text-xs font-bold ${
                          newRating >= star ? 'bg-amber-500 text-black border-amber-500' : 'border-stone-200'
                        }`}
                      >
                        ★ {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="e.g. Exceptional Biella drape and finish"
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Detailed Review</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the texture, shoulder construction, drape, and sizing experience..."
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase text-xs rounded-xl"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-5 py-3 border border-stone-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsSizeGuideOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-800">
                <h3 className="font-serif-luxury text-2xl font-bold">Atelier Size Chart & Fit Guide</h3>
                <button onClick={() => setIsSizeGuideOpen(false)} className="p-1">
                  ✕
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-stone-300 dark:border-neutral-700 uppercase font-bold text-stone-500">
                      <th className="py-2">Size</th>
                      <th className="py-2">Chest (Inches)</th>
                      <th className="py-2">Shoulder (Inches)</th>
                      <th className="py-2">Waist (Inches)</th>
                      <th className="py-2">Sleeve (Inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                    <tr><td className="py-2 font-bold">38R (S)</td><td>38 - 39"</td><td>17.5"</td><td>31 - 32"</td><td>33"</td></tr>
                    <tr><td className="py-2 font-bold">40R (M)</td><td>40 - 41"</td><td>18.2"</td><td>33 - 34"</td><td>34"</td></tr>
                    <tr><td className="py-2 font-bold">42R (L)</td><td>42 - 43"</td><td>19.0"</td><td>35 - 36"</td><td>34.5"</td></tr>
                    <tr><td className="py-2 font-bold">44R (XL)</td><td>44 - 45"</td><td>19.8"</td><td>37 - 38"</td><td>35"</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 text-xs text-stone-700 dark:text-stone-300">
                ✨ <strong>Need personalized measurement advice?</strong> Our bespoke master tailors provide complimentary virtual fitting consultations. Contact the concierge via live ticket.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
