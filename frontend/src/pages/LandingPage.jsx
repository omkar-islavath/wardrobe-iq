import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, Sparkles, Calendar, ShoppingBag, Luggage, ShieldCheck, ArrowRight, Camera } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between border-b border-slate-800/50 relative z-10">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-indigo-400">
          <Sparkle className="w-7 h-7 text-indigo-400 fill-indigo-400/30 animate-pulse-slow" />
          <span>Wardrobe<span className="text-purple-400">IQ</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4.5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 pt-20 pb-24 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen MERN + Gemini AI Fashion Suite</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
          Maximize the Value of the Clothes You Already Own
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Digitize your wardrobe, get instant AI clothing tagging, and receive personalized outfit scoring optimized for occasion, weather, and freshness.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition duration-300 group"
          >
            <span>Start Organizing Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold transition"
          >
            See Dashboard Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-28 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-slate-200">
            Powered by Deep Wardrobe Intelligence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="glass-card p-6 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-5">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Facial Feature Recognition</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Analyze your face shape and skin tone from a selfie to generate a custom style profile and color compatibility advice.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Occasion & Weather Rules</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Algorithmically generates matching outfits using color wheels, forecast criteria, style profile matches, and wearing history.
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 mb-5">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Shopping & Gap Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Identifies missing wardrobe essentials and helps you shop intelligently by answering queries like "shirt under ₹1500".
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5">
                <Luggage className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Smart Packing Assistant</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter your trip destination and duration to generate checklist calendars and weather-aligned daily clothing schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800/40 py-8 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 WardrobeIQ. Built by Omkar and Anurag.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
