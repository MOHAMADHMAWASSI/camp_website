import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { Calendar, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const CancellationPolicyPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Cancellation Policy" 
        subtitle="Understanding our cancellation and refund policies"
        backgroundImage="https://images.pexels.com/photos/5472258/pexels-photo-5472258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-green max-w-none mb-12">
            <p className="text-lg text-gray-600">
              We understand that plans can change. Our cancellation policy is designed to be fair and transparent while maintaining the quality of service for all our guests. Please review these policies carefully when making your reservation.
            </p>
          </div>
          
          {/* Cancellation Tiers */}
          <div className="space-y-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Flexible Cancellation (30+ days)</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>Full refund of deposit</li>
                <li>No cancellation fee</li>
                <li>Reservation can be modified for different dates (subject to availability)</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Standard Cancellation (14-29 days)</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>75% refund of deposit</li>
                <li>Reservation can be modified with a $50 change fee</li>
                <li>Credit for future stay available (valid for 12 months)</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Late Cancellation (7-13 days)</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>50% refund of deposit</li>
                <li>Reservation modifications subject to availability and $100 change fee</li>
                <li>Partial credit for future stay may be available</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-red-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Very Late Cancellation (&lt; 7 days)</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li>No refund available</li>
                <li>No modifications allowed</li>
                <li>Travel insurance recommended to protect against unforeseen circumstances</li>
              </ul>
            </div>
          </div>
          
          {/* Special Circumstances */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Circumstances</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Weather Events:</strong> In case of severe weather conditions or natural disasters that make it impossible to reach or stay at our property, we will work with you to reschedule your stay or provide a full refund.
              </p>
              <p>
                <strong>Medical Emergencies:</strong> With proper documentation, we may make exceptions to our standard cancellation policy for serious medical emergencies.
              </p>
              <p>
                <strong>COVID-19 Policy:</strong> Special considerations may apply for COVID-19 related cancellations. Please contact us for the most current policy.
              </p>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Travel Insurance:</strong> We strongly recommend purchasing travel insurance to protect your vacation investment against unexpected events.
              </p>
              <p>
                <strong>Flexible Booking:</strong> If your travel plans are uncertain, consider booking with our flexible rate options which offer more generous cancellation terms.
              </p>
              <p>
                <strong>Communication:</strong> If you need to cancel or modify your reservation, please contact us as soon as possible. Earlier notification gives us more options to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;