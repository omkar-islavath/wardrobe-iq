import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';

const UploadClothing = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedItem, setAnalyzedItem] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalyzedItem(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalyzedItem(null);
      setError('');
    } else {
      setError('Please drop an image file');
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setError('Please choose a file first');
      return;
    }

    setAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/wardrobe/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setAnalyzedItem(res.data.item);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload and analyze image');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFinalSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/wardrobe/${analyzedItem._id}`, analyzedItem);
      if (res.data.success) {
        navigate('/wardrobe');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save details');
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getImageUrl = (url) => {
    if (url.startsWith('http')) return url;
    return `${API_URL.replace('/api', '')}${url}`;
  };

  const maleCategories = ['shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
  const femaleCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree', 'shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
  const categoriesList = user?.gender === 'female' ? femaleCategories : maleCategories;
  const stylesList = ['casual', 'formal', 'party', 'traditional', 'travel'];
  const seasonsList = ['summer', 'winter', 'rainy', 'spring-fall', 'all'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Digitize Your Clothes</h2>
        <p className="text-slate-400 text-sm mt-1">Upload a garment picture, and Gemini AI will analyze its tags and features instantly.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Selector & Upload Preview */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Garment Photo</span>
            
            {!previewUrl ? (
              // Drag & Drop Area
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl aspect-square flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => document.getElementById('file-input').click()}
              >
                <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drag & Drop Image Here</p>
                <p className="text-xs text-slate-400 mt-1">or click to browse from device</p>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              // Preview Area
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900/10">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setFile(null); setPreviewUrl(null); setAnalyzedItem(null); }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-white text-xs font-bold"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            {file && !analyzedItem && (
              <button
                onClick={handleUploadAndAnalyze}
                disabled={analyzing}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:opacity-50 transition"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gemini AI Tagging...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-purple-200" />
                    Analyze with AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Card: AI Predictions Verification */}
        <div className="glass-panel rounded-3xl p-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">AI Vision Verification</span>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Evaluating features with Gemini Vision...</p>
              <p className="text-xs text-slate-400 max-w-[200px]">We are detecting category, primary & secondary colors, patterns, and seasons.</p>
            </div>
          ) : !analyzedItem ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-slate-400">
              <Sparkles className="w-10 h-10 mb-3 text-slate-400/40" />
              <p className="text-sm">Upload and run AI analysis to display details.</p>
            </div>
          ) : (
            // Form to verify & save
            <form onSubmit={handleFinalSave} className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl p-4 flex gap-2 text-xs">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold">Analysis Complete!</p>
                  <p className="text-slate-400 mt-0.5">Please review the tags below and save them to your digital closet.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={analyzedItem.category}
                    onChange={(e) => setAnalyzedItem({ ...analyzedItem, category: e.target.value })}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                    required
                  >
                    {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Color</label>
                    <input
                      type="text"
                      value={analyzedItem.color}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, color: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Secondary Color</label>
                    <input
                      type="text"
                      value={analyzedItem.secondaryColor || ''}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, secondaryColor: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Pattern</label>
                    <input
                      type="text"
                      value={analyzedItem.pattern || ''}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, pattern: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Brand</label>
                    <select
                      value={analyzedItem.brand || 'Generic'}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, brand: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                      required
                    >
                      <option value="Generic">Generic</option>
                      <option value="Roadster">Roadster</option>
                      <option value="Wrogn">Wrogn</option>
                      <option value="HRX">HRX</option>
                      <option value="Puma">Puma</option>
                      <option value="Bata">Bata</option>
                      <option value="Louis Philippe">Louis Philippe</option>
                      <option value="Mast & Harbour">Mast & Harbour</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Nike">Nike</option>
                      <option value="Zara">Zara</option>
                      <option value="H&M">H&M</option>
                      <option value="Levi's">Levi's</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Style</label>
                    <select
                      value={analyzedItem.style}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, style: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                    >
                      {stylesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Season</label>
                    <select
                      value={analyzedItem.season}
                      onChange={(e) => setAnalyzedItem({ ...analyzedItem, season: e.target.value })}
                      className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                    >
                      {seasonsList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tags (separated by comma)</label>
                  <input
                    type="text"
                    value={(analyzedItem.tags || []).join(', ')}
                    onChange={(e) => setAnalyzedItem({ ...analyzedItem, tags: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 transition"
              >
                <span>Save to Wardrobe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadClothing;
