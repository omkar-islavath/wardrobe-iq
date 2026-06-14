import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import WardrobeItemImage from '../components/WardrobeItemImage';
import { AuthContext } from '../context/AuthContext';
import {
  Sparkles,
  CloudSun,
  ShieldCheck,
  CalendarHeart,
  Save,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Layers,
  Palette
} from 'lucide-react';

const OutfitGenerator = () => {
  const { user } = useContext(AuthContext);
  const [occasion, setOccasion] = useState('casual outing');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedOutfitIds, setSavedOutfitIds] = useState([]);

  const occasionsList = [
    'college',
    'office',
    'placement interview',
    'casual outing',
    'date',
    'wedding',
    'party',
    'travel',
    'festival',
  ];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { occasion };
      if (city) payload.city = city;

      const res = await api.post('/outfits/generate', payload);
      if (res.data.success) {
        setWeather(res.data.weather);
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial generate on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleSaveOutfit = async (rec) => {
    try {
      const res = await api.post('/outfits/save', {
        outfitItems: rec.outfitItems.map(i => i.id),
        occasion,
        score: rec.score,
        scoreBreakdown: rec.scoreBreakdown,
      });

      if (res.data.success) {
        setSavedOutfitIds([...savedOutfitIds, res.data.outfit.id]);
        alert('Outfit saved to history!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save outfit');
    }
  };

  const handleLogWorn = async (rec) => {
    try {
      // First save if not saved, or we can check if it's already saved.
      // For simplicity, we create a saved record and immediately log it as worn!
      const saveRes = await api.post('/outfits/save', {
        outfitItems: rec.outfitItems.map(i => i.id),
        occasion,
        score: rec.score,
        scoreBreakdown: rec.scoreBreakdown,
      });

      if (saveRes.data.success) {
        const outfitId = saveRes.data.outfit.id;
        const wearRes = await api.post(`/outfits/${outfitId}/wear`);
        if (wearRes.data.success) {
          alert('Outfit logged in your calendar as worn today!');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to log wear event');
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getItemImage = (imgUrl) => {
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL.replace('/api', '')}${imgUrl}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Outfit Recommendation Engine</h2>
        <p className="text-slate-400 text-sm mt-1">Rule-based combinations matching color harmonies, occasion parameters, local weather, preferences, and wear freshness.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Inputs Form */}
      <form onSubmit={handleGenerate} className="glass-panel p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Occasion Wear</label>
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500 capitalize"
          >
            {occasionsList.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">City (Weather Location)</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
          >
            <option value="">Auto-Detect (Hyderabad)</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50 transition"
        >
          {loading ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </form>

      {/* Current Context Display */}
      {weather && (
        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-indigo-500" />
            <span className="text-slate-400">Current Weather in {weather.cityName}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{Math.round(weather.temp)}°C, {weather.description}</span>
          </div>
          <div className="flex gap-4">
            <span>Rain Prob: <strong className="text-indigo-400">{weather.rainProbability}%</strong></span>
            <span>Humidity: <strong className="text-indigo-400">{weather.humidity}%</strong></span>
          </div>
        </div>
      )}

      {/* Outputs Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-400/40 animate-pulse-slow" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No combinations available</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Make sure your wardrobe contains matching tops, bottoms, and shoes for the system to combine them!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
              {/* Card Top: Score breakdown */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400 capitalize">Option #{idx + 1}</span>
                  <span className="text-base font-extrabold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                    {rec.score}% Match
                  </span>
                </div>

                {/* Score breakdown bars */}
                <div className="mt-4 space-y-2 text-[10px]">
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Color compatibility (40%)</span>
                      <span>{rec.scoreBreakdown.colorCompatibility} / 40</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1">
                      <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${(rec.scoreBreakdown.colorCompatibility / 40) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Occasion correctness (25%)</span>
                      <span>{rec.scoreBreakdown.occasionMatch} / 25</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1">
                      <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${(rec.scoreBreakdown.occasionMatch / 25) * 100}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 block">Weather:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{rec.scoreBreakdown.weatherMatch}/15</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Profile:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{rec.scoreBreakdown.userPreferenceMatch}/10</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Freshness:</span>
                      <strong className="text-slate-700 dark:text-slate-200">{rec.scoreBreakdown.freshness}/10</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Center: Clothing item list */}
              <div className="p-6 bg-slate-500/3 flex gap-3 overflow-x-auto">
                {rec.outfitItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="shrink-0 w-20 text-center space-y-1">
                    <WardrobeItemImage
                      src={getItemImage(item.imageUrl)}
                      category={item.category}
                      color={item.color}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                    />
                    <p className="text-[10px] font-bold capitalize truncate leading-none mt-1">{item.color} {item.category}</p>
                    <p className="text-[9px] text-slate-400 capitalize truncate leading-none">{item.style}</p>
                  </div>
                ))}
              </div>

              {/* Card Bottom: Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800/80 flex gap-3">
                <button
                  onClick={() => handleSaveOutfit(rec)}
                  className="flex-1 py-2.5 rounded-xl border border-indigo-500 text-indigo-500 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-500/5 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Outfit
                </button>
                <button
                  onClick={() => handleLogWorn(rec)}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 transition"
                >
                  <CalendarHeart className="w-4 h-4" />
                  Wear & Log
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;
