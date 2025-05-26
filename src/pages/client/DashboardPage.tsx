import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Calendar, User, BookOpen, MapPin, Settings, Bell } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in a real app, this would come from your backend
  const upcomingBookings = [
    {
      id: '1',
      cabinName: 'Pine Haven',
      checkIn: '2024-07-15',
      checkOut: '2024-07-18',
      status: 'confirmed'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      name: 'Kayaking Adventure',
      date: '2024-07-16',
      time: '10:00 AM'
    }
  ];

  const notifications = [
    {
      id: '1',
      message: 'Your upcoming stay at Pine Haven is in 2 weeks',
      date: '2024-07-01',
      type: 'reminder'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your bookings and activities from your personal dashboard
              </p>
            </div>
            <div className="relative">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upcoming Bookings
              </h2>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-green-600 mr-4" />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.cabinName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming bookings</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activities
              </h2>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg"
                    >
                      <MapPin className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {activity.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {activity.date} at {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activities</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h2>
              <nav className="space-y-2">
                <a
                  href="/bookings"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                  View All Bookings
                </a>
                <a
                  href="/activities"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  Browse Activities
                </a>
                <a
                  href="/profile/settings"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5 mr-2 text-gray-400" />
                  Account Settings
                </a>
              </nav>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start p-3 bg-gray-50 rounded-md"
                    >
                      <Bell className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-700">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;