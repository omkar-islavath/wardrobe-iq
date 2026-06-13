import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Settings, CheckCircle, Loader2, Camera, Eye, X } from 'lucide-react';

const SettingsPage = () => {
  const { user, updateStyleProfile, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [preferredStyle, setPreferredStyle] = useState(user?.styleProfile?.preferredStyle || 'casual');
  const [favoriteOccasionWear, setFavoriteOccasionWear] = useState(user?.styleProfile?.favoriteOccasionWear || 'casual outing');
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowMenu(false);
  };

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
          <div className="relative shrink-0" ref={menuRef}>
            <div 
              onClick={() => setShowMenu(!showMenu)}
              className="relative group cursor-pointer w-16 h-16 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-lg"
            >
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition duration-300">
                <Camera className="w-4 h-4 text-white mb-0.5" />
                <span className="text-[8px] text-white font-extrabold tracking-wider uppercase">Options</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={photoLoading}
            />

            {showMenu && (
              <div className="absolute left-0 mt-2 w-40 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowLightbox(true);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Photo
                </button>
                <button
                  type="button"
                  onClick={triggerFileSelect}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/70 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Change Photo
                </button>
              </div>
            )}
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

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowLightbox(false)}
          />
          <div className="relative max-w-sm w-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-2xl z-10 flex flex-col items-center animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition duration-200"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-indigo-500/20 shadow-xl mt-4 mb-4">
              <img
                src={getProfileImage(user?.profilePhoto)}
                alt="Profile photo preview"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
