import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, DollarSign, MapPin } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Activity } from '../../types';

interface ActivityCardProps {
  activity: Activity;
  onMapView?: (activity: Activity) => void;
  similarActivities?: Activity[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onMapView, similarActivities }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const IconComponent = (LucideIcons as any)[
    activity.icon.charAt(0).toUpperCase() + activity.icon.slice(1)
  ] || LucideIcons.Compass;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'moderate': return 'text-amber-600';
      case 'challenging': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderSeasonBadges = () => {
    return (
      <div className="flex space-x-1 mt-2">
        {activity.season.map((season) => {
          let bgColor = '';
          switch (season) {
            case 'spring': bgColor = 'bg-green-100 text-green-800'; break;
            case 'summer': bgColor = 'bg-yellow-100 text-yellow-800'; break;
            case 'fall': bgColor = 'bg-orange-100 text-orange-800'; break;
            case 'winter': bgColor = 'bg-blue-100 text-blue-800'; break;
          }
          return (
            <span key={season} className={`text-xs px-2 py-1 rounded-full ${bgColor}`}>
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </span>
          );
        })}
      </div>
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === activity.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <div 
          className="relative h-48 overflow-hidden"
          onMouseEnter={() => nextImage()}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {activity.images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`${activity.name} - Image ${index + 1}`} 
              className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 left-4 bg-white/90 text-green-800 p-2 rounded-full">
          <IconComponent className="h-6 w-6" />
        </div>

        {activity.availableSpots !== undefined && activity.availableSpots < 10 && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {activity.availableSpots === 0 ? 'Fully Booked' : `${activity.availableSpots} spots left`}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
        
        <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-3">
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1 text-green-700" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center mr-4">
            <BarChart className="h-4 w-4 mr-1 text-green-700" />
            <span className={getDifficultyColor(activity.difficulty)}>
              {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-green-700" />
            <span>{activity.price ? `$${activity.price}` : 'Free'}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
        
        {renderSeasonBadges()}
        
        <div className="flex justify-between items-center mt-4 pt-1">
          <button 
            onClick={() => onMapView?.(activity)}
            className="flex items-center text-green-700 hover:text-green-900 font-medium transition-colors"
          >
            <MapPin className="h-4 w-4 mr-1" />
            View on Map
          </button>
          
          <Link 
            to={`/activities/${activity.id}`}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;