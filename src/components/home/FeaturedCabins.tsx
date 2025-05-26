import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cabins } from '../../data/cabins';
import CabinCard from '../cards/CabinCard';

const FeaturedCabins: React.FC = () => {
  // Get 3 featured cabins
  const featuredCabins = cabins.slice(0, 3);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Cabins</h2>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              Discover our most popular accommodations, each offering a unique blend of comfort and natural beauty.
            </p>
          </div>
          <Link
            to="/cabins"
            className="mt-4 md:mt-0 text-green-700 hover:text-green-800 font-medium flex items-center group"
          >
            View all cabins
            <ArrowRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCabins.map((cabin) => (
            <CabinCard key={cabin.id} cabin={cabin} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCabins;