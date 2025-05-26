import React, { useState } from 'react';
import { Plus, Loader, AlertTriangle } from 'lucide-react';
import { useCabins } from '../../hooks/useCabins';
import CabinForm from '../../components/admin/CabinForm';
import type { Database } from '../../types/database';

type Cabin = Database['public']['Tables']['cabins']['Row'] & {
  amenities: Database['public']['Tables']['cabin_amenities']['Row'][];
  images: Database['public']['Tables']['cabin_images']['Row'][];
};

const AdminCabinsPage: React.FC = () => {
  const { cabins, loading, error, createCabin, updateCabin, deleteCabin } = useCabins();
  const [showForm, setShowForm] = useState(false);
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = async (
    cabin: Database['public']['Tables']['cabins']['Insert'],
    amenities: string[],
    images: string[]
  ) => {
    await createCabin(cabin, amenities, images);
    setShowForm(false);
  };

  const handleUpdate = async (
    cabin: Database['public']['Tables']['cabins']['Update'],
    amenities: string[],
    images: string[]
  ) => {
    if (editingCabin) {
      await updateCabin(editingCabin.id, cabin, amenities, images);
      setEditingCabin(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCabin(id);
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
          <h3 className="text-lg font-medium text-gray-900">Error loading cabins</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Cabins</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Cabin
        </button>
      </div>

      {/* Cabin Form Modal */}
      {(showForm || editingCabin) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingCabin ? 'Edit Cabin' : 'Add New Cabin'}
            </h2>
            <CabinForm
              onSubmit={editingCabin ? handleUpdate : handleCreate}
              initialData={editingCabin ? {
                cabin: editingCabin,
                amenities: editingCabin.amenities,
                images: editingCabin.images
              } : undefined}
              onCancel={() => {
                setShowForm(false);
                setEditingCabin(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Cabins List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {cabins.map(cabin => (
            <li key={cabin.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {cabin.images[0] && (
                      <img
                        src={cabin.images[0].url}
                        alt={cabin.name}
                        className="h-16 w-16 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {cabin.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {cabin.category} • {cabin.capacity} guests • ${cabin.price}/night
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingCabin(cabin)}
                      className="text-sm font-medium text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cabin.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this cabin? This action cannot be undone.
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

export default AdminCabinsPage;