import React, { useState } from 'react';
import { X, Sparkles, Wand2, ArrowRight, Check, ShoppingBag, Shirt, Heart, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AIStylistOutfit, Product } from '../../types';

export const AiStylistModal: React.FC = () => {
  const {
    isAiStylistOpen,
    setIsAiStylistOpen,
    formatPrice,
    addToCart,
    addToast,
  } = useStore();

  const [occasion, setOccasion] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outfitResult, setOutfitResult] = useState<AIStylistOutfit | null>(null);

  if (!isAiStylistOpen) return null;

  const quickOccasions = [
    'Destination Wedding in Tuscany',
    'Black Tie Charity Gala',
    'Executive Boardroom Pitch',
    'Riviera Weekend Sailing',
    'Festive Sangeet Celebration',
    'Casual Date Night Chic',
  ];

  const handleGenerateOutfit = async (targetOccasion?: string) => {
    const selectedOccasion = targetOccasion || occasion;
    if (!selectedOccasion.trim()) return;

    setIsLoading(true);
    setOutfitResult(null);

    try {
      const res = await fetch('/api/stylist/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: selectedOccasion,
          preferences,
        }),
      });

      const data = await res.json();
      setOutfitResult(data);
      addToast('success', 'Bespoke Look Curated by Gemini Fashion Concierge');
    } catch (err) {
      addToast('error', 'Unable to consult styling engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntireLookToBag = () => {
    if (!outfitResult) return;
    outfitResult.recommendedProducts.forEach((prod) => {
      addToCart(prod, prod.sizes[0]?.size || 'M', prod.colors[0], 1);
    });
    addToast('success', 'Coordinated Ensemble Added to Bag!', `${outfitResult.recommendedProducts.length} items added`);
    setIsAiStylistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAiStylistOpen(false)}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl bg-stone-900 text-stone-100 rounded-3xl shadow-2xl overflow-hidden border border-amber-500/30 z-10">
          {/* Header Glow Banner */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 border-b border-amber-500/20">
            <button
              onClick={() => setIsAiStylistOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-800/80 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase font-bold tracking-[0.25em] mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Gemini Sartorial Concierge</span>
            </div>

            <h2 className="font-serif-luxury text-3xl font-bold text-white tracking-wide mb-2">
              Personal Master Stylist
            </h2>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Describe your destination, event dress code, or aesthetic preference. Our intelligent menswear consultant will construct an impeccably balanced ensemble.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Inspiration Chips */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                Popular Sartorial Occasions:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickOccasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => {
                      setOccasion(occ);
                      handleGenerateOutfit(occ);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      occasion === occ
                        ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md'
                        : 'bg-neutral-800/80 text-stone-300 border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-800'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Or Describe Your Event / Vibe:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer evening cocktail party in Monaco on a yacht"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Personal Preferences (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Earth tones, unpadded shoulders, lightweight linen preferred"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <button
                onClick={() => handleGenerateOutfit()}
                disabled={isLoading || !occasion.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Curating Haute Ensemble...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Curate Bespoke Look</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Presentation */}
            {outfitResult && (
              <div className="pt-6 border-t border-neutral-800 space-y-6 animate-fadeIn">
                {/* Sartorial Philosophy */}
                <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-500/30">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 mb-1.5">
                    Stylist Consultation Notes:
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed italic">
                    "{outfitResult.styleAdvice}"
                  </p>
                </div>

                {/* Recommended Outfit Pieces Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-stone-300">
                      Coordinated Garments ({outfitResult.recommendedProducts.length} pieces)
                    </h4>
                    <span className="text-xs font-bold text-amber-400">
                      Ensemble Total: {formatPrice(outfitResult.totalPrice)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {outfitResult.recommendedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-neutral-950 rounded-xl p-3 border border-neutral-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-800 mb-2">
                            <img
                              src={prod.images[0]}
                              alt={prod.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[10px] text-amber-400 font-semibold uppercase">{prod.brand}</div>
                          <h5 className="text-xs font-semibold text-white line-clamp-1 mb-1">{prod.title}</h5>
                          <div className="text-[11px] text-stone-400">{prod.fabric}</div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{formatPrice(prod.price)}</span>
                          <button
                            onClick={() => addToCart(prod, prod.sizes[0]?.size || 'M', prod.colors[0], 1)}
                            className="p-1.5 rounded-md bg-neutral-800 hover:bg-white hover:text-black text-stone-300 transition-colors"
                            title="Add piece to bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Styling Master Tips */}
                {outfitResult.stylingTips && outfitResult.stylingTips.length > 0 && (
                  <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-stone-400 mb-2">
                      Master Tailor Finishing Rules:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-300">
                      {outfitResult.stylingTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action button: 1-click Add Entire Look */}
                <button
                  onClick={handleAddEntireLookToBag}
                  className="w-full py-4 bg-white hover:bg-stone-200 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Coordinated Look to Bag ({formatPrice(outfitResult.totalPrice)})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
