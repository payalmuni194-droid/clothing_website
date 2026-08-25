import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Gift, ShieldCheck, ArrowRight, Tag, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface MiniCartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToCart: () => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToCart,
}) => {
  const {
    cart,
    isMiniCartOpen,
    setIsMiniCartOpen,
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
    formatPrice,
    cartTotal,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isMiniCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsMiniCartOpen(false)}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-neutral-800">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-stone-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif-luxury text-xl font-bold text-neutral-950 dark:text-white">
                Shopping Bag
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-stone-100 dark:bg-neutral-800 rounded-full text-stone-600 dark:text-stone-300">
                {cartCount} items
              </span>
            </div>
            <button
              onClick={() => setIsMiniCartOpen(false)}
              className="p-2 text-stone-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3 bg-stone-50 dark:bg-neutral-800/60 border-b border-stone-200 dark:border-neutral-800">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              {remainingForFreeShipping > 0 ? (
                <span className="text-stone-600 dark:text-stone-300">
                  Add <strong className="text-amber-600">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Express Shipping
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> You've unlocked Complimentary Express Shipping!
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-medium text-stone-900 dark:text-stone-100 mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mb-6">
                  Explore our tailored suits, Italian linen shirts, and luxury footwear collections.
                </p>
                <button
                  onClick={() => setIsMiniCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-stone-50/70 dark:bg-neutral-800/40 border border-stone-100 dark:border-neutral-800"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-lg bg-stone-100 dark:bg-neutral-700"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-medium bg-stone-200/80 dark:bg-neutral-700 px-1.5 py-0.5 rounded">
                          Size: {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-stone-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    {/* Gift wrap checkbox */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <label className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.giftWrap || false}
                          onChange={() => toggleGiftWrap(item.id)}
                          className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                        />
                        <Gift className="w-3 h-3 text-amber-600" />
                        <span>Luxury Gift Box (+{formatPrice(10)})</span>
                      </label>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60 dark:border-neutral-700/60">
                      <div className="flex items-center border border-stone-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-neutral-700 text-stone-600 dark:text-stone-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 dark:hover:bg-neutral-700 text-stone-600 dark:text-stone-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-neutral-950 dark:text-white">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-950/50 space-y-4">
              {/* Coupon form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-500 text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. WELCOME15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-neutral-800 border border-stone-300 dark:border-neutral-700 rounded-lg uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Subtotal & Total calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-neutral-800 text-sm font-bold text-neutral-950 dark:text-white">
                  <span>Estimated Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsMiniCartOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-stone-200 dark:text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsMiniCartOpen(false);
                    onNavigateToCart();
                  }}
                  className="w-full py-2.5 text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white text-xs font-semibold transition-colors text-center block"
                >
                  View Full Bag & Estimate Tax
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL Encrypted Checkout • Free 30-Day Bespoke Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
