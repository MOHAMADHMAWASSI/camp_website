import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tent, Menu, X } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cabins', path: '/cabins' },
  { name: 'Activities', path: '/activities' },
  { name: 'Map', path: '/map' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Jobs', path: '/jobs' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuthContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || isOpen ? 'bg-green-900 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Tent className="h-8 w-8 text-amber-400" />
            <span className="ml-2 text-white font-bold text-xl hidden sm:block">WildScape</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-amber-400'
                    : 'text-white hover:text-amber-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link
                to="/signin"
                className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-900 bg-amber-400 hover:bg-amber-500 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            {!user && (
              <Link
                to="/signin"
                className="mr-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-900 bg-amber-400 hover:bg-amber-500"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-amber-400 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-900">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'text-amber-400 bg-green-800'
                  : 'text-white hover:bg-green-800 hover:text-amber-200'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;