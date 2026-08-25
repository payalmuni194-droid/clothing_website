import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Package,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { MOCK_ORDERS } from '../../data/mockData';
import { useStore } from '../../context/StoreContext';

interface TrackOrderPageProps {
  initialOrderId?: string;
  setCurrentView: (view: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderId,
  setCurrentView,
}) => {
  const { formatPrice } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderId || 'ORD-84920');
  const [activeOrder, setActiveOrder] = useState<any>(
    MOCK_ORDERS.find((o) => o.id === initialOrderId || o.orderNumber === initialOrderId) || MOCK_ORDERS[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_ORDERS.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchQuery.toLowerCase() ||
        o.id.toLowerCase() === searchQuery.toLowerCase() ||
        o.trackingNumber?.toLowerCase() === searchQuery.toLowerCase()
    );
    if (found) {
      setActiveOrder(found);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-600 dark:text-amber-400">
          Global Logistics Monitor
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-neutral-950 dark:text-white">
          Track Your Consignment
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Enter your Atelier Order Reference (e.g. ORD-84920) or DHL Air Waybill code.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Order Number (e.g. ORD-84920) or Tracking ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl shadow-md"
        >
          Track
        </button>
      </form>

      {/* Tracking Results Card */}
      {activeOrder && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm overflow-hidden space-y-6">
          {/* Top Bar */}
          <div className="p-6 sm:p-8 bg-stone-50 dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">
                Consignment #{activeOrder.orderNumber}
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-neutral-950 dark:text-white mt-0.5">
                Status: In Transit • On Schedule
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Estimated Delivery Window: <strong>Friday, Oct 24 by 4:00 PM</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400 block">Air Waybill Carrier:</span>
              <span className="text-xs font-bold font-mono text-neutral-950 dark:text-white">
                {activeOrder.trackingNumber || 'DHL-984210984-IT'}
              </span>
            </div>
          </div>

          {/* Timeline Checkpoints */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="font-serif-luxury text-lg font-bold">Transit Milestones</h3>

            <div className="relative pl-6 border-l-2 border-amber-500 space-y-8">
              {[
                {
                  title: 'Dispatched from Milan Central Atelier Hub',
                  loc: 'Milan Malpensa Cargo Facility, Italy',
                  time: 'Oct 21, 09:30 AM',
                  done: true,
                },
                {
                  title: 'International Air Freight Departed',
                  loc: 'Flight DHL-942 -> JFK International',
                  time: 'Oct 21, 04:15 PM',
                  done: true,
                },
                {
                  title: 'Customs Clearance Completed',
                  loc: 'New York JFK Port Terminal',
                  time: 'Oct 22, 11:20 AM',
                  done: true,
                },
                {
                  title: 'Arrived at Local White-Glove Distribution Center',
                  loc: 'Manhattan Metropolitan Logistics Hub',
                  time: 'Oct 23, 07:45 AM',
                  done: true,
                },
                {
                  title: 'Out for Final White-Glove Hand Delivery',
                  loc: 'Courier Courier Driver en route',
                  time: 'Estimated Oct 24, 02:00 PM',
                  done: false,
                },
              ].map((m, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                      m.done ? 'bg-amber-500 border-white' : 'bg-stone-300 dark:bg-neutral-700 border-neutral-900'
                    }`}
                  />
                  <h4 className="text-xs font-bold text-neutral-950 dark:text-white">{m.title}</h4>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{m.loc}</span>
                  </p>
                  <span className="text-[10px] text-stone-400 block mt-1 font-mono">{m.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consignment Items */}
          <div className="p-6 sm:p-8 bg-stone-50 dark:bg-neutral-950/60 border-t border-stone-200 dark:border-neutral-800">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Garments in this Consignment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-stone-200 dark:border-neutral-800">
                  <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-lg" />
                  <div className="text-xs">
                    <h5 className="font-bold truncate">{item.title}</h5>
                    <p className="text-stone-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                    <p className="font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
