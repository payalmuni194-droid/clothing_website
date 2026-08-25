import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

interface OrderSuccessPageProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  const { formatPrice } = useStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Top Banner */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-xl">
          <CheckCircle2 className="w-10 h-10 animate-pulse" />
        </div>

        <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400">
          Acquisition Confirmed
        </span>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
          Thank You For Your Patronage
        </h1>

        <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
          Order <strong>#{order.orderNumber}</strong> has been received by our Milan fulfillment atelier. A formal confirmation and digital certificate have been dispatched to your email.
        </p>
      </div>

      {/* Interactive Status Timeline */}
      <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100 dark:border-neutral-800">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold">Consignment Progression</h3>
            <p className="text-xs text-stone-500">Tracking Ref: <strong className="text-amber-600">{order.trackingNumber || 'DHL-84920491-IT'}</strong></p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 dark:border-neutral-700 rounded-lg text-xs font-semibold hover:bg-stone-50 dark:hover:bg-neutral-800"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tax Invoice</span>
          </button>
        </div>

        {/* 5-Step visual timeline */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { step: 'Order Placed', time: 'Completed', active: true },
            { step: 'Payment Verified', time: 'Completed', active: true },
            { step: 'Tailoring & QC', time: 'In Progress', active: true },
            { step: 'DHL Courier', time: 'Pending', active: false },
            { step: 'Delivery', time: 'Estimated 3 Days', active: false },
          ].map((s, idx) => (
            <div key={idx} className="space-y-2">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                  s.active
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 ring-4 ring-amber-500/20'
                    : 'bg-stone-200 dark:bg-neutral-800 text-stone-400'
                }`}
              >
                {idx + 1}
              </div>
              <p className="text-[11px] font-bold truncate">{s.step}</p>
              <span className="text-[10px] text-stone-400 block">{s.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Order Receipt Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
        <h3 className="font-serif-luxury text-xl font-bold pb-3 border-b border-stone-100 dark:border-neutral-800">
          Acquired Garments
        </h3>

        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center justify-between text-xs py-2 border-b border-stone-100 dark:border-neutral-800 last:border-0">
              <div className="flex gap-3 items-center">
                <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-white">{item.title}</h4>
                  <p className="text-stone-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 space-y-2 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900 dark:text-white">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Savings Applied</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Express Courier Shipping</span>
            <span>{order.shippingFee === 0 ? 'Complimentary' : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes & Duties</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-neutral-800 text-base font-bold text-stone-950 dark:text-white">
            <span>Total Paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping address details */}
        <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600 dark:text-stone-400">
          <div>
            <span className="font-bold uppercase block text-stone-900 dark:text-white mb-1">
              Destination Address
            </span>
            <p>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div>
            <span className="font-bold uppercase block text-stone-900 dark:text-white mb-1">
              Payment Method
            </span>
            <p className="capitalize">
              {order.paymentMethod.replace('_', ' ')} • Verified
            </p>
            <span className="inline-block px-2.5 py-0.5 mt-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-semibold text-[10px]">
              Payment Status: {order.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onTrackOrder(order.id)}
          className="flex-1 py-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Live Consignment Tracking</span>
        </button>

        <button
          onClick={onContinueShopping}
          className="px-8 py-4 border border-stone-300 dark:border-neutral-700 text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-stone-50 dark:hover:bg-neutral-800"
        >
          Explore More Collections
        </button>
      </div>
    </div>
  );
};
