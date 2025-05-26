import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Cabin } from '../../types';

interface CabinCardProps {
  cabin: Cabin;
  isAdmin?: boolean;
  onEdit?: (cabin: Cabin) => void;
  onDelete?: (cabin: Cabin) => void;
}

const CabinCard: React.FC<CabinCardProps> = ({ cabin, isAdmin, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(cabin);
      setShowConfirmDelete(false);
    }
  };

  // Get the main image (first image) or fallback
  const mainImage = cabin.images && cabin.images.length > 0 
    ? cabin.images[0] 
    : 'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {/* Main Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={mainImage}
            alt={cabin.name}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageError ? 'hidden' : ''
            }`}
          />
          {imageError && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/90 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          ${cabin.price}/night
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
          {cabin.category.charAt(0).toUpperCase() + cabin.category.slice(1)}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{cabin.name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <Users className="h-5 w-5 mr-1" />
          <span>Up to {cabin.capacity} guests</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{cabin.description}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities:</h4>
          <div className="flex flex-wrap gap-y-1">
            {cabin.amenities?.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 mr-3">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span>{amenity.name}</span>
              </div>
            ))}
            {cabin.amenities && cabin.amenities.length > 3 && (
              <div className="text-sm text-green-700">+{cabin.amenities.length - 3} more</div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-1">
          {isAdmin ? (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(cabin)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          ) : (
            <Link 
              to={`/cabins/${cabin.id}`}
              className="text-green-700 hover:text-green-900 font-medium transition-colors"
            >
              View Details
            </Link>
          )}
          <Link 
            to={`/reservations/new?cabinId=${cabin.id}`}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Delete Confirmation Modal */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {cabin.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CabinCard;