import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MiniCartDrawer } from './components/common/MiniCartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { AiStylistModal } from './components/common/AiStylistModal';
import { CompareDrawer } from './components/common/CompareDrawer';
import { ToastContainer } from './components/common/ToastContainer';

import { HomePage } from './components/home/HomePage';
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailsPage } from './components/product/ProductDetailsPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/checkout/OrderSuccessPage';
import { TrackOrderPage } from './components/tracking/TrackOrderPage';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { StoreManagerDashboard } from './components/dashboard/StoreManagerDashboard';
import { Product, Order } from './types';

const MainApp: React.FC = () => {
  const { userRole } = useStore();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackOrderId, setTrackOrderId] = useState<string>('ORD-84920');

  const handleNavigate = (view: string, extra?: any) => {
    if (extra?.category) {
      setSelectedCategoryFilter(extra.category);
    }
    if (extra?.orderId) {
      setTrackOrderId(extra.orderId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setActiveOrder(order);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300 selection:bg-amber-500 selection:text-black">
      {/* Global Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={handleNavigate}
        onSearchSelect={handleSelectProduct}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            setCurrentView={handleNavigate}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategory={selectedCategoryFilter}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-details' && (
          <ProductDetailsPage
            productId={selectedProductId}
            onSelectProduct={handleSelectProduct}
            onNavigateToCheckout={() => handleNavigate('checkout')}
            setCurrentView={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigateToCheckout={() => handleNavigate('checkout')}
            setCurrentView={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderCompleted={handleOrderCompleted}
            onBackToCart={() => handleNavigate('cart')}
          />
        )}

        {currentView === 'order-success' && activeOrder && (
          <OrderSuccessPage
            order={activeOrder}
            onTrackOrder={(id) => handleNavigate('track-order', { orderId: id })}
            onContinueShopping={() => handleNavigate('shop')}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderPage
            initialOrderId={trackOrderId}
            setCurrentView={handleNavigate}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboard setCurrentView={handleNavigate} />
        )}

        {currentView === 'admin-dashboard' && (
          <SuperAdminDashboard />
        )}

        {currentView === 'manager-dashboard' && (
          <StoreManagerDashboard />
        )}
      </main>

      {/* Global Footer */}
      <Footer setCurrentView={handleNavigate} />

      {/* Global Slide-overs & Modals */}
      <MiniCartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onNavigateToCart={() => handleNavigate('cart')}
      />

      <QuickViewModal
        onViewDetails={(id) => {
          setSelectedProductId(id);
          handleNavigate('product-details');
        }}
      />

      <AiStylistModal />

      <CompareDrawer />

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}

export default App;
