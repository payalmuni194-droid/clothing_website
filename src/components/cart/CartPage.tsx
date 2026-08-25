import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  Gift,
  ShieldCheck,
  Truck,
  ArrowRight,
  Tag,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Bookmark,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  setCurrentView: (view: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToCheckout,
  setCurrentView,
  onSelectProduct,
}) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleGiftWrap,
    cartSubtotal,
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    shippingFee,
    taxAmount,
    cartTotal,
    formatPrice,
    addToCart,
    addToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [savedForLater, setSavedForLater] = useState<any[]>([]);

  const handleSaveForLater = (item: any) => {
    setSavedForLater([...savedForLater, item]);
    removeFromCart(item.id);
    addToast('info', 'Item moved to Save for Later list');
  };

  const handleMoveBackToCart = (item: any) => {
    addToCart(item.product, item.selectedSize, item.selectedColor, item.quantity);
    setSavedForLater(savedForLater.filter((i) => i.id !== item.id));
    addToast('success', 'Item restored to your Shopping Bag');
  };

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  // Delivery estimation (3 business days from today)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-stone-200 dark:border-neutral-800 gap-4">
        <div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-stone-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
            Your Shopping Bag
          </h1>
        </div>
        <span className="text-xs font-semibold text-stone-500">
          {cartCount} Garments Curated
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 p-8">
          <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-400 mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 opacity-30" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold mb-2">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Discover our latest runway collection, handcrafted suits, and casual tailoring.
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-8 py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Itemized list & Free Shipping banner */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Meter */}
            <div className="p-4 bg-stone-50 dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800">
              <div className="flex justify-between items-center text-xs font-medium mb-2">
                {remainingForFreeShipping > 0 ? (
                  <span className="text-stone-700 dark:text-stone-300">
                    Add <strong className="text-amber-600">{formatPrice(remainingForFreeShipping)}</strong> more to qualify for <strong>Complimentary DHL Express Shipping</strong>
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> You've unlocked Complimentary Express Courier Shipping!
                  </span>
                )}
              </div>
              <div className="w-full bg-stone-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items list */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row gap-6"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-32 object-cover rounded-xl bg-stone-100 dark:bg-neutral-800 cursor-pointer"
                    onClick={() => onSelectProduct(item.product)}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                            {item.product.brand}
                          </span>
                          <h3
                            onClick={() => onSelectProduct(item.product)}
                            className="text-sm font-bold text-stone-900 dark:text-white cursor-pointer hover:underline"
                          >
                            {item.product.title}
                          </h3>
                        </div>

                        <span className="text-sm font-extrabold text-neutral-950 dark:text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-500 dark:text-stone-400">
                        <span className="bg-stone-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-medium">
                          Size: {item.selectedSize}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-stone-300 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                        <span>•</span>
                        <span>{item.product.fabric}</span>
                      </div>

                      {/* Gift Box Checkbox */}
                      <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer mt-3">
                        <input
                          type="checkbox"
                          checked={item.giftWrap || false}
                          onChange={() => toggleGiftWrap(item.id)}
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <Gift className="w-3.5 h-3.5 text-amber-600" />
                        <span>Add Luxury Embossed Gift Box & Ribbon (+{formatPrice(10)})</span>
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-neutral-800">
                      {/* Quantity counter */}
                      <div className="flex items-center border border-stone-200 dark:border-neutral-700 rounded-lg bg-stone-50 dark:bg-neutral-800">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-stone-500 hover:text-black dark:hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-stone-500 hover:text-black dark:hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="text-stone-500 hover:text-amber-600 flex items-center gap-1"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for Later</span>
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved for Later Section */}
            {savedForLater.length > 0 && (
              <div className="pt-8 border-t border-stone-200 dark:border-neutral-800 space-y-4">
                <h3 className="font-serif-luxury text-xl font-bold">Saved For Later ({savedForLater.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedForLater.map((sItem) => (
                    <div key={sItem.id} className="p-4 bg-stone-50 dark:bg-neutral-900 rounded-xl border border-stone-200 dark:border-neutral-800 flex gap-3">
                      <img src={sItem.product.images[0]} alt="" className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold truncate">{sItem.product.title}</h4>
                          <span className="text-xs font-bold text-neutral-950 dark:text-white">{formatPrice(sItem.product.price)}</span>
                        </div>
                        <button
                          onClick={() => handleMoveBackToCart(sItem)}
                          className="text-xs font-bold text-amber-600 hover:underline text-left"
                        >
                          Move Back to Bag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary & Checkout Card */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif-luxury text-xl font-bold pb-3 border-b border-stone-100 dark:border-neutral-800">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-stone-400 hover:text-rose-500 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (couponInput.trim()) {
                      applyCoupon(couponInput.trim());
                      setCouponInput('');
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculation lines */}
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Garment Subtotal</span>
                <span className="font-semibold text-stone-900 dark:text-white">{formatPrice(cartSubtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Bespoke Promo Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600">Complimentary</strong> : formatPrice(shippingFee)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Duties (8% GST)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-neutral-800 flex justify-between text-base font-bold text-neutral-950 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-lg">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Estimated Delivery Notice */}
            <div className="p-3 bg-stone-50 dark:bg-neutral-800 rounded-xl flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Estimated Delivery: <strong>{formattedDelivery}</strong></span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onNavigateToCheckout}
              className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Encrypted Secure Checkout • 30-Day Bespoke Returns</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
