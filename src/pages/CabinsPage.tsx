import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import CabinCard from '../components/cards/CabinCard';
import CabinFilter from '../components/features/CabinFilter';
import { cabins } from '../data/cabins';
import { Cabin } from '../types';
import { testCredentials } from '../data/users';

const CabinsPage: React.FC = () => {
  // Get unique cabin categories
  const categories = Array.from(new Set(cabins.map(cabin => cabin.category)));
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([1, 12]);
  const [filteredCabins, setFilteredCabins] = useState<Cabin[]>(cabins);
  
  // Check if user is admin (simplified for demo)
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // In a real app, this would check the authenticated user's role
    const checkAdmin = () => {
      const userEmail = localStorage.getItem('userEmail');
      setIsAdmin(userEmail === testCredentials.admin.email);
    };
    checkAdmin();
  }, []);
  
  // Get maximum price and capacity for range inputs
  const maxPrice = Math.max(...cabins.map(cabin => cabin.price));
  const maxCapacity = Math.max(...cabins.map(cabin => cabin.capacity));
  
  // Apply filters
  useEffect(() => {
    let filtered = [...cabins];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cabin => cabin.category === selectedCategory);
    }
    
    // Apply price filter
    filtered = filtered.filter(cabin => 
      cabin.price >= priceRange[0] && cabin.price <= priceRange[1]
    );
    
    // Apply capacity filter
    filtered = filtered.filter(cabin => 
      cabin.capacity >= capacityRange[0] && cabin.capacity <= capacityRange[1]
    );
    
    setFilteredCabins(filtered);
  }, [selectedCategory, priceRange, capacityRange]);

  // Handle edit cabin
  const handleEditCabin = (cabin: Cabin) => {
    console.log('Edit cabin:', cabin);
    // In a real app, this would open an edit form or modal
  };

  // Handle delete cabin
  const handleDeleteCabin = (cabin: Cabin) => {
    console.log('Delete cabin:', cabin);
    // In a real app, this would call an API to delete the cabin
  };

  return (
    <div>
      <PageHeader 
        title="Our Cabins" 
        subtitle="Discover comfortable accommodations nestled in nature"
        backgroundImage="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-1/4">
            <CabinFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              capacityRange={capacityRange}
              onCapacityRangeChange={setCapacityRange}
              maxPrice={maxPrice}
              maxCapacity={maxCapacity}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {filteredCabins.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredCabins.length} {filteredCabins.length === 1 ? 'Cabin' : 'Cabins'} Available
                  </h2>
                  {isAdmin && (
                    <button
                      onClick={() => console.log('Add new cabin')}
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                    >
                      Add New Cabin
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCabins.map((cabin) => (
                    <CabinCard 
                      key={cabin.id} 
                      cabin={cabin}
                      isAdmin={isAdmin}
                      onEdit={handleEditCabin}
                      onDelete={handleDeleteCabin}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium text-gray-800 mb-2">No cabins match your filters</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to find available cabins.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([0, maxPrice]);
                    setCapacityRange([1, maxCapacity]);
                  }}
                  className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinsPage;