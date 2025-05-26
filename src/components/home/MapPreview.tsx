import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import CampMap from '../features/CampMap';

const MapPreview: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Interactive Campsite Map</h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore our campground layout to find the perfect cabin location for your stay. 
              Our interactive map shows all cabins, activity areas, and facilities.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-700" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Strategic Cabin Locations</h3>
                  <p className="mt-1 text-gray-600">
                    Each cabin is thoughtfully placed to provide privacy while maintaining convenient access to amenities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-700" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Activity Zones</h3>
                  <p className="mt-1 text-gray-600">
                    Discover where each activity takes place and plan your adventure-filled itinerary accordingly.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/map"
                className="text-green-700 hover:text-green-800 font-medium flex items-center group"
              >
                Explore full interactive map
                <ArrowRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
          
          <div className="h-[400px] lg:h-auto">
            <CampMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;