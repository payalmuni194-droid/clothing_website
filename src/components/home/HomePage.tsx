import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Star,
  Quote,
  Eye,
  TrendingUp,
  Tag,
  Zap,
} from 'lucide-react';
import { HERO_BANNERS, CATEGORIES, MOCK_PRODUCTS } from '../../data/mockData';
import { ProductCard } from '../common/ProductCard';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  setCurrentView: (view: string, extra?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, setCurrentView }) => {
  const { setIsAiStylistOpen, formatPrice } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'trending' | 'bestsellers' | 'newarrivals' | 'flashsale'>('trending');

  // Flash sale countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate banner every 7 seconds
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 7000);
    return () => clearInterval(slideTimer);
  }, []);

  const currentBanner = HERO_BANNERS[currentSlide];

  // Filtered products for tabs
  const trendingProducts = MOCK_PRODUCTS.filter((p) => p.isTrending || p.rating >= 4.8);
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.isBestSeller);
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival || p.badge === 'New Arrival');
  const flashSaleProducts = MOCK_PRODUCTS.filter((p) => p.isFlashSale || p.discountPercent >= 20);

  const getActiveTabProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return bestSellers;
      case 'newarrivals':
        return newArrivals;
      case 'flashsale':
        return flashSaleProducts;
      case 'trending':
      default:
        return trendingProducts;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative min-h-[500px] lg:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-[#111827]">
          {/* Left Text Column */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center px-8 sm:px-14 py-12 text-white z-10">
            <span className="text-[#F59E0B] font-bold tracking-[0.3em] uppercase text-xs mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Fall / Winter 2026 Collection
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-4 tracking-tight">
              Redefining <br />
              <span className="font-serif-luxury font-bold italic text-white">Modern Elegance</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-md font-light leading-relaxed">
              Discover the precision of Italian sartorial tailoring combined with contemporary architectural silhouettes and breathable noble fabrics.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentView('shop')}
                className="bg-white text-[#111827] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#F59E0B] transition-colors shadow-lg flex items-center gap-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAiStylistOpen(true)}
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 sm:py-4 rounded-full font-bold uppercase text-xs tracking-widest transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>AI Stylist</span>
              </button>
            </div>
          </div>

          {/* Right Image Display with layered aesthetic */}
          <div className="w-full lg:w-2/5 relative min-h-[300px] lg:min-h-full bg-[#1F2937] overflow-hidden">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111827] via-[#111827]/40 to-transparent" />
            
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1))}
                className="p-2.5 rounded-full bg-black/50 hover:bg-[#2563EB] text-white backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {HERO_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-6 bg-[#F59E0B]' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length)}
                className="p-2.5 rounded-full bg-black/50 hover:bg-[#2563EB] text-white backdrop-blur-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2563EB] dark:text-[#3B82F6]">
              The Modern Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] dark:text-white mt-1">
              Curated Collections
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] hover:underline flex items-center gap-1.5 mt-2 sm:mt-0"
          >
            <span>View All Products &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              name: 'Suits & Tuxedos',
              tag: 'Super 150s Merino Wool',
              category: 'Suits',
              image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80',
            },
            {
              name: 'French Linen Shirts',
              tag: 'Normandy Washed Flax',
              category: 'Shirts',
              image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80',
            },
            {
              name: 'Japanese Selvedge',
              tag: 'Okayama Shuttle Looms',
              category: 'Jeans',
              image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=700&q=80',
            },
            {
              name: 'Royal Silk Ethnic',
              tag: 'Kashmiri Hand Embroidery',
              category: 'Ethnic Wear',
              image: 'https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?auto=format&fit=crop&w=700&q=80',
            },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() => setCurrentView('shop', { category: cat.category })}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#F59E0B] block mb-1">
                  {cat.tag}
                </span>
                <h3 className="font-bold text-lg text-white group-hover:text-[#F59E0B] transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED TABS & FLASH SALE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2563EB] dark:text-[#3B82F6]">
              New Arrivals / Today
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] dark:text-white mt-1">
              Seasonal Highlights
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'bestsellers', label: 'Best Sellers', icon: Star },
              { id: 'newarrivals', label: 'New Arrivals', icon: Sparkles },
              { id: 'flashsale', label: 'Limited Vault', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#111827] text-white dark:bg-white dark:text-[#111827] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Flash Sale Banner when active */}
        {activeTab === 'flashsale' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-950 via-[#111827] to-amber-950 rounded-2xl border border-red-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Limited 24-Hour VIP Vault Event</h3>
                <p className="text-xs text-gray-300">Enjoy up to 30% off selected cashmere sweaters, calfskin loafers, and suits.</p>
              </div>
            </div>

            {/* Countdown timer blocks */}
            <div className="flex items-center gap-2 text-center">
              <div className="bg-black/60 px-3 py-2 rounded-lg border border-white/10 min-w-[50px]">
                <span className="text-lg font-bold text-[#F59E0B]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase text-gray-400">Hours</span>
              </div>
              <span className="text-xl font-bold text-[#F59E0B]">:</span>
              <div className="bg-black/60 px-3 py-2 rounded-lg border border-white/10 min-w-[50px]">
                <span className="text-lg font-bold text-[#F59E0B]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase text-gray-400">Mins</span>
              </div>
              <span className="text-xl font-bold text-[#F59E0B]">:</span>
              <div className="bg-black/60 px-3 py-2 rounded-lg border border-white/10 min-w-[50px]">
                <span className="text-lg font-bold text-[#F59E0B]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="block text-[9px] uppercase text-gray-400">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getActiveTabProducts().slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE LOOKBOOK & HOTSPOT CAPSULE */}
      <section className="bg-[#111827] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#F59E0B] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Capsule 04 / The Riviera Edit
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Effortless Modern Grandeur
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Layering breathable European flax shirting under an open-weave hopsack jacket, grounded by Gurkha pleated trousers and hand-burnished penny loafers.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=150&q=80"
                  alt=""
                  className="w-14 h-16 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">French Normandy Pure Linen Shirt</h4>
                  <p className="text-[11px] text-gray-400">{formatPrice(110)} • Sky Azure</p>
                </div>
                <button
                  onClick={() => setCurrentView('shop', { category: 'Shirts' })}
                  className="p-2 bg-gray-800 hover:bg-[#2563EB] text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
                <img
                  src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=150&q=80"
                  alt=""
                  className="w-14 h-16 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white">Goodyear-Welted Calfskin Loafer</h4>
                  <p className="text-[11px] text-gray-400">{formatPrice(260)} • Dark Cognac</p>
                </div>
                <button
                  onClick={() => setCurrentView('shop', { category: 'Shoes' })}
                  className="p-2 bg-gray-800 hover:bg-[#2563EB] text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('shop')}
              className="px-8 py-4 bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#111827] font-bold uppercase tracking-wider text-xs rounded-full shadow-xl transition-all"
            >
              Shop The Complete Look
            </button>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80"
                alt="Riviera Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Interactive Hotspot Pins */}
              <div className="absolute top-[28%] left-[45%] group/pin cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#F59E0B] text-black flex items-center justify-center text-xs font-bold shadow-xl animate-bounce">
                  +
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-md rounded-xl border border-[#F59E0B]/40 text-xs shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                  <div className="font-bold text-[#F59E0B]">Hopsack Blazer</div>
                  <div className="text-[10px] text-gray-300">{formatPrice(340)}</div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[55%] group/pin cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#F59E0B] text-black flex items-center justify-center text-xs font-bold shadow-xl animate-bounce delay-150">
                  +
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900/95 backdrop-blur-md rounded-xl border border-[#F59E0B]/40 text-xs shadow-2xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none">
                  <div className="font-bold text-[#F59E0B]">Gurkha Pleated Trousers</div>
                  <div className="text-[10px] text-gray-300">{formatPrice(135)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRESS & GENTLEMAN TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2563EB] dark:text-[#3B82F6]">
            Critical Acclaim
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827] dark:text-white mt-1">
            Praised by Connoisseurs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'Atelier & Co. bridges the divide between Mayfair bespoke tailoring and effortless Italian sprezzatura.',
              author: 'GQ Sartorial Review',
              role: 'London Edition',
            },
            {
              quote: 'Their Normandy linen shirts and Biella wool suits define the wardrobe of the modern international gentleman.',
              author: 'Vogue Man',
              role: 'Milan Fashion Week Editorial',
            },
            {
              quote: 'The finest ready-to-wear shoulder construction and floating canvas we have tested south of Savile Row.',
              author: 'The Rake Magazine',
              role: 'Master Craftsmanship Award 2026',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between relative hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-[#F59E0B]/40 mb-4" />
              <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6">
                "{item.quote}"
              </p>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-base font-bold text-[#111827] dark:text-white">
                  {item.author}
                </h4>
                <p className="text-xs text-gray-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. INSTAGRAM LOOKBOOK GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#2563EB] dark:text-[#3B82F6]">
              #AtelierSartorial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white mt-1">
              Styled by the Global Fraternity
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">Follow @atelier.menswear</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1583875762487-5f8f7c718d14?auto=format&fit=crop&w=400&q=80',
          ].map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
              <img
                src={img}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#111827]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="text-xs font-semibold">View Look</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
