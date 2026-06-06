import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Sparkle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetName, setResetName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result && !result.success) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail || !resetName || !resetNewPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (resetNewPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail,
        name: resetName,
        newPassword: resetNewPassword,
      });

      if (res.data.success) {
        setSuccessMessage(res.data.message);
        setResetEmail('');
        setResetName('');
        setResetNewPassword('');
        
        setTimeout(() => {
          setShowResetForm(false);
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-2 font-bold text-3xl text-indigo-400">
          <Sparkle className="w-8 h-8 text-indigo-400 fill-indigo-400/20 animate-pulse-slow" />
          <span>Wardrobe<span className="text-purple-400">IQ</span></span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          {!showResetForm ? 'Sign in to your account' : 'Reset your password'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          {!showResetForm ? (
            <>
              Or{' '}
              <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                create a new style profile
              </Link>
            </>
          ) : (
            <span>Recover account credentials instantly</span>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-950/40 backdrop-blur-md py-8 px-6 border border-slate-800/80 shadow-2xl rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl p-4 flex items-start gap-3 text-sm">
              <Sparkle className="w-5 h-5 shrink-0 animate-pulse" />
              <span>{successMessage}</span>
            </div>
          )}

          {!showResetForm ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-slate-900/80 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="mt-1.5 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-slate-900/80 pl-4 pr-10 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <span
                    onClick={() => { setShowResetForm(true); setError(''); setSuccessMessage(''); }}
                    className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="mt-1.5">
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-slate-900/80 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reset-name" className="block text-sm font-medium text-slate-300">
                  Account Full Name
                </label>
                <div className="mt-1.5">
                  <input
                    id="reset-name"
                    type="text"
                    required
                    value={resetName}
                    onChange={(e) => setResetName(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-slate-900/80 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="Omkar"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reset-new-password" className="block text-sm font-medium text-slate-300">
                  New Password (min. 6 characters)
                </label>
                <div className="mt-1.5 relative">
                  <input
                    id="reset-new-password"
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="block w-full rounded-2xl border-0 bg-slate-900/80 pl-4 pr-10 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 focus:outline-none"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 transition duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setShowResetForm(false); setError(''); setSuccessMessage(''); }}
                  className="text-sm font-medium text-slate-450 hover:text-slate-300 text-center transition-colors py-2"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
