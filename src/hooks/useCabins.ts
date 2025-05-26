import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Cabin = Database['public']['Tables']['cabins']['Row'] & {
  amenities: (Database['public']['Tables']['cabin_amenities']['Row'] & {
    category: Database['public']['Tables']['cabin_amenity_categories']['Row']
  })[];
  policies: Database['public']['Tables']['cabin_policies']['Row'][];
  images: Database['public']['Tables']['cabin_images']['Row'][];
  availability: Database['public']['Tables']['cabin_availability']['Row'][];
};

export function useCabins() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCabins = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: cabinsData, error: cabinsError } = await supabase
        .from('cabins')
        .select(`
          *,
          amenities:cabin_amenities(
            *,
            category:cabin_amenity_categories(*)
          ),
          policies:cabin_policies(*),
          images:cabin_images(*),
          availability:cabin_availability(*)
        `)
        .order('created_at', { ascending: false });

      if (cabinsError) throw cabinsError;
      setCabins(cabinsData as Cabin[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCabin = async (
    cabin: Database['public']['Tables']['cabins']['Insert'],
    amenities: { categoryId: string | null; name: string; details?: any }[],
    policies: { type: string; description: string }[],
    images: string[]
  ) => {
    try {
      setError(null);

      // Insert cabin
      const { data: cabinData, error: cabinError } = await supabase
        .from('cabins')
        .insert(cabin)
        .select()
        .single();

      if (cabinError) throw cabinError;

      // Insert amenities
      if (amenities.length > 0) {
        const { error: amenitiesError } = await supabase
          .from('cabin_amenities')
          .insert(
            amenities.map(({ categoryId, name, details }) => ({
              cabin_id: cabinData.id,
              category_id: categoryId,
              name,
              details: details || {}
            }))
          );

        if (amenitiesError) throw amenitiesError;
      }

      // Insert policies
      if (policies.length > 0) {
        const { error: policiesError } = await supabase
          .from('cabin_policies')
          .insert(
            policies.map(policy => ({
              cabin_id: cabinData.id,
              policy_type: policy.type,
              description: policy.description
            }))
          );

        if (policiesError) throw policiesError;
      }

      // Insert images
      if (images.length > 0) {
        const { error: imagesError } = await supabase
          .from('cabin_images')
          .insert(
            images.map((url, index) => ({
              cabin_id: cabinData.id,
              url,
              position: index
            }))
          );

        if (imagesError) throw imagesError;
      }

      await fetchCabins();
      return cabinData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateCabin = async (
    id: string,
    updates: Database['public']['Tables']['cabins']['Update'],
    amenities?: { categoryId: string | null; name: string; details?: any }[],
    policies?: { type: string; description: string }[],
    images?: string[]
  ) => {
    try {
      setError(null);

      // Update cabin
      const { error: cabinError } = await supabase
        .from('cabins')
        .update(updates)
        .eq('id', id);

      if (cabinError) throw cabinError;

      // Update amenities if provided
      if (amenities) {
        // Delete existing amenities
        await supabase
          .from('cabin_amenities')
          .delete()
          .eq('cabin_id', id);

        // Insert new amenities
        if (amenities.length > 0) {
          const { error: amenitiesError } = await supabase
            .from('cabin_amenities')
            .insert(
              amenities.map(({ categoryId, name, details }) => ({
                cabin_id: id,
                category_id: categoryId,
                name,
                details: details || {}
              }))
            );

          if (amenitiesError) throw amenitiesError;
        }
      }

      // Update policies if provided
      if (policies) {
        // Delete existing policies
        await supabase
          .from('cabin_policies')
          .delete()
          .eq('cabin_id', id);

        // Insert new policies
        if (policies.length > 0) {
          const { error: policiesError } = await supabase
            .from('cabin_policies')
            .insert(
              policies.map(policy => ({
                cabin_id: id,
                policy_type: policy.type,
                description: policy.description
              }))
            );

          if (policiesError) throw policiesError;
        }
      }

      // Update images if provided
      if (images) {
        // Delete existing images
        await supabase
          .from('cabin_images')
          .delete()
          .eq('cabin_id', id);

        // Insert new images
        if (images.length > 0) {
          const { error: imagesError } = await supabase
            .from('cabin_images')
            .insert(
              images.map((url, index) => ({
                cabin_id: id,
                url,
                position: index
              }))
            );

          if (imagesError) throw imagesError;
        }
      }

      await fetchCabins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteCabin = async (id: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCabins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  return {
    cabins,
    loading,
    error,
    createCabin,
    updateCabin,
    deleteCabin,
    refetch: fetchCabins
  };
}