import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlockedDate {
  id: string;
  cabin_id: string | null;
  start_date: string;
  end_date: string;
  reason: string;
  type: 'maintenance' | 'renovation' | 'private';
  notes: string;
}

const MaintenancePage: React.FC = () => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cabin_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    type: 'maintenance' as const,
    notes: ''
  });

  // Fetch blocked dates
  const fetchBlockedDates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('cabin_blocked_dates')
        .select('*, cabins(name)')
        .order('start_date', { ascending: true });

      if (fetchError) throw fetchError;
      setBlockedDates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blocked dates');
    } finally {
      setLoading(false);
    }
  };

  // Create blocked date
  const createBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      const { error: createError } = await supabase
        .from('cabin_blocked_dates')
        .insert([formData]);

      if (createError) throw createError;

      setShowForm(false);
      setFormData({
        cabin_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        type: 'maintenance',
        notes: ''
      });
      fetchBlockedDates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blocked date');
    }
  };

  React.useEffect(() => {
    fetchBlockedDates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Block New Dates
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Block Dates Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Block New Dates
            </h3>
            <form onSubmit={createBlockedDate} className="space-y-4">
              <div>
                <label htmlFor="cabin_id" className="block text-sm font-medium text-gray-700">
                  Cabin (Optional)
                </label>
                <select
                  id="cabin_id"
                  value={formData.cabin_id}
                  onChange={(e) => setFormData({ ...formData, cabin_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="">All Cabins</option>
                  {/* Add cabin options here */}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    min={formData.start_date}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'maintenance' | 'renovation' | 'private' })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="renovation">Renovation</option>
                  <option value="private">Private Event</option>
                </select>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <input
                  type="text"
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Block Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Add calendar component here */}
          <div className="space-y-4">
            {blockedDates.map((block) => (
              <div
                key={block.id}
                className={`p-4 rounded-lg border ${
                  block.type === 'maintenance' ? 'bg-yellow-50 border-yellow-200' :
                  block.type === 'renovation' ? 'bg-blue-50 border-blue-200' :
                  'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className={`h-5 w-5 mr-2 ${
                      block.type === 'maintenance' ? 'text-yellow-600' :
                      block.type === 'renovation' ? 'text-blue-600' :
                      'text-purple-600'
                    }`} />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{block.reason}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(block.start_date).toLocaleDateString()} - {new Date(block.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    block.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    block.type === 'renovation' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                  </span>
                </div>
                {block.notes && (
                  <p className="mt-2 text-sm text-gray-600">{block.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;