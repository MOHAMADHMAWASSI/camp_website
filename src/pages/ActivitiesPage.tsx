import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ActivityCard from '../components/cards/ActivityCard';
import CampMap from '../components/features/CampMap';
import { activities } from '../data/activities';
import { Activity } from '../types';
import { Filter, X, Search } from 'lucide-react';

const ActivitiesPage: React.FC = () => {
  // State for filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFreeOnly, setShowFreeOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  
  // Apply filters
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    if (searchQuery && !activity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all' && activity.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Season filter
    if (selectedSeason !== 'all' && !activity.season.includes(selectedSeason as any)) {
      return false;
    }
    
    // Type filter
    if (selectedType !== 'all' && activity.type !== selectedType) {
      return false;
    }
    
    // Price filter
    if (showFreeOnly && activity.price !== null) {
      return false;
    }
    
    return true;
  });
  
  // Find similar activities based on type and difficulty
  const getSimilarActivities = (activity: Activity) => {
    return activities
      .filter(a => 
        a.id !== activity.id && 
        (a.type === activity.type || a.difficulty === activity.difficulty)
      )
      .slice(0, 3);
  };
  
  // Toggle mobile filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedDifficulty('all');
    setSelectedSeason('all');
    setSelectedType('all');
    setShowFreeOnly(false);
    setSearchQuery('');
  };

  // Handle map view
  const handleMapView = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowMap(true);
  };

  return (
    <div>
      <PageHeader 
        title="Outdoor Activities" 
        subtitle="Explore exciting adventures in nature for all skill levels"
        backgroundImage="https://images.pexels.com/photos/1497582/pexels-photo-1497582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Activities</h2>
          <button
            onClick={toggleFilters}
            className="flex items-center bg-green-700 text-white px-4 py-2 rounded-md"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={toggleFilters}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Activity Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Activity Type</h4>
                <div className="space-y-2">
                  {['all', 'Sport', 'Relaxation', 'Discovery', 'Family-Friendly', 'Night Adventures'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                        className="h-4 w-4 text-green-700 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {type === 'all' ? 'All Types' : type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Difficulty Level</h4>
                <div className="space-y-2">
                  {['all', 'easy', 'moderate', 'challenging'].map((difficulty) => (
                    <label key={difficulty} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value={difficulty}
                        checked={selectedDifficulty === difficulty}
                        onChange={() => setSelectedDifficulty(difficulty)}
                        className="h-4 w-4 text-green-700 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {difficulty === 'all' ? 'All Levels' : difficulty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Season Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Season</h4>
                <div className="space-y-2">
                  {['all', 'spring', 'summer', 'fall', 'winter'].map((season) => (
                    <label key={season} className="flex items-center">
                      <input
                        type="radio"
                        name="season"
                        value={season}
                        checked={selectedSeason === season}
                        onChange={() => setSelectedSeason(season)}
                        className="h-4 w-4 text-green-700 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {season === 'all' ? 'All Seasons' : season}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFreeOnly}
                    onChange={() => setShowFreeOnly(!showFreeOnly)}
                    className="h-4 w-4 text-green-700 focus:ring-green-500 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show free activities only
                  </span>
                </label>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Activities Grid */}
          <div className="lg:w-3/4">
            {filteredActivities.length > 0 ? (
              <>
                <div className="hidden lg:flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">All Activities</h2>
                  <div className="text-sm text-gray-600">
                    Showing {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActivities.map((activity) => (
                    <ActivityCard 
                      key={activity.id} 
                      activity={activity}
                      onMapView={handleMapView}
                      similarActivities={getSimilarActivities(activity)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">No activities match your filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find available activities.</p>
                <button
                  onClick={resetFilters}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Map Modal */}
        {showMap && selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedActivity.name} Location</h3>
                <button 
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="h-[60vh]">
                <CampMap />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesPage;