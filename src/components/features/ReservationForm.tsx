import React, { useState } from 'react';
import { Calendar, Users, CalendarDays, Clipboard, ArrowRight } from 'lucide-react';
import { Cabin, Activity } from '../../types';
import { activities } from '../../data/activities';

interface ReservationFormProps {
  cabin: Cabin;
  onSubmit: (formData: any) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ cabin, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    activities: [] as string[],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    // Calculate nights
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate cabin cost
    const cabinCost = cabin.price * nights;
    
    // Calculate activities cost
    const activitiesCost = formData.activities.reduce((total, activityId) => {
      const activity = activities.find(a => a.id === activityId);
      return total + (activity?.price || 0);
    }, 0);
    
    return cabinCost + activitiesCost;
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle activity checkbox changes
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, activities: [...formData.activities, value] });
    } else {
      setFormData({
        ...formData,
        activities: formData.activities.filter(activity => activity !== value)
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If we're on the last step, submit the form
    if (currentStep === 3) {
      onSubmit({
        ...formData,
        cabinId: cabin.id,
        totalPrice: calculateTotalPrice()
      });
    } else {
      // Otherwise, move to the next step
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle going back to the previous step
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reserve {cabin.name}</h2>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className={`ml-2 text-sm font-medium ${
            currentStep >= 1 ? 'text-green-700' : 'text-gray-500'
          }`}>
            Dates
          </div>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${
          currentStep >= 2 ? 'bg-green-700' : 'bg-gray-200'
        }`}></div>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <Clipboard className="w-4 h-4" />
          </div>
          <div className={`ml-2 text-sm font-medium ${
            currentStep >= 2 ? 'text-green-700' : 'text-gray-500'
          }`}>
            Activities
          </div>
        </div>
        <div className={`flex-1 h-0.5 mx-4 ${
          currentStep >= 3 ? 'bg-green-700' : 'bg-gray-200'
        }`}></div>
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 3 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            <Users className="w-4 h-4" />
          </div>
          <div className={`ml-2 text-sm font-medium ${
            currentStep >= 3 ? 'text-green-700' : 'text-gray-500'
          }`}>
            Details
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Dates & Guests */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    min={today}
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    min={formData.checkIn || today}
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  {Array.from({ length: cabin.capacity }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Maximum capacity: {cabin.capacity} guests
              </p>
            </div>
          </div>
        )}
        
        {/* Step 2: Activities */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Add Activities to Your Stay</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enhance your experience with these popular activities. Select any that interest you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-400 transition-colors">
                  <input
                    type="checkbox"
                    id={`activity-${activity.id}`}
                    name="activities"
                    value={activity.id}
                    checked={formData.activities.includes(activity.id)}
                    onChange={handleActivityChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <label htmlFor={`activity-${activity.id}`} className="block text-sm font-medium text-gray-700">
                      {activity.name} {activity.price ? `($${activity.price})` : '(Free)'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.description.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 3: Personal Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              ></textarea>
            </div>
            
            {/* Booking Summary */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cabin:</span>
                  <span className="font-medium">{cabin.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates:</span>
                  <span className="font-medium">
                    {formData.checkIn} to {formData.checkOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activities:</span>
                  <span className="font-medium">
                    {formData.activities.length === 0 
                      ? 'None' 
                      : formData.activities.length === 1 
                        ? '1 activity' 
                        : `${formData.activities.length} activities`}
                  </span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {currentStep < 3 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Complete Reservation'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;