import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { testCredentials } from '../data/users';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load attempts from localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockout = localStorage.getItem('lockoutUntil');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    if (storedLockout) {
      setLockoutUntil(parseInt(storedLockout));
    }
  }, []);

  // Check if user is locked out
  const isLockedOut = () => {
    if (!lockoutUntil) return false;
    const now = Date.now();
    if (now < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - now) / 60000);
      setError(`Too many failed attempts. Please try again in ${minutesLeft} minutes.`);
      return true;
    }
    // Reset lockout if time has passed
    setLockoutUntil(null);
    setLoginAttempts(0);
    localStorage.removeItem('lockoutUntil');
    localStorage.removeItem('loginAttempts');
    return false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null); // Clear error when user types
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if user is locked out
    if (isLockedOut()) return;

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check credentials
      if (formData.email === testCredentials.admin.email && 
          formData.password === testCredentials.admin.password) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');
        navigate('/admin');
        return;
      }

      if (formData.email === testCredentials.client.email && 
          formData.password === testCredentials.client.password) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');
        navigate('/');
        return;
      }

      // Handle failed attempt
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());

      // Check if should lock out
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_TIME;
        setLockoutUntil(lockoutTime);
        localStorage.setItem('lockoutUntil', lockoutTime.toString());
        setError(`Too many failed attempts. Please try again in 15 minutes.`);
      } else {
        // Show specific error based on what's wrong
        const existingUser = [testCredentials.admin, testCredentials.client]
          .find(user => user.email === formData.email);
        
        if (existingUser) {
          setError('Incorrect password');
        } else {
          setError('No account found with this email address');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-2 text-center text-sm text-gray-600">
          <p>
            Test Credentials:
          </p>
          <p className="mt-1">
            Client: {testCredentials.client.email} / {testCredentials.client.password}
          </p>
          <p>
            Admin: {testCredentials.admin.email} / {testCredentials.admin.password}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLockedOut()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;