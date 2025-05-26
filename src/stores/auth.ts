import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createClient } from '@supabase/supabase-js';
import type { User, LoginForm, RegisterForm } from '../types/auth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  const login = async (form: LoginForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        user.value = {
          id: data.user.id,
          email: data.user.email!,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: profile.role,
          language: profile.language,
          createdAt: data.user.created_at
        };
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (form: RegisterForm) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
            language: form.language
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          language: form.language,
          role: 'client'
        });

        user.value = {
          id: data.user.id,
          email: data.user.email!,
          firstName: form.firstName,
          lastName: form.lastName,
          role: 'client',
          language: form.language,
          createdAt: data.user.created_at
        };
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout
  };
});