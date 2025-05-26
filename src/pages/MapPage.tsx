import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import CampMap from '../components/features/CampMap';

const MapPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Interactive Campsite Map" 
        subtitle="Explore our grounds and plan your perfect stay"
        backgroundImage="https://images.pexels.com/photos/4992432/pexels-photo-4992432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Our Campground</h2>
            <p className="text-gray-600 mb-6">
              Use our interactive map to discover the layout of our campground. Locate cabins, activity areas, 
              facilities, and natural features. Click on any point to see more details and plan your stay 
              more effectively.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-700 rounded-full mr-2"></div>
                  <span className="text-sm">Cabins</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm">Activities</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-300 rounded mr-2"></div>
                  <span className="text-sm">Water</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600/50 rounded mr-2"></div>
                  <span className="text-sm">Forest</span>
                </div>
              </div>
            </div>
          </div>
          
          <CampMap />
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Map Navigation Tips</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Click on any cabin or activity marker to view details</li>
              <li>Cabins are located in different areas to provide various experiences - some offer lakeside views, others forest seclusion</li>
              <li>Activity locations are spread throughout the property to take advantage of natural features</li>
              <li>Main paths connect all areas of the campground for easy navigation</li>
              <li>The central facilities area includes the reception, restaurant, and equipment rental</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;