import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  CloudSun,
  Shirt,
  Sparkles,
  AlertTriangle,
  History,
  ArrowRight,
  TrendingUp,
  User,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [weather, setWeather] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [recentWorn, setRecentWorn] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Wardrobe items
        const wardrobeRes = await api.get('/wardrobe');
        if (wardrobeRes.data.success) {
          setItemCount(wardrobeRes.data.count);
        }

        // 2. Fetch Outfit history
        const historyRes = await api.get('/outfits/history');
        if (historyRes.data.success) {
          const wornOnly = historyRes.data.history.filter(o => o.dateWorn).slice(0, 3);
          setRecentWorn(wornOnly);
        }

        // 3. Fetch Wardrobe gaps
        const gapsRes = await api.get('/shopping/gap-analysis');
        if (gapsRes.data.success) {
          setGaps(gapsRes.data.analysis.gaps.slice(0, 2));
        }

        // 4. Generate recommendations based on preferred style or 'casual outing'
        const preferredOccasion = user?.styleProfile?.favoriteOccasionWear || 'casual outing';
        const recRes = await api.post('/outfits/generate', { occasion: preferredOccasion });
        if (recRes.data.success) {
          setWeather(recRes.data.weather);
          setRecommendations(recRes.data.recommendations.slice(0, 3));
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogWorn = async (outfitId) => {
    try {
      const res = await api.post(`/outfits/${outfitId}/wear`);
      if (res.data.success) {
        // Refresh history
        const historyRes = await api.get('/outfits/history');
        if (historyRes.data.success) {
          setRecentWorn(historyRes.data.history.filter(o => o.dateWorn).slice(0, 3));
        }
        alert("Outfit successfully logged in your calendar!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getItemImage = (imgUrl) => {
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL.replace('/api', '')}${imgUrl}`;
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Weather Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-[50px] translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h2>
              <p className="text-indigo-100/90 mt-2 max-w-md leading-relaxed text-sm">
                Today is a great day to express yourself. Let's find the perfect outfit matching your wardrobe's characteristics.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/upload-clothing"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-slate-50 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload New Garment
              </Link>
              <Link
                to="/generate-outfits"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                Generate Outfits
              </Link>
            </div>
          </div>
        </div>

        {/* Weather Card */}
        {weather && (
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Local Weather</h3>
                <p className="text-xl font-bold mt-1">{weather.cityName}</p>
              </div>
              <CloudSun className="w-8 h-8 text-amber-500 animate-float" />
            </div>
            <div className="my-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tighter">{Math.round(weather.temp)}°C</span>
                <span className="text-slate-400 text-sm font-medium capitalize">{weather.description}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Rain probability: {weather.rainProbability}% | Humidity: {weather.humidity}%
              </p>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <span className="text-xs text-slate-400 leading-none">
                Recommendation: {weather.temp > 28 ? "Dress light, cotton wear recommended." : weather.temp < 16 ? "Layering requested. Grab a jacket." : "Mild weather. Highly flexible style ranges."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-500">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Wardrobe Items</h4>
            <p className="text-2xl font-extrabold mt-0.5">{itemCount}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Style Profile</h4>
            <p className="text-lg font-extrabold mt-0.5 capitalize">{user?.styleProfile?.preferredStyle || 'Casual'}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Active Gaps</h4>
            <p className="text-2xl font-extrabold mt-0.5">{gaps.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Outfits & Gaps/History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outfit Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold tracking-tight">Today's Top Outfits</h3>
            <Link to="/generate-outfits" className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 transition">
              <span>More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl text-center">
              <Shirt className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h4 className="text-base font-bold">No recommendations generated yet</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Add at least one top, bottom, and pair of shoes to your digital wardrobe to start generating outfits!
              </p>
              <Link to="/upload-clothing" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-500 hover:underline">
                Upload now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="glass-card rounded-3xl overflow-hidden p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-indigo-500 tracking-wide capitalize bg-indigo-500/10 px-2 py-0.5 rounded-full">
                        {user?.styleProfile?.favoriteOccasionWear || 'Casual'}
                      </span>
                      <span className="text-sm font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {rec.score}%
                      </span>
                    </div>

                    <div className="flex gap-2 my-4 justify-center">
                      {rec.outfitItems.map((item, itemIdx) => (
                        <img
                          key={itemIdx}
                          src={getItemImage(item.imageUrl)}
                          alt={item.category}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          title={`${item.color} ${item.category}`}
                        />
                      ))}
                    </div>

                    <div className="space-y-1">
                      {rec.outfitItems.map((item, itemIdx) => (
                        <p key={itemIdx} className="text-xs text-slate-400 capitalize truncate">
                          • {item.color} {item.category}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => handleLogWorn(rec._id || index)}
                      className="w-full text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      Wear Today
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel: Style Profile & Recent History */}
        <div className="space-y-6">
          {/* Style Profile Summary */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Style Profile Summary
            </h3>
            
            {user?.styleProfile?.skinTone ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Skin Tone:</span>
                  <span className="font-semibold capitalize">{user.styleProfile.skinTone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Face Shape:</span>
                  <span className="font-semibold capitalize">{user.styleProfile.faceShape}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Colors:</span>
                  <div className="flex gap-1">
                    {(user.styleProfile.preferredColors || []).slice(0, 3).map((col, idx) => (
                      <span key={idx} className="w-4 h-4 rounded-full border border-slate-400" style={{ backgroundColor: col }} title={col} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed italic border-t border-slate-200 dark:border-slate-800 pt-3">
                  "{user.styleProfile.styleInsights}"
                </p>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-400">
                  Analyze your skin tone & face shape using AI selfie analysis for customized recommendations.
                </p>
                <Link to="/style-profile" className="inline-block text-xs font-bold text-indigo-500 hover:underline">
                  Analyze Selfie Now
                </Link>
              </div>
            )}
          </div>

          {/* Gaps / Tips */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Wardrobe Gap Analysis
            </h3>
            {gaps.length === 0 ? (
              <p className="text-xs text-slate-400">Excellent! No missing wardrobe gaps flagged.</p>
            ) : (
              <div className="space-y-3">
                {gaps.map((gap, idx) => (
                  <div key={idx} className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3 flex gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <span>{gap}</span>
                  </div>
                ))}
                <Link to="/shopping" className="block text-xs font-bold text-indigo-500 text-center hover:underline pt-1">
                  Ask Shopping Assistant
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
