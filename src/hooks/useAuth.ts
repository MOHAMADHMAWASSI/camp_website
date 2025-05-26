import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      // First, get the auth user's role from the JWT
      const { data: { role } } = await supabase.auth.getUser();

      // Then fetch the profile with a more specific query
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, role, language, created_at')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
          language: data.language,
          createdAt: data.created_at
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signOut
  };
}