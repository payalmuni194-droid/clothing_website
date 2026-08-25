import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Award, MapPin, Phone, Instagram, Facebook, Twitter, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  setCurrentView: (view: string, extra?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addToast('success', 'Welcome to the Atelier VIP Club', 'Use code WELCOME15 for 15% off your first acquisition.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111827] text-gray-300 border-t border-gray-800">
      {/* Brand Guarantees Bar */}
      <div className="border-b border-gray-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-[#F59E0B] shrink-0 mx-auto md:mx-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Artisanal Craft
              </h4>
              <p className="text-xs text-gray-400">
                Spun in Biella, woven on vintage Japanese looms, finished by master tailors.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-[#2563EB] shrink-0 mx-auto md:mx-0 shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Complimentary Express
              </h4>
              <p className="text-xs text-gray-400">
                Carbon-neutral DHL express courier delivery on all orders exceeding $150.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-[#F59E0B] shrink-0 mx-auto md:mx-0 shadow-sm">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                30-Day Free Returns
              </h4>
              <p className="text-xs text-gray-400">
                Hassle-free doorstep pickup with complimentary size exchanges & tailored fit advice.
              </p>
            </div>
          </div>

          <div className="flex items-center md:items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-[#2563EB] shrink-0 mx-auto md:mx-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                Guaranteed Authenticity
              </h4>
              <p className="text-xs text-gray-400">
                Every piece accompanied by a numbered certificate of origin and tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-wider text-white block">
              ATELIER & CO.
            </span>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Conceived in Milan and tailored for the modern cosmopolitan lifestyle. We merge time-honored Savile Row craftsmanship with clean contemporary silhouettes.
            </p>

            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#F59E0B] block mb-2">
                Join the Private Gentleman's Club
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-l-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider rounded-r-xl transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              <span className="text-[10px] text-gray-500 mt-1.5 block">
                Receive private sale access, seasonal lookbooks, and invitation-only trunk shows.
              </span>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {['Suits & Tuxedos', 'Blazers & Sport Coats', 'French Normandy Linen', 'Japanese Selvedge Denim', 'Cashmere Knitwear', 'Royal Silk Sherwanis'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className="hover:text-[#2563EB] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => setCurrentView('track-order')} className="hover:text-[#2563EB] transition-colors">
                  Track Consignment
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('customer-dashboard')} className="hover:text-[#2563EB] transition-colors">
                  Bespoke Fit Appointments
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('customer-dashboard')} className="hover:text-[#2563EB] transition-colors">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('customer-dashboard')} className="hover:text-[#2563EB] transition-colors">
                  Garment Care Guides
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('customer-dashboard')} className="hover:text-[#2563EB] transition-colors">
                  Support & Tailor Tickets
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Boutiques */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Flagship Boutiques
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>Via Monte Napoleone 8, Milan</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>14 Savile Row, Mayfair, London</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>742 Madison Ave, New York</span>
              </div>
              <div className="flex items-center gap-2 pt-2 text-gray-300">
                <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>+1 (800) 842-LUXE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} ATELIER & CO. S.r.l. All rights reserved. Registered in Milan & Delaware.
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white">Terms of Sartorial Service</span>
            <span className="cursor-pointer hover:text-white">Cookie Preferences</span>
            <span className="cursor-pointer hover:text-white">ESG Sustainability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
