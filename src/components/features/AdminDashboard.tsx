import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, Activity, MessageSquare, CheckCircle, XCircle, Clock, Edit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { cabins } from '../../data/cabins';
import { reservations } from '../../data/reservations';
import { activities } from '../../data/activities';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'cabins' | 'activities'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/signin');
    }
  }, [user, navigate]);

  // If not authenticated or not admin, don't render the dashboard
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
          <p className="mt-2 text-sm text-gray-500">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }
  
  // Calculate summary stats
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;
  const totalRevenue = reservations.filter(r => r.status === 'confirmed')
    .reduce((sum, reservation) => sum + reservation.totalPrice, 0);

  // Filter reservations based on status
  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  // Get cabin name by ID
  const getCabinName = (cabinId: string) => {
    const cabin = cabins.find(c => c.id === cabinId);
    return cabin ? cabin.name : 'Unknown cabin';
  };

  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle admin actions
  const handleAddCabin = () => {
    console.log('Add new cabin');
    // Implement cabin creation logic
  };

  const handleEditCabin = (cabinId: string) => {
    console.log('Edit cabin:', cabinId);
    // Implement cabin editing logic
  };

  const handleDeleteCabin = (cabinId: string) => {
    console.log('Delete cabin:', cabinId);
    // Implement cabin deletion logic
  };

  const handleAddActivity = () => {
    console.log('Add new activity');
    // Implement activity creation logic
  };

  const handleEditActivity = (activityId: string) => {
    console.log('Edit activity:', activityId);
    // Implement activity editing logic
  };

  const handleDeleteActivity = (activityId: string) => {
    console.log('Delete activity:', activityId);
    // Implement activity deletion logic
  };

  const handleConfirmReservation = (reservationId: string) => {
    console.log('Confirm reservation:', reservationId);
    // Implement reservation confirmation logic
  };

  const handleCancelReservation = (reservationId: string) => {
    console.log('Cancel reservation:', reservationId);
    // Implement reservation cancellation logic
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-green-800 text-white p-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-green-100">Manage your camping site with ease</p>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="bg-green-700 text-white">
        <div className="flex">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'bg-white text-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'reservations' ? 'bg-white text-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('reservations')}
          >
            Reservations
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'cabins' ? 'bg-white text-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('cabins')}
          >
            Cabins
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'activities' ? 'bg-white text-green-800' : 'hover:bg-green-600'}`}
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Dashboard Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Stats Cards */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Reservations</p>
                    <p className="text-2xl font-bold text-gray-800">{totalReservations}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">${totalRevenue}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center">
                  <div className="rounded-full bg-amber-100 p-3 mr-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-600 font-medium">Pending Reservations</p>
                    <p className="text-2xl font-bold text-gray-800">{pendingReservations}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Confirmed Bookings</p>
                    <p className="text-2xl font-bold text-gray-800">{confirmedReservations}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Reservations */}
            <h4 className="text-lg font-medium text-gray-800 mb-3">Recent Reservations</h4>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cabin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.slice(0, 5).map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getCabinName(reservation.cabinId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.guests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${reservation.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Confirm"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900" title="Message">
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Cabins Tab */}
        {activeTab === 'cabins' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Cabin Management</h3>
              <button 
                onClick={handleAddCabin}
                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Cabin
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cabins.map((cabin) => (
                <div key={cabin.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img src={cabin.images[0]} alt={cabin.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800">{cabin.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Capacity: {cabin.capacity} guests</p>
                    <p className="text-sm text-gray-600 mb-3">Price: ${cabin.price}/night</p>
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditCabin(cabin.id)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCabin(cabin.id)}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Activity Management</h3>
              <button 
                onClick={handleAddActivity}
                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Activity
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Season
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Activity className="h-5 w-5 text-green-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          activity.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.price ? `$${activity.price}` : 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.season.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditActivity(activity.id)}
                            className="flex items-center text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="flex items-center text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;