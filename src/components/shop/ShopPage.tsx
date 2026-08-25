import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Grid3X3,
  Grid2X2,
  LayoutGrid,
  List,
  ChevronDown,
  X,
  Star,
  Check,
  Search,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES, BRANDS } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSearch,
  onSelectProduct,
}) => {
  const { formatPrice } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount'>('featured');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4 | 1>(4);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available filter values dynamically derived
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38R', '40R', '42R', '44R'];
  const allColors = [
    { name: 'Navy', hex: '#1E293B' },
    { name: 'Black', hex: '#111827' },
    { name: 'White', hex: '#F8FAFC' },
    { name: 'Azure', hex: '#93C5FD' },
    { name: 'Camel', hex: '#D97706' },
    { name: 'Olive', hex: '#3F4E28' },
    { name: 'Burgundy', hex: '#881337' },
    { name: 'Gold', hex: '#FEF3C7' },
  ];
  const allFits = ['Tailored Fit', 'Regular Fit', 'Slim Fit', 'Relaxed Fit'];
  const allFabrics = ['100% Super 150s Merino Wool', '100% French Normandy Linen', '100% Japanese Selvedge Cotton', '100% Pure Mongolian Cashmere', '100% Handloom Tussar Silk'];

  // Toggle helper
  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMaxPrice(1000);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setMinRating(null);
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (maxPrice < 1000 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedFits.length +
    selectedFabrics.length +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (minRating ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      // Sizes
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
      ) {
        return false;
      }
      // Colors
      if (
        selectedColors.length > 0 &&
        !product.colors.some((c) => selectedColors.some((sc) => c.name.toLowerCase().includes(sc.toLowerCase())))
      ) {
        return false;
      }
      // Fits
      if (selectedFits.length > 0 && !selectedFits.includes(product.fit)) {
        return false;
      }
      // Fabrics
      if (selectedFabrics.length > 0 && !selectedFabrics.some((f) => product.fabric.includes(f))) {
        return false;
      }
      // In-stock
      if (inStockOnly && !product.sizes.some((s) => s.stock > 0)) {
        return false;
      }
      // On sale
      if (onSaleOnly && product.discountPercent <= 0) {
        return false;
      }
      // Rating
      if (minRating !== null && product.rating < minRating) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.title.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.fabric.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0;
    });
  }, [
    selectedCategory,
    selectedBrands,
    maxPrice,
    selectedSizes,
    selectedColors,
    selectedFits,
    selectedFabrics,
    inStockOnly,
    setOnSaleOnly,
    onSaleOnly,
    minRating,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span>Home</span>
          <span>/</span>
          <span>Collections</span>
          <span>/</span>
          <span className="text-neutral-950 dark:text-white font-semibold capitalize">
            {selectedCategory === 'all' ? 'All Menswear' : selectedCategory}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
              {selectedCategory === 'all' ? 'The Atelier Catalog' : selectedCategory}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Showing {filteredProducts.length} curated luxury garments
            </p>
          </div>

          {/* Quick Search in catalog */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter by fabric, SKU or cut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Toggle (mobile), Sort, Grid switch, Active Filter chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 mb-8 shadow-sm">
        {/* Mobile Filter Drawer trigger */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs font-bold uppercase"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters ({activeFiltersCount})</span>
        </button>

        {/* Active Filter Chips */}
        <div className="hidden lg:flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Active:
          </span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-neutral-800 text-xs rounded-full font-medium">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
            </span>
          )}
          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-neutral-800 text-xs rounded-full font-medium">
              {b}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleItem(selectedBrands, setSelectedBrands, b)} />
            </span>
          ))}
          {maxPrice < 1000 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-neutral-800 text-xs rounded-full font-medium">
              Under {formatPrice(maxPrice)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(1000)} />
            </span>
          )}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          )}
        </div>

        {/* Right: Grid Switcher & Sort By */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Grid Layout Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setGridColumns(2)}
              className={`p-1.5 rounded ${gridColumns === 2 ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-stone-400'}`}
              title="2 Columns"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridColumns(3)}
              className={`p-1.5 rounded ${gridColumns === 3 ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-stone-400'}`}
              title="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridColumns(4)}
              className={`p-1.5 rounded ${gridColumns === 4 ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-stone-400'}`}
              title="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-100 dark:bg-neutral-800 border-none rounded-lg px-3 py-2 text-xs font-semibold text-neutral-950 dark:text-white focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
              <option value="discount">Biggest Savings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-stone-200 dark:border-neutral-800 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-950 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              Sartorial Filters
            </h3>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-black rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {/* 1. Category selector */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
              Categories
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              <span>Max Price</span>
              <span className="text-amber-600 font-extrabold">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>{formatPrice(50)}</span>
              <span>{formatPrice(1000)}</span>
            </div>
          </div>

          {/* 3. Brands */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
              Fashion Houses & Ateliers
            </h4>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-2 text-xs">
              {BRANDS.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Sizes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
              Garment Sizes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleItem(selectedSizes, setSelectedSizes, size)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                      isSelected
                        ? 'bg-neutral-950 text-white border-neutral-950 dark:bg-white dark:text-neutral-950'
                        : 'border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Colors */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-3">
              Color Palette
            </h4>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleItem(selectedColors, setSelectedColors, color.name)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      isSelected
                        ? 'ring-2 ring-amber-500 scale-110 border-white'
                        : 'border-stone-300 dark:border-neutral-600 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          {/* 6. Fits & Availability */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-neutral-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
              />
              <span>On Sale / Vault Discounts</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-400 mx-auto mb-4">
                <Search className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-neutral-950 dark:text-white mb-2">
                No Sartorial Pieces Matched Your Criteria
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-6">
                Try widening your price range, clearing selected color filters, or exploring another category.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                gridColumns === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : gridColumns === 3
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-neutral-900 shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-neutral-800">
                  <h3 className="font-serif-luxury text-xl font-bold">Filters</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category select */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    Max Price: {formatPrice(maxPrice)}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase text-xs rounded-xl"
                >
                  Apply Filters ({filteredProducts.length} Results)
                </button>
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 text-stone-500 text-xs font-semibold"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
