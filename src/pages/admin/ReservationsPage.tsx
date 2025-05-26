import React, { useState } from 'react';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { reservations } from '../../data/reservations';
import { cabins } from '../../data/cabins';

const AdminReservationsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  // Filter reservations based on status
  const filteredReservations = filterStatus === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  // Get cabin name by ID
  const getCabinName = (cabinId: string) => {
    const cabin = cabins.find(c => c.id === cabinId);
    return cabin ? cabin.name : 'Unknown cabin';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterStatus === status ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {getCabinName(reservation.cabinId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(reservation.startDate).toLocaleDateString()} -{' '}
                    {new Date(reservation.endDate).toLocaleDateString()}
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
                      className="text-green-600 hover:text-green-900"
                      title="Confirm"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      title="Cancel"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      title="Message"
                    >
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
  );
};

export default AdminReservationsPage;