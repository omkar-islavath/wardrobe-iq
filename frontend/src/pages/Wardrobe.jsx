import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import WardrobeItemImage from '../components/WardrobeItemImage';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  X,
  Tag,
  Calendar,
  Layers,
  Palette,
  Shirt,
  User
} from 'lucide-react';

const Wardrobe = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [season, setSeason] = useState('');
  const [brand, setBrand] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Modal & Edit state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    category: '',
    color: '',
    secondaryColor: '',
    pattern: '',
    style: '',
    season: '',
    brand: '',
    tags: '',
  });

  const maleCategories = ['shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
  const femaleCategories = ['top', 'crop top', 'kurti', 'skirt', 'leggings', 'dress', 'saree', 'shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'jacket', 'shoes', 'accessories'];
  const categoriesList = user?.gender === 'female' ? femaleCategories : maleCategories;
  const colorsList = ['white', 'black', 'grey', 'navy blue', 'blue', 'olive', 'beige', 'brown', 'red', 'yellow', 'pink', 'green', 'orange', 'purple', 'maroon', 'cream', 'khaki', 'teal', 'peach', 'others'];
  const stylesList = ['casual', 'formal', 'party', 'traditional', 'travel'];
  const seasonsList = ['summer', 'winter', 'rainy', 'spring-fall', 'all'];
  const brandsList = ['Roadster', 'Wrogn', 'HRX', 'Puma', 'Bata', 'Louis Philippe', 'Mast & Harbour', 'Adidas', 'Nike', 'Zara', 'H&M', 'Levi\'s', 'Biba', 'W', 'Only', 'Vero Moda', 'Allen Solly', 'Van Heusen', 'Tommy Hilfiger', 'Others'];

  useEffect(() => {
    fetchItems();
  }, [category, color, style, season, brand, genderFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (category) queryParams.push(`category=${category}`);
      if (color) queryParams.push(`color=${color}`);
      if (style) queryParams.push(`style=${style}`);
      if (season) queryParams.push(`season=${season}`);
      if (brand) queryParams.push(`brand=${brand}`);
      if (genderFilter) queryParams.push(`gender=${genderFilter}`);
      if (search) queryParams.push(`search=${search}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/wardrobe${queryString}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsEditing(false);
    setEditForm({
      category: item.category,
      color: item.color,
      secondaryColor: item.secondaryColor || '',
      pattern: item.pattern || '',
      style: item.style || '',
      season: item.season || 'all',
      brand: item.brand || '',
      gender: item.gender || 'unisex',
      tags: (item.tags || []).join(', '),
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editForm,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const res = await api.put(`/wardrobe/${selectedItem._id}`, payload);
      if (res.data.success) {
        // Update local items array
        setItems(prevItems =>
          prevItems.map(item => (item._id === selectedItem._id ? res.data.item : item))
        );
        setSelectedItem(res.data.item);
        setIsEditing(false);
        alert('Garment details updated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update details');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item from your wardrobe?')) return;

    try {
      const res = await api.delete(`/wardrobe/${itemId}`);
      if (res.data.success) {
        setItems(prevItems => prevItems.filter(item => item._id !== itemId));
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getItemImage = (imgUrl) => {
    if (imgUrl.startsWith('http')) return imgUrl;
    return `${API_URL.replace('/api', '')}${imgUrl}`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Upload Trigger */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Digital Wardrobe</h2>
          <p className="text-slate-400 text-sm mt-1">Browse, filter, and inspect your garments.</p>
        </div>
        <Link
          to="/upload-clothing"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, tag, pattern..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-0 bg-slate-100 dark:bg-slate-900 pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
          >
            Search
          </button>
        </form>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500"
            >
              <option value="">All Colors</option>
              {colorsList.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500"
            >
              <option value="">All Styles</option>
              {stylesList.map(sty => <option key={sty} value={sty}>{sty}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Season</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500"
            >
              <option value="">All Seasons</option>
              {seasonsList.map(sea => <option key={sea} value={sea}>{sea}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500"
            >
              <option value="">All Brands</option>
              {brandsList.map(brnd => <option key={brnd} value={brnd}>{brnd}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-indigo-500 capitalize"
            >
              <option value="">All Genders</option>
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wardrobe Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Shirt className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <h4 className="text-base font-bold">No garments found</h4>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your search criteria or upload a new item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => handleOpenDetail(item)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                <WardrobeItemImage
                  src={getItemImage(item.imageUrl)}
                  category={item.category}
                  color={item.color}
                  showColor={true}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wide text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wide text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      {item.style}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-2 capitalize truncate">
                    {item.color} {item.category}
                  </h4>
                  <p className="text-xs text-slate-400 capitalize mt-1">
                    Brand: {item.brand || 'Generic'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details / Edit Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image */}
            <div className="md:w-1/2 bg-slate-900/30 flex items-center justify-center aspect-square md:aspect-auto">
              <WardrobeItemImage
                src={getItemImage(selectedItem.imageUrl)}
                category={selectedItem.category}
                color={selectedItem.color}
                showColor={true}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Info / Form */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold capitalize">{selectedItem.color} {selectedItem.category}</h3>
                    <p className="text-sm text-slate-400 mt-1 capitalize">Pattern: {selectedItem.pattern || 'Solid'}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold capitalize">{selectedItem.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Palette className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400">Secondary Color:</span>
                      <span className="font-semibold capitalize">{selectedItem.secondaryColor || 'None'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400">Brand:</span>
                      <span className="font-semibold capitalize">{selectedItem.brand || 'Generic'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400">Recommended Season:</span>
                      <span className="font-semibold capitalize">{selectedItem.season || 'All'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="text-slate-400">Target Gender:</span>
                      <span className="font-semibold capitalize">{selectedItem.gender || 'unisex'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Garment Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedItem.tags || []).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2.5 rounded-xl border border-indigo-500 text-indigo-500 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-500/5 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit details
                    </button>
                    <button
                      onClick={() => handleDeleteItem(selectedItem._id)}
                      className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold">Verify & Tweak AI tags</h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
                          value={editForm.color}
                          onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Secondary Color</label>
                        <input
                          type="text"
                          value={editForm.secondaryColor}
                          onChange={(e) => setEditForm({ ...editForm, secondaryColor: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Pattern</label>
                        <input
                          type="text"
                          value={editForm.pattern}
                          onChange={(e) => setEditForm({ ...editForm, pattern: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Brand</label>
                        <select
                          value={editForm.brand || 'Generic'}
                          onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                        >
                          {brandsList.map(brnd => <option key={brnd} value={brnd}>{brnd}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Style</label>
                        <select
                          value={editForm.style}
                          onChange={(e) => setEditForm({ ...editForm, style: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                        >
                          {stylesList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Season</label>
                        <select
                          value={editForm.season}
                          onChange={(e) => setEditForm({ ...editForm, season: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                        >
                          {seasonsList.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Target Gender</label>
                        <select
                          value={editForm.gender || 'unisex'}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500 capitalize"
                        >
                          <option value="unisex">Unisex</option>
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Tags (separated by comma)</label>
                      <input
                        type="text"
                        value={editForm.tags}
                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
