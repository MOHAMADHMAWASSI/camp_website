import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, CheckCircle } from 'lucide-react';
import { cabins } from '../data/cabins';
import { reviews } from '../data/reviews';
import ImageGallery from '../components/features/ImageGallery';
import ReservationForm from '../components/features/ReservationForm';
import ReviewCard from '../components/cards/ReviewCard';

const CabinDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the cabin by ID
  const cabin = cabins.find(cabin => cabin.id === id);
  
  // Find reviews for this cabin
  const cabinReviews = reviews.filter(review => review.cabinId === id);
  
  // Handle reservation form submission
  const handleReservationSubmit = (formData: any) => {
    console.log('Reservation submitted:', formData);
    // Here you would typically send this data to your backend
    alert('Reservation submitted successfully! Check your email for confirmation.');
  };
  
  // If cabin not found
  if (!cabin) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Cabin not found</h1>
              <p className="mt-2 text-base text-gray-500">Sorry, we couldn't find the cabin you're looking for.</p>
              <div className="mt-6">
                <Link to="/cabins" className="text-base font-medium text-green-700 hover:text-green-800">
                  View all cabins<span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4">
          <Link to="/cabins" className="text-green-700 hover:text-green-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all cabins
          </Link>
        </nav>
        
        {/* Cabin header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{cabin.name}</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span>Located in our {cabin.category === 'standard' ? 'Main Camp Area' : 
              cabin.category === 'luxury' ? 'Premium Ridge' : 
              cabin.category === 'family' ? 'Family Village' : 'Group Retreat Section'}</span>
          </div>
        </div>
        
        {/* Image gallery */}
        <div className="mb-12">
          <ImageGallery images={cabin.images} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cabin details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this cabin</h2>
              <p className="text-gray-700 mb-6">{cabin.description}</p>
              
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-green-700 mr-2" />
                <span className="text-lg font-medium">Accommodates up to {cabin.capacity} guests</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 mb-6">
                {cabin.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cabin Policies</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Check-in: 3:00 PM - 8:00 PM</li>
                  <li>Check-out: 11:00 AM</li>
                  <li>No smoking</li>
                  <li>No parties or events</li>
                  <li>Pets allowed (with prior approval and additional fee)</li>
                </ul>
              </div>
            </div>
            
            {/* Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Guest Reviews</h2>
              
              {cabinReviews.length > 0 ? (
                <div className="space-y-4">
                  {cabinReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet for this cabin.</p>
              )}
            </div>
          </div>
          
          {/* Reservation form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReservationForm cabin={cabin} onSubmit={handleReservationSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinDetailPage;