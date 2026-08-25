import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  User,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Mic,
  Compass,
  SlidersHorizontal,
  Bell,
  CheckCircle,
  Clock,
  LogOut,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/mockData';
import { CurrencyCode, UserRole } from '../../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string, extra?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const {
    cartCount,
    wishlist,
    setIsMiniCartOpen,
    setIsAiStylistOpen,
    currentUser,
    userRole,
    setUserRole,
    currency,
    setCurrency,
    isDarkMode,
    toggleDarkMode,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    logoutUser,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop', { search: searchQuery.trim() });
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Collections', view: 'shop' },
    { label: 'Suits & Tailoring', view: 'shop', category: 'Suits' },
    { label: 'Linen Shirts', view: 'shop', category: 'Shirts' },
    { label: 'Ethnic Capsule', view: 'shop', category: 'Ethnic Wear' },
    { label: 'Footwear & Accs', view: 'shop', category: 'Shoes' },
    { label: 'Lookbook', view: 'lookbook' },
    { label: 'Track Order', view: 'track-order' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 dark:bg-neutral-900/95 dark:border-neutral-800 transition-colors">
      {/* Top Announcement Bar */}
      <div className="bg-[#111827] text-white text-[11px] py-2.5 px-4 sm:px-8 border-b border-gray-800 tracking-widest uppercase font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              Complimentary Express Shipping on Orders Above $250 • Use Code <strong className="text-white tracking-wider">WELCOME15</strong>
            </span>
          </div>

          <div className="w-full md:w-auto flex items-center justify-between md:justify-end space-x-5 text-gray-300">
            <span
              onClick={() => setCurrentView('shop')}
              className="cursor-pointer hover:text-[#F59E0B] transition-colors hidden sm:inline"
            >
              Store Locator
            </span>
            <span
              onClick={() => setCurrentView('customer-dashboard')}
              className="cursor-pointer hover:text-[#F59E0B] transition-colors hidden sm:inline"
            >
              Support
            </span>

            {/* Currency Selector */}
            <div className="relative" ref={currencyMenuRef}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-[#F59E0B] transition-colors text-[11px] font-semibold uppercase"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 text-gray-800 dark:text-gray-200">
                  {(['USD', 'INR', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        currency === c ? 'font-bold text-[#2563EB] dark:text-[#3B82F6]' : ''
                      }`}
                    >
                      <span>{c}</span>
                      {currency === c && <span className="text-xs text-[#2563EB]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-gray-600">|</span>

            {/* Quick RBAC Role Switcher Pill */}
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 px-2.5 py-1 rounded-full text-[11px] transition-colors"
                title="Switch User Role for instant RBAC demo testing"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="capitalize font-medium">Role: {userRole.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 z-50 text-gray-800 dark:text-gray-200">
                  <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase px-2 py-1 tracking-wider">
                    Role-Based Access Control (RBAC)
                  </div>
                  <button
                    onClick={() => {
                      setUserRole('super_admin');
                      setIsRoleDropdownOpen(false);
                      setCurrentView('admin-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition-colors ${
                      userRole === 'super_admin' ? 'bg-blue-50 dark:bg-gray-800 font-semibold text-[#2563EB] dark:text-[#3B82F6]' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">1. Super Admin</div>
                      <div className="text-[10px] text-gray-500">Revenue, Products, Inventory, CMS</div>
                    </div>
                    {userRole === 'super_admin' && <span className="text-xs text-[#2563EB]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('store_manager');
                      setIsRoleDropdownOpen(false);
                      setCurrentView('manager-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition-colors ${
                      userRole === 'store_manager' ? 'bg-blue-50 dark:bg-gray-800 font-semibold text-[#2563EB] dark:text-[#3B82F6]' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">2. Store Manager</div>
                      <div className="text-[10px] text-gray-500">Orders, Stock Adjust, Dispatch</div>
                    </div>
                    {userRole === 'store_manager' && <span className="text-xs text-[#2563EB]">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setUserRole('customer');
                      setIsRoleDropdownOpen(false);
                      setCurrentView('customer-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between transition-colors ${
                      userRole === 'customer' ? 'bg-blue-50 dark:bg-gray-800 font-semibold text-[#2563EB] dark:text-[#3B82F6]' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">3. Customer</div>
                      <div className="text-[10px] text-gray-500">Shop, Wishlist, Orders, Wallet</div>
                    </div>
                    {userRole === 'customer' && <span className="text-xs text-[#2563EB]">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('home')}
            className="cursor-pointer flex flex-col items-center lg:items-start group"
          >
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#111827] dark:text-white transition-all">
              MODERN<span className="text-[#2563EB]">.</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] text-gray-500 uppercase font-semibold -mt-1 group-hover:text-[#2563EB] transition-colors">
              Atelier Men's Wear
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => setCurrentView(link.view, link.category ? { category: link.category } : undefined)}
                className={`transition-colors hover:text-[#111827] dark:hover:text-white ${
                  currentView === link.view ? 'text-[#111827] dark:text-white border-b-2 border-[#111827] dark:border-white pb-1 font-bold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Mega Menu Trigger for all categories */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                onClick={() => setCurrentView('shop')}
                className="flex items-center gap-1 hover:text-[#111827] dark:hover:text-white transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isMegaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[600px] z-50">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Formal & Tailored</h4>
                      <ul className="space-y-2 text-xs normal-case">
                        {['Suits', 'Blazers', 'Shirts', 'Trousers'].map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => {
                                setCurrentView('shop', { category: cat });
                                setIsMegaMenuOpen(false);
                              }}
                              className="text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors"
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Casual & Street</h4>
                      <ul className="space-y-2 text-xs normal-case">
                        {['T-Shirts', 'Jeans', 'Jackets', 'Ethnic Wear'].map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => {
                                setCurrentView('shop', { category: cat });
                                setIsMegaMenuOpen(false);
                              }}
                              className="text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors"
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Essentials</h4>
                      <ul className="space-y-2 text-xs normal-case">
                        {['Shoes', 'Accessories', 'Perfumes'].map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => {
                                setCurrentView('shop', { category: cat });
                                setIsMegaMenuOpen(false);
                              }}
                              className="text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors"
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-[11px] text-gray-600 dark:text-gray-400 normal-case">
                        ✨ Need style consultation?
                        <button
                          onClick={() => {
                            setIsAiStylistOpen(true);
                            setIsMegaMenuOpen(false);
                          }}
                          className="mt-1 block text-[#2563EB] dark:text-[#3B82F6] font-semibold hover:underline"
                        >
                          Ask Gemini AI Stylist &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Live Search Trigger */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none rounded-full py-2 pl-9 pr-4 text-xs sm:text-sm w-36 sm:w-60 focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>

            {/* AI Fashion Stylist Concierge Button */}
            <button
              onClick={() => setIsAiStylistOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111827] text-white hover:bg-[#2563EB] shadow-sm transition-all hover:scale-105 text-xs font-bold uppercase tracking-wider"
              title="AI Fashion Stylist Consultation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline">AI Stylist</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 z-50">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                      Notifications ({unreadNotificationsCount})
                    </h3>
                    <span className="text-[10px] text-[#2563EB] cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          n.isRead ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{n.title}</div>
                        <p className="text-gray-600 dark:text-gray-400 text-[11px] leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-gray-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors relative"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag / MiniCart */}
            <button
              onClick={() => setIsMiniCartOpen(true)}
              className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#2563EB] transition-colors relative group"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Role Entrypoint */}
            <button
              onClick={() => {
                if (userRole === 'super_admin') setCurrentView('admin-dashboard');
                else if (userRole === 'store_manager') setCurrentView('manager-dashboard');
                else setCurrentView('customer-dashboard');
              }}
              className="flex items-center gap-1.5 p-1 pl-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="My Account / Dashboard"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
              <span className="text-[11px] font-semibold hidden md:inline max-w-[90px] truncate text-gray-800 dark:text-gray-200">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-4 border-b border-stone-200 dark:border-neutral-800">
            {CATEGORIES.slice(1, 7).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentView('shop', { category: cat.id });
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-xs font-medium py-2 px-3 bg-stone-50 dark:bg-neutral-900 rounded text-stone-700 dark:text-stone-300"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setCurrentView(link.view, link.category ? { category: link.category } : undefined);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-stone-800 dark:text-stone-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                setIsAiStylistOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400"
            >
              <Sparkles className="w-4 h-4" /> AI Styling Concierge
            </button>
            <button
              onClick={toggleDarkMode}
              className="text-xs font-medium text-stone-500"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
