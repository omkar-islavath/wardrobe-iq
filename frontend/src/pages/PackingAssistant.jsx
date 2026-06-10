import React, { useState } from 'react';
import api from '../services/api';
import {
  Luggage,
  Sparkles,
  CheckSquare,
  Square,
  Calendar,
  CloudSun,
  MapPin,
  Loader2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const PackingAssistant = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [tripWeather, setTripWeather] = useState('all');
  const [packingData, setPackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState({});

  const handleGenerateList = async (e) => {
    e.preventDefault();
    if (!destination) return;

    setLoading(true);
    try {
      // Fetch user's wardrobe to build list
      const res = await api.get('/wardrobe');
      if (res.data.success) {
        const wardrobe = res.data.items;
        generateTripSchedule(wardrobe);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate packing list');
    } finally {
      setLoading(false);
    }
  };

  const generateTripSchedule = (wardrobe) => {
    const totalDays = parseInt(days) || 1;
    // Separate garments
    const tops = wardrobe.filter(i => ['shirt', 't-shirt'].includes(i.category));
    const bottoms = wardrobe.filter(i => ['pants', 'jeans', 'shorts'].includes(i.category));
    const shoes = wardrobe.filter(i => i.category === 'shoes');
    const jackets = wardrobe.filter(i => i.category === 'jacket');

    // Create a packing list checklist
    const initialChecklist = {
      "Passport & Documents": false,
      "Toothbrush & Toiletries": false,
      "Chargers & Adapters": false,
    };

    // Calculate how many items we need to pack based on days
    const topsNeeded = Math.ceil(totalDays * 1.2);
    const bottomsNeeded = Math.ceil(totalDays / 2);
    const shoesNeeded = 2;
    const jacketsNeeded = tripWeather === 'winter' ? 2 : (tripWeather === 'all' ? 1 : 0);

    initialChecklist[`${topsNeeded} Tops (Shirts/T-shirts)`] = false;
    initialChecklist[`${bottomsNeeded} Bottoms (Jeans/Pants)`] = false;
    initialChecklist[`${shoesNeeded} Pairs of Shoes`] = false;
    if (jacketsNeeded > 0) {
      initialChecklist[`${jacketsNeeded} Jackets/Outerwear`] = false;
    }
    initialChecklist[`Underwear & Socks (${totalDays} pairs)`] = false;

    setChecklist(initialChecklist);

    // Build day-by-day outfits schedule
    const dailySchedule = [];
    for (let day = 1; day <= totalDays; day++) {
      // Pick matching items or fallback to text if wardrobe is sparse
      const top = tops[day % tops.length] || { color: 'solid', category: 'top', imageUrl: '' };
      const bottom = bottoms[day % bottoms.length] || { color: 'neutral', category: 'bottom', imageUrl: '' };
      const shoe = shoes[day % shoes.length] || { color: 'comfortable', category: 'footwear', imageUrl: '' };
      const jacket = jacketsNeeded > 0 ? (jackets[day % jackets.length] || null) : null;

      dailySchedule.push({
        day,
        top,
        bottom,
        shoe,
        jacket,
        activity: day === 1 ? 'Travel & Check-in' : day === days ? 'Travel Back & Souvenir Shopping' : 'Sightseeing & Dinner'
      });
    }

    setPackingData({
      destination,
      days: totalDays,
      weather: tripWeather,
      dailySchedule
    });
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getItemImage = (imgUrl) => {
    if (!imgUrl) return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&q=80';
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL.replace('/api', '')}${imgUrl}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Smart Trip Packing Assistant</h2>
        <p className="text-slate-400 text-sm mt-1">Plan your travels. Input destination details to map checklists and calendar outfit schedules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Input parameters */}
        <div className="glass-panel p-6 rounded-3xl h-fit">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">Trip Details</span>
          <form onSubmit={handleGenerateList} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Destination City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-4 py-2.5 text-xs focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                  required
                >
                  <option value="">Choose Destination...</option>
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
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setDays('');
                  } else {
                    const parsed = parseInt(val);
                    if (!isNaN(parsed)) {
                      setDays(Math.min(14, Math.max(1, parsed)));
                    }
                  }
                }}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 text-xs focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Weather</label>
              <select
                value={tripWeather}
                onChange={(e) => setTripWeather(e.target.value)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500"
              >
                <option value="all">Mild / Mixed (20-27°C)</option>
                <option value="summer">Hot / Sunny (&gt;28°C)</option>
                <option value="winter">Cold / Layering (&lt;16°C)</option>
                <option value="rainy">Rainy / Monsoon</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating List...
                </>
              ) : (
                <>
                  <Luggage className="w-4 h-4" />
                  Generate Packing Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Trip Output Lists */}
        <div className="md:col-span-2 space-y-6">
          {!packingData ? (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 h-[350px] flex flex-col items-center justify-center">
              <Luggage className="w-12 h-12 mb-3 text-slate-400/30" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No active packing logs</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Enter your trip destination and duration on the left to map a checklist and outfit calendar.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Checklist Panel */}
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-500" />
                  Packing Checklist ({destination})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.keys(checklist).map((item) => (
                    <div
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      {checklist[item] ? (
                        <CheckSquare className="w-5 h-5 text-indigo-500" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                      <span className={`text-xs ${checklist[item] ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Panel */}
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Daily Outfit Schedule
                </h3>

                <div className="space-y-4">
                  {packingData.dailySchedule.map((dayPlan) => (
                    <div
                      key={dayPlan.day}
                      className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                          Day {dayPlan.day}
                        </span>
                        <p className="text-xs font-bold mt-1 text-slate-800 dark:text-slate-200">{dayPlan.activity}</p>
                      </div>

                      {/* Outfit row */}
                      <div className="flex gap-2 items-center flex-wrap">
                        {dayPlan.top.imageUrl && (
                          <img
                            src={getItemImage(dayPlan.top.imageUrl)}
                            alt="Top"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-800"
                            title={`${dayPlan.top.color} top`}
                          />
                        )}
                        {dayPlan.bottom.imageUrl && (
                          <img
                            src={getItemImage(dayPlan.bottom.imageUrl)}
                            alt="Bottom"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-800"
                            title={`${dayPlan.bottom.color} bottom`}
                          />
                        )}
                        {dayPlan.shoe.imageUrl && (
                          <img
                            src={getItemImage(dayPlan.shoe.imageUrl)}
                            alt="Shoe"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-800"
                            title={`${dayPlan.shoe.color} shoes`}
                          />
                        )}
                        {dayPlan.jacket && dayPlan.jacket.imageUrl && (
                          <img
                            src={getItemImage(dayPlan.jacket.imageUrl)}
                            alt="Jacket"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-800"
                            title={`${dayPlan.jacket.color} jacket`}
                          />
                        )}
                        
                        {/* Text Fallback if wardrobe empty */}
                        {!dayPlan.top.imageUrl && (
                          <span className="text-[10px] text-slate-400 capitalize bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            {dayPlan.top.color} {dayPlan.top.category} + {dayPlan.bottom.color} {dayPlan.bottom.category} + {dayPlan.shoe.color} {dayPlan.shoe.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackingAssistant;
