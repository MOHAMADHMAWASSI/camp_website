import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { activities } from '../../data/activities';
import ActivityCard from '../cards/ActivityCard';

const PopularActivities: React.FC = () => {
  // Get 4 popular activities
  const popularActivities = activities.slice(0, 4);

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Activities</h2>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl">
              Explore exciting adventures for all ages and experience levels, led by our expert guides.
            </p>
          </div>
          <Link
            to="/activities"
            className="mt-4 md:mt-0 text-green-700 hover:text-green-800 font-medium flex items-center group"
          >
            View all activities
            <ArrowRight className="ml-1 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularActivities;