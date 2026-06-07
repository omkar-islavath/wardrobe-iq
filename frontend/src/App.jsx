import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wardrobe from './pages/Wardrobe';
import UploadClothing from './pages/UploadClothing';
import OutfitGenerator from './pages/OutfitGenerator';
import OutfitHistory from './pages/OutfitHistory';
import StyleProfile from './pages/StyleProfile';
import ShoppingAssistant from './pages/ShoppingAssistant';
import PackingAssistant from './pages/PackingAssistant';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide animate-pulse">Initializing WardrobeIQ...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/landing" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected system routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
            <Route path="/upload-clothing" element={<ProtectedRoute><UploadClothing /></ProtectedRoute>} />
            <Route path="/generate-outfits" element={<ProtectedRoute><OutfitGenerator /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><OutfitHistory /></ProtectedRoute>} />
            <Route path="/style-profile" element={<ProtectedRoute><StyleProfile /></ProtectedRoute>} />
            <Route path="/shopping" element={<ProtectedRoute><ShoppingAssistant /></ProtectedRoute>} />
            <Route path="/packing" element={<ProtectedRoute><PackingAssistant /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
