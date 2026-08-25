import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  QrCode,
  MapPin,
  Plus,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address, Order, PaymentMethod } from '../../types';

interface CheckoutPageProps {
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderCompleted,
  onBackToCart,
}) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    shippingFee,
    taxAmount,
    couponDiscount,
    appliedCoupon,
    formatPrice,
    addresses,
    currentUser,
    clearCart,
    addToast,
  } = useStore();

  // Wizard step (1: Address, 2: Shipping Method, 3: Payment)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || 'addr-new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: `addr-${Date.now()}`,
    fullName: currentUser?.name || 'Lord Alexander Vance',
    phone: '+1 (555) 234-5678',
    street: '742 Evergreen Terrace, Suite 400',
    city: 'New York',
    state: 'NY',
    postalCode: '10021',
    country: 'United States',
    isDefault: true,
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'dhl_express' | 'white_glove' | 'standard'>('dhl_express');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.STRIPE);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(currentUser?.name || 'Alexander Vance');
  const [codOtp, setCodOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || newAddress;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderPayload = {
        userId: currentUser?.id || 'u-guest',
        items: cart,
        totalAmount: cartTotal,
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        shippingFee: shippingMethod === 'white_glove' ? 35 : shippingFee,
        taxAmount,
        shippingAddress: selectedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === PaymentMethod.COD ? 'pending' : 'paid',
      };

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.order) {
        clearCart();
        addToast('success', 'Order Confirmed!', `Consignment #${data.order.orderNumber} placed.`);
        onOrderCompleted(data.order);
      }
    } catch (err) {
      addToast('error', 'Payment processing failed. Please verify credentials.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 dark:border-neutral-800 gap-4">
        <div>
          <button
            onClick={onBackToCart}
            className="text-xs text-stone-500 hover:text-black dark:hover:text-white flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping Bag</span>
          </button>
          <h1 className="font-serif-luxury text-3xl font-bold text-neutral-950 dark:text-white">
            Secure Bespoke Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${step >= 1 ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-stone-400'}`}>
            <span>1. Delivery</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${step >= 2 ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-stone-400'}`}>
            <span>2. Courier</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${step >= 3 ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-stone-400'}`}>
            <span>3. Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Checkout Wizard Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: Address Selection */}
          {step === 1 && (
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
                <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>1. Delivery Destination</span>
                </h3>
                <span className="text-xs text-stone-500">Step 1 of 3</span>
              </div>

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      setIsAddingNewAddress(false);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id && !isAddingNewAddress
                        ? 'border-neutral-950 dark:border-white bg-stone-50 dark:bg-neutral-800'
                        : 'border-stone-200 dark:border-neutral-800 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {addr.street}<br />
                      {addr.city}, {addr.state} {addr.postalCode}<br />
                      {addr.country}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 font-mono">{addr.phone}</p>
                  </div>
                ))}
              </div>

              {/* Enter new address toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingNewAddress ? 'Use Saved Address' : 'Deliver to a New Residence'}</span>
                </button>
              </div>

              {/* New Address Form */}
              {isAddingNewAddress && (
                <div className="p-6 bg-stone-50 dark:bg-neutral-800/60 rounded-2xl border border-stone-200 dark:border-neutral-700 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Telephone</label>
                    <input
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <span>Continue to Courier Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Courier Method */}
          {step === 2 && (
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
                <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>2. Select Courier Method</span>
                </h3>
                <button onClick={() => setStep(1)} className="text-xs text-amber-600 underline">
                  Back to Address
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'dhl_express',
                    title: 'DHL Express Carbon-Neutral Air Delivery',
                    time: '3–5 Business Days',
                    price: shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee),
                    desc: 'Tracked air transport from Milan atelier with direct signature verification.',
                  },
                  {
                    id: 'white_glove',
                    title: 'White-Glove VIP Tailor Delivery',
                    time: 'Next Day Evening (5 PM - 8 PM)',
                    price: formatPrice(35),
                    desc: 'Suits delivered on cedar hangers in breathable garment bags with a traveling stylist assistant.',
                  },
                  {
                    id: 'standard',
                    title: 'Standard Ground Courier',
                    time: '6–8 Business Days',
                    price: 'Complimentary',
                    desc: 'Eco-conscious consolidated freight logistics.',
                  },
                ].map((meth) => (
                  <div
                    key={meth.id}
                    onClick={() => setShippingMethod(meth.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                      shippingMethod === meth.id
                        ? 'border-neutral-950 dark:border-white bg-stone-50 dark:bg-neutral-800'
                        : 'border-stone-200 dark:border-neutral-800'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold">{meth.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">{meth.desc}</p>
                      <span className="inline-block text-[11px] font-semibold text-amber-600 mt-2">
                        Est. Transit: {meth.time}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-neutral-950 dark:text-white">
                      {meth.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 border border-stone-300 dark:border-neutral-700 text-xs font-bold uppercase rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway Simulation */}
          {step === 3 && (
            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
                <h3 className="font-serif-luxury text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>3. Payment Gateway</span>
                </h3>
                <button onClick={() => setStep(2)} className="text-xs text-amber-600 underline">
                  Back to Courier
                </button>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: PaymentMethod.STRIPE, label: 'Credit Card / Stripe', icon: CreditCard },
                  { id: PaymentMethod.RAZORPAY, label: 'Razorpay / UPI', icon: Smartphone },
                  { id: PaymentMethod.COD, label: 'Cash on Delivery', icon: ShieldCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 text-center transition-all ${
                        paymentMethod === m.id
                          ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                          : 'border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* STRIPE CARD FORM */}
              {paymentMethod === PaymentMethod.STRIPE && (
                <div className="p-6 bg-stone-50 dark:bg-neutral-800/60 rounded-2xl border border-stone-200 dark:border-neutral-700 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-stone-300 dark:border-neutral-700 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RAZORPAY / UPI FORM */}
              {paymentMethod === PaymentMethod.RAZORPAY && (
                <div className="p-6 bg-stone-50 dark:bg-neutral-800/60 rounded-2xl border border-stone-200 dark:border-neutral-700 space-y-4 text-center">
                  <div className="w-32 h-32 mx-auto bg-white p-3 rounded-xl border border-stone-300 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-neutral-900" />
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Scan dynamic QR with Google Pay, PhonePe, or Apple Pay to complete instant authentication.
                  </p>
                </div>
              )}

              {/* CASH ON DELIVERY */}
              {paymentMethod === PaymentMethod.COD && (
                <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/50 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 uppercase">
                    Cash / Card On Doorstep Delivery
                  </h4>
                  <p className="text-stone-700 dark:text-stone-300">
                    Please prepare exact amount or pay with contactless card terminal upon courier arrival.
                  </p>
                </div>
              )}

              {/* Place Order Trigger */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Authenticating Transaction...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order ({formatPrice(cartTotal + (shippingMethod === 'white_glove' ? 35 : 0))})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary Sticky Card */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6 sticky top-28">
          <h3 className="font-serif-luxury text-xl font-bold pb-3 border-b border-stone-100 dark:border-neutral-800">
            Ensemble Summary ({cart.length})
          </h3>

          {/* Mini Items list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <img src={item.product.images[0]} alt="" className="w-12 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-bold line-clamp-1">{item.product.title}</h4>
                  <p className="text-stone-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                  <p className="font-bold mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-stone-100 dark:border-neutral-800 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-950 dark:text-white">{formatPrice(cartSubtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{shippingMethod === 'white_glove' ? formatPrice(35) : shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (8% GST)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-neutral-800 flex justify-between text-base font-bold text-neutral-950 dark:text-white">
              <span>Grand Total</span>
              <span>{formatPrice(cartTotal + (shippingMethod === 'white_glove' ? 35 : 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
