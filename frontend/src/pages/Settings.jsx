import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Settings, CheckCircle, Loader2, Camera } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateStyleProfile, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [preferredStyle, setPreferredStyle] = useState(user?.styleProfile?.preferredStyle || 'casual');
  const [favoriteOccasionWear, setFavoriteOccasionWear] = useState(user?.styleProfile?.favoriteOccasionWear || 'casual outing');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    setPhotoLoading(true);
    try {
      const res = await api.post('/auth/profile-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setUser({
          ...user,
          profilePhoto: res.data.profilePhoto,
        });
        alert('Profile photo updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload profile photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateStyleProfile({
        name,
        preferredStyle,
        favoriteOccasionWear,
        gender,
      });

      if (res.success) {
        alert('Settings updated successfully!');
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getProfileImage = (photo) => {
    if (!photo) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';
    if (photo.startsWith('http')) return photo;
    return `${API_URL.replace('/api', '')}${photo}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account & Style Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account information, default theme values, and styling preferences.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-lg shrink-0">
            {photoLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              </div>
            ) : null}
            <img
              src={getProfileImage(user?.profilePhoto)}
              alt="Profile photo"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer">
              <Camera className="w-4 h-4 text-white mb-0.5" />
              <span className="text-[8px] text-white font-extrabold tracking-wider uppercase">Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={photoLoading}
              />
            </label>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Profile Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500 capitalize"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Preferred Style</label>
              <select
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500 capitalize"
              >
                <option value="casual">Casual</option>
                <option value="minimalist">Minimalist</option>
                <option value="formal">Formal</option>
                <option value="bold">Bold & Vibrant</option>
                <option value="bohemian">Bohemian</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5">Favorite Occasion Wear</label>
              <select
                value={favoriteOccasionWear}
                onChange={(e) => setFavoriteOccasionWear(e.target.value)}
                className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-indigo-500 capitalize"
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

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 disabled:opacity-50 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
