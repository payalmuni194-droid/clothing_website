import React, { useState } from 'react';
import { X, Star, Heart, Check, ShieldCheck, Ruler, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductColor } from '../../types';

interface QuickViewModalProps {
  onViewDetails: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onViewDetails }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const product = quickViewProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product?.colors[0] || { name: 'Standard', hex: '#000' }
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes[0]?.size || 'M'
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isFavorite = isWishlisted(product.id);
  const currentStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-neutral-800 z-10 grid grid-cols-1 md:grid-cols-2">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Image Gallery */}
          <div className="p-6 bg-stone-50 dark:bg-neutral-950 flex flex-col justify-between">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-200 dark:bg-neutral-800 mb-4">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail rail */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Meta & Purchase Form */}
          <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="uppercase tracking-widest font-semibold text-amber-600 dark:text-amber-400">
                  {product.brand}
                </span>
                <span className="text-stone-400">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-white leading-tight mb-2">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-stone-200 dark:border-neutral-800">
                <span className="text-2xl font-bold text-neutral-950 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Color selection */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-2">
                  <span>Color: {selectedColor.name}</span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
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

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold uppercase text-stone-700 dark:text-stone-300 mb-2">
                  <span>Size: {selectedSize}</span>
                  <span className="text-[11px] text-amber-600 font-medium cursor-pointer">
                    Fit: {product.fit}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      disabled={s.stock === 0}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        selectedSize === s.size
                          ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                          : 'border-stone-200 dark:border-neutral-700 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                      } disabled:opacity-30 disabled:line-through`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>

                {currentStock < 5 && currentStock > 0 && (
                  <p className="text-[11px] text-amber-600 mt-2 font-medium">
                    ⚡ Only {currentStock} units remaining in size {selectedSize}
                  </p>
                )}
              </div>

              {/* Description preview */}
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-6">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {currentStock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:border-rose-800'
                      : 'border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  onViewDetails(product.id);
                }}
                className="w-full text-center text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-600 flex items-center justify-center gap-1.5 py-1"
              >
                <span>View Full Garment Specifications & Size Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
