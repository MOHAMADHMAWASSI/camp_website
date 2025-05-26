import React, { useState } from 'react';
import { Plus, Edit, Trash2, Activity, Loader, AlertTriangle } from 'lucide-react';
import { useActivities } from '../../hooks/useActivities';
import ActivityForm from '../../components/admin/ActivityForm';
import type { Activity as ActivityType } from '../../types';

const AdminActivitiesPage: React.FC = () => {
  const { activities, loading, error, createActivity, updateActivity, deleteActivity } = useActivities();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = async (activity: Omit<ActivityType, 'id'>) => {
    await createActivity(activity);
    setShowForm(false);
  };

  const handleUpdate = async (activity: Omit<ActivityType, 'id'>) => {
    if (editingActivity) {
      await updateActivity(editingActivity.id, activity);
      setEditingActivity(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteActivity(id);
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Error loading activities</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Activity
        </button>
      </div>

      {/* Activities Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                      <div className="text-sm font-medium text-gray-900">
                        {activity.name}
                      </div>
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
                      onClick={() => setEditingActivity(activity)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(activity.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Form Modal */}
      {(showForm || editingActivity) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <ActivityForm
              onSubmit={editingActivity ? handleUpdate : handleCreate}
              initialData={editingActivity || undefined}
              onCancel={() => {
                setShowForm(false);
                setEditingActivity(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this activity? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivitiesPage;