import React from 'react';
import { Users, DollarSign } from 'lucide-react';

interface CabinFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  capacityRange: [number, number];
  onCapacityRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  maxCapacity: number;
}

const CabinFilter: React.FC<CabinFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  capacityRange,
  onCapacityRangeChange,
  maxPrice,
  maxCapacity
}) => {
  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Handle price range input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onPriceRangeChange([priceRange[0], value]);
  };

  // Handle minimum price input change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onPriceRangeChange([value, priceRange[1]]);
  };

  // Handle capacity range input change
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onCapacityRangeChange([capacityRange[0], value]);
  };

  // Handle minimum capacity input change
  const handleMinCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onCapacityRangeChange([value, capacityRange[1]]);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Cabins</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Cabin Type</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {formatCategoryName(category)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Price Range</h3>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{priceRange[0]} - ${priceRange[1]}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label htmlFor="minPrice" className="block text-xs text-gray-500 mb-1">Min Price</label>
            <input
              type="number"
              id="minPrice"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              min={priceRange[0]}
              max={maxPrice}
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
        
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
        />
      </div>
      
      {/* Capacity Filter */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Guest Capacity</h3>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{capacityRange[0]} - {capacityRange[1]} guests</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <label htmlFor="minCapacity" className="block text-xs text-gray-500 mb-1">Min Guests</label>
            <input
              type="number"
              id="minCapacity"
              min="1"
              max={capacityRange[1]}
              value={capacityRange[0]}
              onChange={handleMinCapacityChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label htmlFor="maxCapacity" className="block text-xs text-gray-500 mb-1">Max Guests</label>
            <input
              type="number"
              id="maxCapacity"
              min={capacityRange[0]}
              max={maxCapacity}
              value={capacityRange[1]}
              onChange={handleCapacityChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
        
        <input
          type="range"
          min="1"
          max={maxCapacity}
          value={capacityRange[1]}
          onChange={handleCapacityChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
        />
      </div>
      
      {/* Reset Filters */}
      <button
        onClick={() => {
          onCategoryChange('all');
          onPriceRangeChange([0, maxPrice]);
          onCapacityRangeChange([1, maxCapacity]);
        }}
        className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default CabinFilter;