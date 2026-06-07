import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await register(name, email, password, gender);
    setSubmitting(false);

    if (result && !result.success) {
      setError(result.error);
    } else {
      navigate('/dashboard');
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
          Create a new style account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            sign in to your existing account
          </Link>
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <div className="mt-1.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-2xl border-0 bg-slate-900/80 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="Omkar"
                />
              </div>
            </div>

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
                Password (min. 6 characters)
              </label>
              <div className="mt-1.5 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Gender Selection
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-2xl text-slate-300 w-full justify-center hover:bg-slate-900/80 transition select-none">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-2xl text-slate-300 w-full justify-center hover:bg-slate-900/80 transition select-none">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-400">
                I agree to the Terms of Service and Privacy Policy
              </label>
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
                    Creating profile...
                  </>
                ) : (
                  'Create Style Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
