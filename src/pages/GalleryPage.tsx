import React, { useState, useMemo } from 'react';
import PageHeader from '../components/layout/PageHeader';
import ImageGallery from '../components/features/ImageGallery';
import { cabins } from '../data/cabins';
import { activities } from '../data/activities';
import { Search } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine all images with metadata
  const allImages = useMemo(() => [
    ...cabins.flatMap(cabin => cabin.images.map(image => ({
      url: image,
      category: 'cabins',
      title: cabin.name,
      description: `${cabin.category} cabin for up to ${cabin.capacity} guests`
    }))),
    ...activities.flatMap(activity => activity.images.map(image => ({
      url: image,
      category: 'activities',
      title: activity.name,
      description: `${activity.difficulty} difficulty, ${activity.duration}`
    })))
  ], []);
  
  // Filter images based on active category and search query
  const filteredImages = useMemo(() => {
    let filtered = allImages;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(image => image.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(image => 
        image.title.toLowerCase().includes(query) ||
        image.description.toLowerCase().includes(query)
      );
    }
    
    return filtered.map(image => image.url);
  }, [allImages, activeCategory, searchQuery]);

  // Get category counts
  const categoryCounts = useMemo(() => ({
    all: allImages.length,
    cabins: allImages.filter(img => img.category === 'cabins').length,
    activities: allImages.filter(img => img.category === 'activities').length
  }), [allImages]);

  return (
    <div>
      <PageHeader 
        title="Photo Gallery" 
        subtitle="Explore our beautiful campground through pictures"
        backgroundImage="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg shadow-sm">
            {['all', 'cabins', 'activities'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6 py-2.5 text-sm font-medium relative
                  ${category === 'all' ? 'rounded-l-lg' : ''}
                  ${category === 'activities' ? 'rounded-r-lg' : ''}
                  ${activeCategory === category
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                  border border-gray-200
                  focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500
                `}
              >
                <span className="capitalize">{category}</span>
                <span className="ml-2 text-xs opacity-75">
                  ({categoryCounts[category as keyof typeof categoryCounts]})
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Gallery */}
        {filteredImages.length > 0 ? (
          <ImageGallery images={filteredImages} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No images found matching your search criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;