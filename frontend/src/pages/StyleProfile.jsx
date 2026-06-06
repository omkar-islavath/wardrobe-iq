import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Camera, Sparkles, Loader2, Award, CheckCircle, HelpCircle } from 'lucide-react';
import api from '../services/api';

const StyleProfile = () => {
  const { user, updateStyleProfile, analyzeUserSelfie } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  // Custom preferences edit form
  const [preferredStyle, setPreferredStyle] = useState(user?.styleProfile?.preferredStyle || 'casual');
  const [favoriteOccasionWear, setFavoriteOccasionWear] = useState(user?.styleProfile?.favoriteOccasionWear || 'casual outing');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('selfie', file);

    const result = await analyzeUserSelfie(formData);
    setAnalyzing(false);

    if (result && !result.success) {
      setError(result.error);
    } else {
      setFile(null);
      setPreviewUrl(null);
      alert('Selfie analyzed successfully! Your style profile has been updated.');
    }
  };

  const handleUpdatePreferences = async (e) => {
    e.preventDefault();
    const res = await updateStyleProfile({
      preferredStyle,
      favoriteOccasionWear,
    });
    if (res.success) {
      alert('Style preferences updated!');
    } else {
      alert(res.error);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getProfileImage = (photo) => {
    if (!photo) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';
    if (photo.startsWith('http')) return photo;
    return `${API_URL.replace('/api', '')}${photo}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Style & Feature Profile</h2>
        <p className="text-slate-400 text-sm mt-1">Upload a selfie to let Gemini AI estimate skin tone coordinates, face geometry, and outline styling insights.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Portrait & Analyzer */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-between text-center min-h-[350px]">
          <div className="w-full flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-4">Portrait Reference</span>
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500/30 bg-slate-900/10">
              <img
                src={previewUrl || getProfileImage(user?.profilePhoto)}
                alt="Style selfie"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-4">
              <input
                id="selfie-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById('selfie-file').click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                <Camera className="w-4 h-4" />
                Select Selfie
              </button>
            </div>
          </div>

          <div className="w-full mt-6">
            {file && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:opacity-50 transition"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Face...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    Run AI Analysis
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Columns: Current Style Profile Details */}
        <div className="md:col-span-2 space-y-6">
          {/* AI Insights Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              AI Styling Insights
            </h3>

            {user?.styleProfile?.skinTone ? (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block uppercase">Skin Tone</span>
                    <strong className="text-base font-bold capitalize mt-1 block">{user.styleProfile.skinTone}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block uppercase">Face Shape</span>
                    <strong className="text-base font-bold capitalize mt-1 block">{user.styleProfile.faceShape}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block uppercase">Body Type</span>
                    <strong className="text-base font-bold capitalize mt-1 block">{user.styleProfile.bodyType || 'Athletic'}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Color Advice & Palettes</span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(user.styleProfile.preferredColors || []).map((col, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 capitalize"
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-400" style={{ backgroundColor: col }} />
                        {col}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 italic">
                    "{user.styleProfile.styleInsights}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 space-y-3">
                <Sparkles className="w-8 h-8 mx-auto text-slate-400/30" />
                <p className="text-xs max-w-sm mx-auto">
                  Analyze your selfie to identify skin palettes, face shapes, and unlock structured style suggestions.
                </p>
              </div>
            )}
          </div>

          {/* Preferences Overrides Form */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4">Manual Style Profile Settings</h3>
            
            <form onSubmit={handleUpdatePreferences} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Style Preference</label>
                  <select
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500 capitalize"
                  >
                    <option value="casual">Casual</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="formal">Formal</option>
                    <option value="bold">Bold & Vibrant</option>
                    <option value="bohemian">Bohemian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Favorite Occasion Wear</label>
                  <select
                    value={favoriteOccasionWear}
                    onChange={(e) => setFavoriteOccasionWear(e.target.value)}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500 capitalize"
                  >
                    <option value="casual outing">Casual Outing</option>
                    <option value="office">Office Wear</option>
                    <option value="placement interview">Placement Interview</option>
                    <option value="date">Date Night</option>
                    <option value="travel">Travel Wear</option>
                    <option value="party">Party wear</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleProfile;
