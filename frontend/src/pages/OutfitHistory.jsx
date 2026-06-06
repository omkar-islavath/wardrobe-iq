import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Calendar,
  Heart,
  Trash2,
  CalendarDays,
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

const OutfitHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); // timeline or calendar

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/outfits/history');
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (outfitId) => {
    try {
      const res = await api.put(`/outfits/${outfitId}/favorite`);
      if (res.data.success) {
        setHistory(prevHistory =>
          prevHistory.map(item =>
            item._id === outfitId ? { ...item, isFavorite: res.data.isFavorite } : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (outfitId) => {
    if (!window.confirm('Are you sure you want to remove this outfit from your log?')) return;
    try {
      const res = await api.delete(`/outfits/${outfitId}`);
      if (res.data.success) {
        setHistory(prevHistory => prevHistory.filter(item => item._id !== outfitId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogWear = async (outfitId, dateStr) => {
    try {
      const res = await api.post(`/outfits/${outfitId}/wear`, { dateWorn: dateStr || new Date() });
      if (res.data.success) {
        fetchHistory(); // refresh logs
        alert('Outfit logged as worn!');
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter outfits worn in the calendar
  const wornOutfits = history.filter(item => item.dateWorn);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Style Diary & Logs</h2>
          <p className="text-slate-400 text-sm mt-1">Review saved combinations, log worn days, and monitor outfit freshness.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'timeline'
                ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Saved Outfits
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-800 shadow text-slate-800 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Calendar Calendar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : activeTab === 'timeline' ? (
        // TIMELINE TAB
        history.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400/40" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Style diary is empty</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              You haven't saved any outfits yet. Head over to the Outfit Generator to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item._id}
                className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Outfit Info */}
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Images row */}
                  <div className="flex gap-2">
                    {item.outfitItems.map((garment, idx) => (
                      <img
                        key={idx}
                        src={getItemImage(garment.imageUrl)}
                        alt={garment.category}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800/80 shadow-sm"
                        title={`${garment.color} ${garment.category}`}
                      />
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full capitalize">
                        {item.occasion}
                      </span>
                      <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {item.score}% score
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Saved on {formatDate(item.dateGenerated)}
                    </p>
                    {item.dateWorn && (
                      <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Worn on {formatDate(item.dateWorn)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-4 md:pt-0 border-t border-slate-200 dark:border-slate-800 md:border-0">
                  {!item.dateWorn && (
                    <button
                      onClick={() => handleLogWear(item._id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                    >
                      Wear Today
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleFavorite(item._id)}
                    className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${
                      item.isFavorite ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-slate-400'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // CALENDAR TAB
        wornOutfits.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 text-slate-400/40" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No calendar events</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Log your outfits as worn by clicking "Wear Today" in recommendations or saved lists.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold">Chronological Wear History</h3>
            <div className="relative border-l border-indigo-500/20 dark:border-indigo-500/10 pl-6 ml-4 space-y-6">
              {wornOutfits.map((item, idx) => (
                <div key={item._id} className="relative">
                  {/* Timeline dot */}
                  <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 ring-8 ring-white dark:ring-slate-950">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>

                  <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {item.outfitItems.map((garment, idx) => (
                          <img
                            key={idx}
                            src={getItemImage(garment.imageUrl)}
                            alt={garment.category}
                            className="w-10 h-10 rounded-lg object-cover border-2 border-white dark:border-slate-950 shadow-sm"
                            title={`${garment.color} ${garment.category}`}
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold capitalize text-slate-800 dark:text-slate-100">
                          {item.occasion} outfit ({item.score}% Match)
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Worn on {formatDate(item.dateWorn)}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default OutfitHistory;
