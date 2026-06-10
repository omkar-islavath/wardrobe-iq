import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Loader2,
  DollarSign,
  HelpCircle,
  Tag,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ShoppingAssistant = () => {
  const [gaps, setGaps] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [gapsLoading, setGapsLoading] = useState(true);
  const [suggestLoading, setSuggestLoading] = useState(false);
  
  // Search state
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState(1500);
  const [brand, setBrand] = useState('');

  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchGaps();
  }, []);

  const fetchGaps = async () => {
    try {
      setGapsLoading(true);
      const res = await api.get('/shopping/gap-analysis');
      if (res.data.success) {
        setGaps(res.data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGapsLoading(false);
    }
  };

  const handleSearchSuggestions = async (e) => {
    e.preventDefault();
    if (!query) return;

    setSuggestLoading(true);
    setHasSearched(true);
    try {
      const res = await api.post('/shopping/suggest', {
        query,
        budget,
        brand,
      });

      if (res.data.success) {
        setSuggestions(res.data.suggestions);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch shopping recommendations');
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Smart Shopping Assistant</h2>
        <p className="text-slate-400 text-sm mt-1">Identify gaps in your current wardrobe and let AI recommend matching pieces with shop links.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gap Analysis Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="text-amber-500 w-5 h-5" />
              Wardrobe Gap Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our AI continuously reviews your current inventory categories, color distribution, and styles to map missing essentials.
            </p>

            {gapsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : !gaps || !gaps.gaps || gaps.gaps.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-slate-400">No active wardrobe gaps identified. Good job!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Gaps List */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Identified Gaps</span>
                  {gaps.gaps.map((gap, idx) => (
                    <div key={idx} className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3 text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                      {gap}
                    </div>
                  ))}
                </div>

                {/* Suggestions List */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Recommendations</span>
                  {gaps.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-indigo-500">
                      {suggestion}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Interactive Shopping Assistant Query & Product Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Query Form */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-500" />
              Find Matching Clothes
            </h3>

            <form onSubmit={handleSearchSuggestions} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. I need a formal white shirt, or dark jeans under ₹1500"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 rounded-2xl border-0 bg-slate-100 dark:bg-slate-900 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  required
                />
                <button
                  type="submit"
                  disabled={suggestLoading}
                  className="px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {suggestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask AI'}
                </button>
              </div>

              {/* Filters dropdown overrides */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Max Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500"
                  >
                    <option value="500">₹500</option>
                    <option value="1000">₹1000</option>
                    <option value="1500">₹1500</option>
                    <option value="2000">₹2000</option>
                    <option value="3000">₹3000</option>
                    <option value="5000">₹5000</option>
                    <option value="100000">No Limit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Preferred Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500"
                  >
                    <option value="">Any</option>
                    {['Roadster', 'Wrogn', 'HRX', 'Puma', 'Bata', 'Louis Philippe', 'Mast & Harbour', 'Adidas', 'Nike', 'Zara', 'H&M', 'Levi\'s', 'Biba', 'W', 'Only', 'Vero Moda', 'Allen Solly', 'Van Heusen', 'Tommy Hilfiger', 'Others'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Results Grid */}
          {suggestLoading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : suggestions.length === 0 ? (
            hasSearched ? (
              <div className="glass-panel p-8 rounded-3xl text-center text-slate-400">
                <p className="text-sm">No specific recommendations found. Try adjusting your query or filters.</p>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto text-slate-400/30 mb-2" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Awaiting Shopping Queries</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Type a request above (e.g. "checked shirt for date night under ₹1200") to let Gemini AI match it against your digital wardrobe.
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((prod, idx) => (
                <div key={idx} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-slate-900/10">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                      ₹{prod.price}
                    </span>
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{prod.brand}</span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate mt-0.5">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-2 border-t border-slate-200 dark:border-slate-800 pt-2">
                        {prod.matchReason}
                      </p>
                    </div>

                    <a
                      href={prod.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Purchase Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingAssistant;
