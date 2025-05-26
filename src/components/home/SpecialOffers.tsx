import React from 'react';
import { specialOffers } from '../../data/specialOffers';
import SpecialOfferCard from '../cards/SpecialOfferCard';

const SpecialOffers: React.FC = () => {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Take advantage of our limited-time deals and seasonal promotions for an even more affordable getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialOffers.map((offer) => (
            <SpecialOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;