import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Wallet,
  MessageSquare,
  Shield,
  Trash2,
  Plus,
  ArrowRight,
  Printer,
  CheckCircle2,
  Clock,
  Send,
  Ticket,
  Scissors,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MOCK_ORDERS, MOCK_TICKETS } from '../../data/mockData';
import { Address, SupportTicket } from '../../types';

interface CustomerDashboardProps {
  setCurrentView: (view: string, extra?: any) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ setCurrentView }) => {
  const {
    currentUser,
    addresses,
    addAddress,
    deleteAddress,
    wishlist,
    removeFromWishlist,
    addToCart,
    formatPrice,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'wallet' | 'tickets'>('orders');

  // Address modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  // Ticket creation
  const [ticketsList, setTicketsList] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'fitting' | 'order' | 'return' | 'general'>('fitting');
  const [ticketMessage, setTicketMessage] = useState('');

  // Sartorial Measurements
  const [measurements, setMeasurements] = useState({
    chest: '40"',
    shoulder: '18.5"',
    waist: '33"',
    inseam: '32"',
    sleeve: '34"',
    collar: '15.5"',
  });

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Bespoke Sartorial Profile Saved');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      ...newAddr,
      id: `addr-${Date.now()}`,
    });
    setIsAddressModalOpen(false);
    addToast('success', 'New Residence Address Added');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    const newT: SupportTicket = {
      id: `tick-${Date.now()}`,
      userId: currentUser?.id || 'u-curr',
      userName: currentUser?.name || 'Alexander Vance',
      userEmail: currentUser?.email || 'alexander@atelier.it',
      subject: ticketSubject,
      category: 'Sizing & Fit',
      status: 'Open',
      priority: 'Medium',
      createdAt: 'Just now',
      messages: [
        {
          sender: 'user',
          senderName: currentUser?.name || 'Alexander Vance',
          text: ticketMessage,
          timestamp: 'Just now',
        },
      ],
    };

    setTicketsList([newT, ...ticketsList]);
    setIsNewTicketOpen(false);
    setTicketSubject('');
    setTicketMessage('');
    addToast('success', 'Tailor Ticket Dispatched to Concierge');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 rounded-3xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-neutral-950 font-bold font-serif-luxury text-2xl flex items-center justify-center border-2 border-white">
            {currentUser?.name[0] || 'V'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-luxury text-2xl font-bold">{currentUser?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500/20 border border-amber-400/30 text-amber-300">
                VIP Connoisseur
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">{currentUser?.email} • Member since 2024</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/40 px-5 py-3 rounded-2xl border border-white/10">
          <div>
            <span className="text-[10px] uppercase text-stone-400 block font-bold">Atelier Cash Vault</span>
            <span className="text-xl font-bold text-amber-400">{formatPrice(85)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200 dark:border-neutral-800 p-3 space-y-1 shadow-sm">
          {[
            { id: 'orders', label: 'My Acquisitions', icon: Package },
            { id: 'profile', label: 'Bespoke Measurements', icon: Scissors },
            { id: 'addresses', label: 'Saved Residences', icon: MapPin },
            { id: 'wishlist', label: 'Curated Wishlist', icon: Heart },
            { id: 'wallet', label: 'Atelier Vault & Credits', icon: Wallet },
            { id: 'tickets', label: 'Concierge Tickets', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <div className="lg:col-span-9 bg-white dark:bg-neutral-900 rounded-3xl border border-stone-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-800">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold">Acquisitions & Orders</h2>
                  <p className="text-xs text-stone-500">Track and manage past sartorial acquisitions.</p>
                </div>
              </div>

              <div className="space-y-6">
                {MOCK_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border border-stone-200 dark:border-neutral-800 space-y-4 bg-stone-50/50 dark:bg-neutral-800/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-neutral-700">
                      <div>
                        <span className="text-xs font-bold font-mono text-amber-600">
                          #{order.orderNumber}
                        </span>
                        <p className="text-[11px] text-stone-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold rounded-full uppercase">
                          {order.orderStatus.toUpperCase()}
                        </span>
                        <button
                          onClick={() => setCurrentView('track-order', { orderId: order.orderNumber })}
                          className="px-3 py-1 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold rounded-lg"
                        >
                          Track Shipment
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={it.image} alt="" className="w-12 h-16 object-cover rounded-lg" />
                            <div>
                              <h4 className="font-bold">{it.title}</h4>
                              <p className="text-stone-500">Size: {it.selectedSize} • Qty: {it.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold">{formatPrice(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-stone-200 dark:border-neutral-700 flex justify-between items-center text-xs font-bold">
                      <span>Total Paid: {formatPrice(order.total)}</span>
                      <button
                        onClick={() => window.print()}
                        className="text-amber-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Download Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & BESPOKE MEASUREMENTS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-stone-200 dark:border-neutral-800">
                <h2 className="font-serif-luxury text-2xl font-bold">Bespoke Fit & Measurements</h2>
                <p className="text-xs text-stone-500">
                  Save your exact tailoring measurements for automated size matching on every future order.
                </p>
              </div>

              <form onSubmit={handleSaveMeasurements} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase mb-1">Chest Circumference</label>
                    <input
                      type="text"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Shoulder Width</label>
                    <input
                      type="text"
                      value={measurements.shoulder}
                      onChange={(e) => setMeasurements({ ...measurements, shoulder: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Waist Circumference</label>
                    <input
                      type="text"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Trouser Inseam</label>
                    <input
                      type="text"
                      value={measurements.inseam}
                      onChange={(e) => setMeasurements({ ...measurements, inseam: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Sleeve Length</label>
                    <input
                      type="text"
                      value={measurements.sleeve}
                      onChange={(e) => setMeasurements({ ...measurements, sleeve: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Shirt Collar</label>
                    <input
                      type="text"
                      value={measurements.collar}
                      onChange={(e) => setMeasurements({ ...measurements, collar: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl"
                >
                  Update Sartorial Profile
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-800">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold">Saved Residences</h2>
                  <p className="text-xs text-stone-500">Manage shipping addresses for rapid checkout.</p>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Residence</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-5 rounded-2xl border border-stone-200 dark:border-neutral-800 relative bg-stone-50/40 dark:bg-neutral-800/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold">{addr.fullName}</h4>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-800">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold">Curated Wishlist ({wishlist.length})</h2>
                  <p className="text-xs text-stone-500">Garments saved for future seasons.</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-xs text-stone-500 py-12 text-center">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl border border-stone-200 dark:border-neutral-700 flex flex-col justify-between">
                      <div>
                        <img src={prod.images[0]} alt="" className="w-full aspect-[3/4] object-cover rounded-xl mb-3" />
                        <h4 className="text-xs font-bold truncate">{prod.title}</h4>
                        <span className="text-xs font-bold text-amber-600">{formatPrice(prod.price)}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-stone-200 dark:border-neutral-700 flex gap-2">
                        <button
                          onClick={() => {
                            addToCart(prod, prod.sizes[0]?.size || 'M', prod.colors[0], 1);
                            removeFromWishlist(prod.id);
                          }}
                          className="flex-1 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-bold uppercase rounded-lg"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => removeFromWishlist(prod.id)}
                          className="p-2 text-stone-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-stone-200 dark:border-neutral-800">
                <h2 className="font-serif-luxury text-2xl font-bold">Atelier Cash Vault</h2>
                <p className="text-xs text-stone-500">Manage your store credit balance & redeem VIP gift cards.</p>
              </div>

              <div className="p-6 bg-stone-900 text-white rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase text-amber-400 font-bold tracking-wider">Available Balance</span>
                  <div className="text-3xl font-extrabold mt-1">{formatPrice(85)}</div>
                </div>
                <button
                  onClick={() => addToast('info', 'Gift card redeemed automatically at checkout')}
                  className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold uppercase text-xs rounded-xl"
                >
                  Top Up / Redeem
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: CONCIERGE TICKETS */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 dark:border-neutral-800">
                <div>
                  <h2 className="font-serif-luxury text-2xl font-bold">Concierge & Master Tailor Tickets</h2>
                  <p className="text-xs text-stone-500">Direct channel with our master tailors and client advisers.</p>
                </div>
                <button
                  onClick={() => setIsNewTicketOpen(true)}
                  className="px-4 py-2 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Open Ticket</span>
                </button>
              </div>

              <div className="space-y-4">
                {ticketsList.map((tick) => (
                  <div key={tick.id} className="p-5 rounded-2xl border border-stone-200 dark:border-neutral-800 space-y-3 bg-stone-50/50 dark:bg-neutral-800/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">
                          Ticket #{tick.id} • {tick.category.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white mt-0.5">{tick.subject}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {tick.status}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-neutral-700">
                      {tick.messages.map((m, idx) => (
                        <div key={idx} className={`p-3 rounded-xl text-xs ${m.sender === 'user' ? 'bg-white dark:bg-neutral-900 ml-6' : 'bg-amber-50 dark:bg-neutral-800 mr-6 border border-amber-200 dark:border-amber-800/50'}`}>
                          <div className="flex justify-between font-bold text-[10px] text-stone-500 mb-1">
                            <span>{m.senderName}</span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="text-stone-800 dark:text-stone-200">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsNewTicketOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold">Open Master Tailor Consultation</h3>
              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Inquiry Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  >
                    <option value="fitting">Bespoke Fit Consultation</option>
                    <option value="order">Order Tracking & Alteration</option>
                    <option value="return">Doorstep Exchange Request</option>
                    <option value="general">General Client Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Sleeve tapering request for Biella Wool Suit"
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your inquiry or fitting adjustment..."
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase rounded-xl"
                  >
                    Dispatch Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewTicketOpen(false)}
                    className="px-5 py-3 border border-stone-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setIsAddressModalOpen(false)} className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-neutral-800 z-10 space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold">Add Residence Address</h3>
              <form onSubmit={handleCreateAddress} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Telephone</label>
                  <input
                    type="text"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={newAddr.postalCode}
                      onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="w-full p-2.5 bg-stone-100 dark:bg-neutral-800 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold uppercase rounded-xl"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-5 py-3 border border-stone-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
