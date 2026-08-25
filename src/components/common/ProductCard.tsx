import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Sparkles, Check, ArrowRightLeft } from 'lucide-react';
import { Product, ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    toggleCompare,
    isInCompare,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<string | null>(null);

  const isFavorite = isWishlisted(product.id);
  const inComparison = isInCompare(product.id);

  const displayImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : selectedColor?.image || product.images[0];

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, size, selectedColor, 1);
    setSelectedQuickSize(size);
    setTimeout(() => setSelectedQuickSize(null), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 cursor-pointer"
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        <img
          src={displayImage}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2 py-1 text-[10px] font-black tracking-tight uppercase rounded shadow-sm ${
              product.badge === 'Flash Sale'
                ? 'bg-red-600 text-white'
                : product.badge === 'Best Seller'
                ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827]'
                : product.badge === 'Limited Edition'
                ? 'bg-[#F59E0B] text-white'
                : 'bg-[#2563EB] text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#111827]/80 text-white backdrop-blur-md rounded w-fit">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Top-Right Action Floating Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isFavorite
                ? 'bg-red-50 text-red-600 dark:bg-red-950/80 dark:text-red-400'
                : 'bg-white/90 text-gray-700 hover:text-[#2563EB] hover:bg-white dark:bg-gray-900/90 dark:text-gray-300'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:text-[#2563EB] hover:bg-white dark:bg-gray-900/90 dark:text-gray-300 backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 ${
              inComparison
                ? 'bg-[#2563EB] text-white'
                : 'bg-white/90 text-gray-700 hover:text-[#2563EB] hover:bg-white dark:bg-gray-900/90 dark:text-gray-300'
            }`}
            title="Compare Product"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Size Selector Bar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1.5 z-10">
          <div className="text-[10px] uppercase font-bold tracking-wider text-gray-200">
            Quick Add Size:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={(e) => handleQuickAdd(s.size, e)}
                className={`px-2 py-1 text-[10px] font-bold rounded bg-white text-gray-900 hover:bg-[#2563EB] hover:text-white transition-colors disabled:opacity-40 disabled:line-through ${
                  selectedQuickSize === s.size ? 'bg-emerald-500 text-white' : ''
                }`}
              >
                {selectedQuickSize === s.size ? <Check className="w-3 h-3 inline" /> : s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="flex flex-col flex-1 px-1">
        {/* Brand & Subtitle */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span className="uppercase tracking-wider font-semibold text-[11px]">{product.brand}</span>
          <div className="flex items-center gap-1 text-[#F59E0B]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h4
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="font-bold text-[13px] text-[#111827] dark:text-white hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors line-clamp-1 cursor-pointer mb-1"
        >
          {product.title}
        </h4>

        {/* Fabric / Fit description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2.5">
          {product.fabric} • {product.fit}
        </p>

        {/* Color Swatches */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColor.name === c.name
                    ? 'ring-2 ring-[#111827] dark:ring-white scale-110 border-white'
                    : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">{product.colors.length} shades</span>
          </div>
        )}

        {/* Price & Add to Bag Trigger */}
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-[#2563EB] dark:text-[#3B82F6]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#111827] hover:text-white dark:bg-gray-800 dark:hover:bg-white dark:hover:text-[#111827] transition-all"
            title="Inspect Garment"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
