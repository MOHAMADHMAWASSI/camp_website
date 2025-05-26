import React, { useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import type { Activity } from '../../types';

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, 'id'>) => Promise<void>;
  initialData?: Activity;
  onCancel: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  onSubmit,
  initialData,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    difficulty: initialData?.difficulty || 'easy',
    price: initialData?.price || 0,
    images: initialData?.images || [],
    icon: initialData?.icon || 'activity',
    season: initialData?.season || [],
    type: initialData?.type || 'Sport'
  });

  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [durationError, setDurationError] = useState('');

  const validateDuration = (duration: string): boolean => {
    // Valid formats:
    // "X hours", "X hour", "X minutes", "X minute"
    // "X hours Y minutes", "X hour Y minute"
    const durationRegex = /^(\d+\s+(hour|hours|minute|minutes)(\s+\d+\s+(minute|minutes))?)$/;
    return durationRegex.test(duration.toLowerCase());
  };

  const formatDuration = (duration: string): string => {
    // Convert the human-readable duration to Postgres interval format
    const parts = duration.toLowerCase().split(' ');
    let hours = 0;
    let minutes = 0;

    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
      const unit = parts[i + 1];

      if (unit.startsWith('hour')) {
        hours = value;
      } else if (unit.startsWith('minute')) {
        minutes = value;
      }
    }

    return `${hours} hours ${minutes} minutes`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDuration(formData.duration)) {
      setDurationError('Please enter duration in format: "X hours" or "X hours Y minutes"');
      return;
    }

    setLoading(true);
    try {
      const formattedData = {
        ...formData,
        duration: formatDuration(formData.duration)
      };
      await onSubmit(formattedData);
      onCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'duration') {
      setDurationError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeasonChange = (season: string) => {
    setFormData(prev => ({
      ...prev,
      season: prev.season.includes(season)
        ? prev.season.filter(s => s !== season)
        : [...prev.season, season]
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 2 hours or 1 hour 30 minutes"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 ${
              durationError ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {durationError && (
            <p className="mt-1 text-sm text-red-600">{durationError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="Sport">Sport</option>
            <option value="Relaxation">Relaxation</option>
            <option value="Discovery">Discovery</option>
            <option value="Family-Friendly">Family-Friendly</option>
            <option value="Night Adventures">Night Adventures</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seasons
        </label>
        <div className="flex flex-wrap gap-2">
          {['spring', 'summer', 'fall', 'winter'].map(season => (
            <button
              key={season}
              type="button"
              onClick={() => handleSeasonChange(season)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.season.includes(season)
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
              }`}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-2 space-y-2">
          {formData.images.map((image, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <img
                src={image}
                alt={`Activity image ${index + 1}`}
                className="h-12 w-12 object-cover rounded"
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
            'Save Activity'
          )}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;