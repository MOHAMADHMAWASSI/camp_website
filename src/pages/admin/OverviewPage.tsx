import React from 'react';
import { Calendar, Users, DollarSign, Activity, Clock } from 'lucide-react';
import { reservations } from '../../data/reservations';

const AdminOverviewPage: React.FC = () => {
  // Calculate summary stats
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, reservation) => sum + reservation.totalPrice, 0);

  const stats = [
    {
      name: 'Total Reservations',
      value: totalReservations,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      name: 'Total Revenue',
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600'
    },
    {
      name: 'Pending Reservations',
      value: pendingReservations,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      name: 'Confirmed Bookings',
      value: confirmedReservations,
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`${stat.color} rounded-lg p-4 border`}
            >
              <div className="flex items-center">
                <div className="rounded-full p-3 mr-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.name}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {reservations.slice(0, 5).map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="font-medium text-gray-900">
                    New reservation for Cabin #{reservation.cabinId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(reservation.startDate).toLocaleDateString()} -{' '}
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  reservation.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : reservation.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;