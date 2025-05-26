import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { Clock, Calendar, CreditCard, AlertCircle } from 'lucide-react';

const BookingPolicyPage: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Booking Policy" 
        subtitle="Everything you need to know about making a reservation"
        backgroundImage="https://images.pexels.com/photos/6271625/pexels-photo-6271625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <div className="prose prose-green max-w-none mb-12">
            <p className="text-lg text-gray-600">
              To ensure a smooth and enjoyable experience for all our guests, please review our booking policies before making a reservation. These policies help us maintain the quality of service and fairness for everyone.
            </p>
          </div>
          
          {/* Key Points */}
          <div className="grid gap-8 mb-12">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Check-in and Check-out Times</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>Check-in time: 3:00 PM - 8:00 PM</li>
                  <li>Check-out time: 11:00 AM</li>
                  <li>Early check-in and late check-out may be available upon request (additional fees may apply)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Reservation Requirements</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>Minimum stay: 2 nights (3 nights during peak season)</li>
                  <li>Maximum stay: 14 nights</li>
                  <li>Reservations must be made at least 48 hours in advance</li>
                  <li>Peak season bookings require minimum 7 days advance notice</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Policy</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>50% deposit required at time of booking</li>
                  <li>Full payment required 14 days before check-in</li>
                  <li>Security deposit: $200 (refundable)</li>
                  <li>Accepted payment methods: Credit cards, debit cards</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-green-700" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Important Notes</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  <li>Valid ID required at check-in</li>
                  <li>Primary guest must be at least 21 years old</li>
                  <li>Quiet hours: 10:00 PM - 7:00 AM</li>
                  <li>No smoking inside cabins</li>
                  <li>Pets allowed in designated cabins only (additional fee applies)</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Group Bookings:</strong> Special rates and policies apply for groups of 3 or more cabins. Please contact our reservations team directly.
              </p>
              <p>
                <strong>Special Events:</strong> If you're planning a special event during your stay, please inform us in advance. Additional fees and deposits may apply.
              </p>
              <p>
                <strong>Accessibility:</strong> Please let us know if you have any specific accessibility requirements, and we'll do our best to accommodate your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPolicyPage;