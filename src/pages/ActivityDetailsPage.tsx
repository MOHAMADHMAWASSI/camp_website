import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BarChart, DollarSign, MapPin, Calendar } from 'lucide-react';
import { activities } from '../data/activities';
import PageHeader from '../components/layout/PageHeader';
import ImageGallery from '../components/features/ImageGallery';

const ActivityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const activity = activities.find(a => a.id === id);

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Activity not found</h2>
          <p className="mt-2 text-gray-600">The activity you're looking for doesn't exist.</p>
          <Link
            to="/activities"
            className="mt-4 inline-block text-green-700 hover:text-green-800 font-medium"
          >
            Back to Activities
          </Link>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-amber-600';
      case 'challenging': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <PageHeader 
        title={activity.name}
        subtitle={`${activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)} difficulty • ${activity.duration}`}
        backgroundImage={activity.images[0]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Activity Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              {/* Key Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-sm font-medium text-gray-500">Duration</div>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-5 w-5 text-green-700 mr-1" />
                    <span className="text-lg">{activity.duration}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Difficulty</div>
                  <div className="mt-1 flex items-center">
                    <BarChart className="h-5 w-5 text-green-700 mr-1" />
                    <span className={`text-lg ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Price</div>
                  <div className="mt-1 flex items-center">
                    <DollarSign className="h-5 w-5 text-green-700 mr-1" />
                    <span className="text-lg">{activity.price ? `$${activity.price}` : 'Free'}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  <div className="mt-1 flex items-center">
                    <MapPin className="h-5 w-5 text-green-700 mr-1" />
                    <span className="text-lg">{activity.location.description}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-green max-w-none mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Activity</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>

              {/* Seasons */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Seasons</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.season.map((season) => {
                    let bgColor = '';
                    switch (season) {
                      case 'spring': bgColor = 'bg-green-100 text-green-800'; break;
                      case 'summer': bgColor = 'bg-yellow-100 text-yellow-800'; break;
                      case 'fall': bgColor = 'bg-orange-100 text-orange-800'; break;
                      case 'winter': bgColor = 'bg-blue-100 text-blue-800'; break;
                    }
                    return (
                      <span key={season} className={`px-3 py-1 rounded-full text-sm font-medium ${bgColor}`}>
                        {season.charAt(0).toUpperCase() + season.slice(1)}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Available Dates */}
              {activity.availableDates && activity.availableDates.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Dates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activity.availableDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <Calendar className="h-5 w-5 text-green-700 mr-2" />
                        <span className="text-gray-900">
                          {new Date(date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Photos</h3>
                <ImageGallery images={activity.images} />
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Book?</h3>
            <p className="text-gray-600 mb-6">
              Join us for this exciting adventure! Choose from our available dates and book your spot today.
            </p>
            <button className="w-full sm:w-auto px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium">
              Check Availability & Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsPage;