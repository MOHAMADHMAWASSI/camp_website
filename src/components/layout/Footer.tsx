import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Tent className="h-8 w-8 text-amber-400" />
              <span className="text-white font-bold text-xl">WildScape Camping</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Experience the beauty of nature with comfort and adventure. Our camping site offers 
              the perfect escape from the hustle of city life.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cabins" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Cabins
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Campsite Map
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Reservations
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/booking-policy" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Booking Policy
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-amber-400 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Forest Road, Mountain Valley, CA 91234</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-gray-300 hover:text-amber-400 transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <a href="mailto:info@wildscapecamping.com" className="text-gray-300 hover:text-amber-400 transition-colors">
                  info@wildscapecamping.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-gray-300 text-sm">
          <p>&copy; {currentYear} WildScape Camping. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;