import React from 'react';
import { X, ArrowRightLeft, Trash2, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CompareDrawer: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, formatPrice, addToCart } = useStore();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-neutral-900 border-t-2 border-amber-600 shadow-2xl p-4 sm:p-6 transition-transform">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif-luxury text-lg font-bold text-neutral-950 dark:text-white">
              Garment Comparison Matrix ({compareList.length}/4)
            </h3>
          </div>
          <button
            onClick={clearCompare}
            className="text-xs text-stone-500 hover:text-rose-500 underline"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto">
          {compareList.map((product) => (
            <div
              key={product.id}
              className="bg-stone-50 dark:bg-neutral-800/60 rounded-xl p-3 border border-stone-200 dark:border-neutral-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                    {product.brand}
                  </span>
                  <button
                    onClick={() => toggleCompare(product)}
                    className="text-stone-400 hover:text-rose-500 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <img
                  src={product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[3/4] object-cover rounded-lg mb-2"
                />

                <h4 className="text-xs font-semibold text-stone-900 dark:text-white line-clamp-1 mb-1">
                  {product.title}
                </h4>

                <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400 mt-2">
                  <p><strong>Fabric:</strong> {product.fabric}</p>
                  <p><strong>Fit:</strong> {product.fit}</p>
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>Rating:</strong> ⭐ {product.rating} ({product.reviewCount})</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200 dark:border-neutral-700 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-950 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => addToCart(product, product.sizes[0]?.size || 'M', product.colors[0], 1)}
                  className="p-1.5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                  title="Add to bag"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
