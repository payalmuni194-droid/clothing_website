import React, { useState } from 'react';
import {
  Package,
  Truck,
  Barcode,
  Search,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../data/mockData';
import { useStore } from '../../context/StoreContext';

export const StoreManagerDashboard: React.FC = () => {
  const { formatPrice, addToast } = useStore();
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedItem, setScannedItem] = useState<any>(null);

  const handleBarcodeLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_PRODUCTS.find(
      (p) => p.sku.toLowerCase() === barcodeInput.toLowerCase() || p.id === barcodeInput
    );
    if (found) {
      setScannedItem(found);
      addToast('success', `Garment Verified: ${found.title}`);
    } else {
      addToast('error', 'Barcode/SKU not located in local warehouse');
    }
  };

  const handleMarkPacked = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, orderStatus: 'processing' as any } : o))
    );
    addToast('success', `Order #${orderId} marked as Packed & QC Verified`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 bg-stone-900 text-white rounded-3xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500 text-black">
            Fulfillment Station & Operations
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold mt-1">Milan Logistics & QC Floor</h1>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-white text-neutral-950 font-bold text-xs uppercase rounded-xl flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Daily Courier Manifest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Quick SKU / Barcode Scanner */}
        <div className="lg:col-span-4 bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-neutral-800">
            <Barcode className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif-luxury text-lg font-bold">Optical Barcode / SKU Scanner</h3>
          </div>

          <form onSubmit={handleBarcodeLookup} className="space-y-3">
            <input
              type="text"
              placeholder="Scan or enter SKU (e.g. ATL-9482)"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full p-3 bg-stone-100 dark:bg-neutral-800 rounded-xl text-xs font-mono font-bold"
            />
            <button
              type="submit"
              className="w-full py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl"
            >
              Verify Garment
            </button>
          </form>

          {scannedItem && (
            <div className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl border border-stone-200 dark:border-neutral-700 space-y-3 animate-fadeIn">
              <img src={scannedItem.images[0]} alt="" className="w-full aspect-[3/4] object-cover rounded-xl" />
              <h4 className="text-xs font-bold">{scannedItem.title}</h4>
              <p className="text-[11px] text-stone-500 font-mono">SKU: {scannedItem.sku}</p>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
                {scannedItem.sizes.map((s: any) => (
                  <div key={s.size} className="p-1.5 bg-white dark:bg-neutral-900 rounded border">
                    {s.size}: {s.stock} pcs
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Today's Packing Queue */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-neutral-800 shadow-sm space-y-6">
          <h3 className="font-serif-luxury text-xl font-bold">Pending QC & Packing Queue</h3>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl border border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-amber-600">#{ord.orderNumber}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-1">
                    {ord.shippingAddress.fullName} • {ord.items.length} garments
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Courier: DHL Express Air Waybill
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkPacked(ord.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>QC Passed & Pack</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
