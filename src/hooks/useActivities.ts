import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Activity } from '../types';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setActivities(data as Activity[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      setError(null);
      const { data, error: createError } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single();

      if (createError) throw createError;
      await fetchActivities();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateActivity = async (id: string, updates: Partial<Activity>) => {
    try {
      setError(null);
      const { error: updateError } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities
  };
}