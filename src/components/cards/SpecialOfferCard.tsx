import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import { SpecialOffer } from '../../types';

interface SpecialOfferCardProps {
  offer: SpecialOffer;
}

const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({ offer }) => {
  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString(undefined, options);
    const end = new Date(endDate).toLocaleDateString(undefined, options);
    return `${start} - ${end}`;
  };

  // Get badge text based on what the offer applies to
  const getOfferTypeBadge = (appliesTo: string) => {
    switch (appliesTo) {
      case 'cabins':
        return 'Cabin Offer';
      case 'activities':
        return 'Activity Offer';
      case 'all':
        return 'Site-wide Offer';
      default:
        return 'Special Offer';
    }
  };

  // Get badge color based on what the offer applies to
  const getOfferTypeBadgeColor = (appliesTo: string) => {
    switch (appliesTo) {
      case 'cabins':
        return 'bg-green-100 text-green-800';
      case 'activities':
        return 'bg-blue-100 text-blue-800';
      case 'all':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-40">
        <img 
          src={offer.image} 
          alt={offer.title} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getOfferTypeBadgeColor(offer.appliesTo)}`}>
            {getOfferTypeBadge(offer.appliesTo)}
          </span>
        </div>
        
        {offer.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {offer.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{offer.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-1 text-green-700" />
          <span>{formatDateRange(offer.validFrom, offer.validTo)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm font-medium text-gray-800">
            <Tag className="h-4 w-4 mr-1 text-green-700" />
            <span>Code: <span className="font-bold">{offer.code}</span></span>
          </div>
          
          <button className="text-green-700 hover:text-green-900 text-sm font-medium transition-colors">
            Apply Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferCard;