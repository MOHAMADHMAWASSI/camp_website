import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
    }, 500);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto">
              <img 
                src="https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Scenic forest view" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent"></div>
            </div>
            
            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-white">Stay Updated with WildScape</h3>
              <p className="mt-4 text-green-100">
                Subscribe to our newsletter for seasonal updates, special offers, and outdoor adventure tips.
              </p>
              
              {submitted ? (
                <div className="mt-6 flex items-center text-white">
                  <Check className="h-6 w-6 mr-2 text-amber-300" />
                  <span>Thank you for subscribing! Check your email soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow">
                      <label htmlFor="email-address" className="sr-only">Email address</label>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:ring-amber-500 focus:border-amber-500 focus:outline-none"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {error && <p className="mt-1 text-amber-300 text-sm">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-900 bg-amber-400 hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Subscribe
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-green-200">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;