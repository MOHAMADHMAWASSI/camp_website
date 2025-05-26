import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PricingRule {
  id: string;
  name: string;
  type: 'season' | 'day' | 'occupancy';
  condition: any;
  adjustment: number;
  adjustment_type: 'percentage' | 'fixed';
  priority: number;
  active: boolean;
}

const PricingPage: React.FC = () => {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'season' as const,
    condition: {},
    adjustment: 0,
    adjustment_type: 'percentage' as const,
    priority: 0
  });

  // Fetch pricing rules
  const fetchRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('priority', { ascending: true });

      if (fetchError) throw fetchError;
      setRules(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pricing rules');
    } finally {
      setLoading(false);
    }
  };

  // Create rule
  const createRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      const { error: createError } = await supabase
        .from('pricing_rules')
        .insert([formData]);

      if (createError) throw createError;

      setShowForm(false);
      setFormData({
        name: '',
        type: 'season',
        condition: {},
        adjustment: 0,
        adjustment_type: 'percentage',
        priority: 0
      });
      fetchRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
    }
  };

  React.useEffect(() => {
    fetchRules();
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
        <h2 className="text-2xl font-bold text-gray-900">Dynamic Pricing Rules</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Rule
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Rule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Pricing Rule
            </h3>
            <form onSubmit={createRule} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Rule Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Rule Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'season' | 'day' | 'occupancy' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="season">Seasonal</option>
                  <option value="day">Day of Week</option>
                  <option value="occupancy">Occupancy Based</option>
                </select>
              </div>

              {/* Condition Builder */}
              {formData.type === 'season' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Season Dates
                  </label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="date"
                      onChange={(e) => setFormData({
                        ...formData,
                        condition: {
                          ...formData.condition,
                          start_date: e.target.value
                        }
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <input
                      type="date"
                      onChange={(e) => setFormData({
                        ...formData,
                        condition: {
                          ...formData.condition,
                          end_date: e.target.value
                        }
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              {formData.type === 'day' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Days of Week
                  </label>
                  <div className="mt-1 space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <label key={day} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          onChange={(e) => setFormData({
                            ...formData,
                            condition: {
                              ...formData.condition,
                              [day.toLowerCase()]: e.target.checked
                            }
                          })}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {formData.type === 'occupancy' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Occupancy Range
                  </label>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <input
                      type="number"
                      placeholder="Min guests"
                      onChange={(e) => setFormData({
                        ...formData,
                        condition: {
                          ...formData.condition,
                          min_guests: parseInt(e.target.value)
                        }
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max guests"
                      onChange={(e) => setFormData({
                        ...formData,
                        condition: {
                          ...formData.condition,
                          max_guests: parseInt(e.target.value)
                        }
                      })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700">
                    Adjustment
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {formData.adjustment_type === 'percentage' ? '%' : '$'}
                      </span>
                    </div>
                    <input
                      type="number"
                      id="adjustment"
                      value={formData.adjustment}
                      onChange={(e) => setFormData({ ...formData, adjustment: parseFloat(e.target.value) })}
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="adjustment_type" className="block text-sm font-medium text-gray-700">
                    Adjustment Type
                  </label>
                  <select
                    id="adjustment_type"
                    value={formData.adjustment_type}
                    onChange={(e) => setFormData({ ...formData, adjustment_type: e.target.value as 'percentage' | 'fixed' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <input
                  type="number"
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Higher priority rules are applied first (0 is lowest priority)
                </p>
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
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rule Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adjustment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                  <div className="text-sm text-gray-500">
                    {rule.type === 'season' && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(rule.condition.start_date).toLocaleDateString()} -{' '}
                        {new Date(rule.condition.end_date).toLocaleDateString()}
                      </div>
                    )}
                    {rule.type === 'day' && (
                      <div>
                        {Object.entries(rule.condition)
                          .filter(([_, value]) => value)
                          .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                          .join(', ')}
                      </div>
                    )}
                    {rule.type === 'occupancy' && (
                      <div>
                        {rule.condition.min_guests} - {rule.condition.max_guests} guests
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rule.type === 'season' ? 'bg-blue-100 text-blue-800' :
                    rule.type === 'day' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {rule.adjustment_type === 'percentage' ? (
                      <span>{rule.adjustment}%</span>
                    ) : (
                      <span>${rule.adjustment}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {rule.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingPage;