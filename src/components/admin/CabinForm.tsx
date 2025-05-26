import React, { useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';

type CabinFormProps = {
  onSubmit: (
    cabin: Database['public']['Tables']['cabins']['Insert'],
    amenities: { categoryId: string | null; name: string; details?: any }[],
    policies: { type: string; description: string }[],
    images: string[]
  ) => Promise<void>;
  initialData?: {
    cabin: Database['public']['Tables']['cabins']['Row'];
    amenities: (Database['public']['Tables']['cabin_amenities']['Row'] & {
      category: Database['public']['Tables']['cabin_amenity_categories']['Row']
    })[];
    policies: Database['public']['Tables']['cabin_policies']['Row'][];
    images: Database['public']['Tables']['cabin_images']['Row'][];
  };
  onCancel: () => void;
};

const CabinForm: React.FC<CabinFormProps> = ({
  onSubmit,
  initialData,
  onCancel
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: initialData?.cabin.name || '',
    description: initialData?.cabin.description || '',
    price: initialData?.cabin.price || 0,
    capacity: initialData?.cabin.capacity || 1,
    category: initialData?.cabin.category || 'standard',
    location_x: initialData?.cabin.location_x || null,
    location_y: initialData?.cabin.location_y || null
  });

  const [amenities, setAmenities] = useState<{
    categoryId: string | null;
    name: string;
    details?: any;
  }[]>(
    initialData?.amenities.map(a => ({
      categoryId: a.category?.id || null,
      name: a.name,
      details: a.details
    })) || []
  );

  const [policies, setPolicies] = useState<{ type: string; description: string }[]>(
    initialData?.policies.map(p => ({
      type: p.policy_type,
      description: p.description
    })) || []
  );

  const [images, setImages] = useState<string[]>(
    initialData?.images.map(i => i.url) || []
  );

  const [newAmenity, setNewAmenity] = useState({
    categoryId: '',
    name: '',
    details: {}
  });

  const [newPolicy, setNewPolicy] = useState({
    type: '',
    description: ''
  });

  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verify user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;
      if (profile?.role !== 'admin') {
        throw new Error('Only admins can manage cabins');
      }

      await onSubmit(formData, amenities, policies, images);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addAmenity = () => {
    if (newAmenity.name.trim() && newAmenity.categoryId) {
      setAmenities(prev => [...prev, {
        categoryId: newAmenity.categoryId,
        name: newAmenity.name.trim(),
        details: newAmenity.details
      }]);
      setNewAmenity({ categoryId: '', name: '', details: {} });
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(prev => prev.filter((_, i) => i !== index));
  };

  const addPolicy = () => {
    if (newPolicy.type.trim() && newPolicy.description.trim()) {
      setPolicies(prev => [...prev, {
        type: newPolicy.type.trim(),
        description: newPolicy.description.trim()
      }]);
      setNewPolicy({ type: '', description: '' });
    }
  };

  const removePolicy = (index: number) => {
    setPolicies(prev => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages(prev => [...prev, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // If user is not admin, don't render the form
  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center">
        <p className="text-red-600">Only administrators can manage cabins.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="standard">Standard</option>
              <option value="family">Family</option>
              <option value="luxury">Luxury</option>
              <option value="group">Group</option>
            </select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
        <div className="space-y-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <img
                src={image}
                alt={`Cabin image ${index + 1}`}
                className="h-16 w-16 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="url"
              value={newImage}
              onChange={e => setNewImage(e.target.value)}
              placeholder="Add image URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={addImage}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            'Save Cabin'
          )}
        </button>
      </div>
    </form>
  );
};

export default CabinForm;