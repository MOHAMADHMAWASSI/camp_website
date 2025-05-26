export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type CabinCategory = 'standard' | 'family' | 'luxury' | 'group';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: 'client' | 'admin'
          language: 'en' | 'fr'
          created_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          role?: 'client' | 'admin'
          language?: 'en' | 'fr'
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: 'client' | 'admin'
          language?: 'en' | 'fr'
          created_at?: string
        }
      }
      cabins: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          capacity: number
          category: CabinCategory
          location_x: number | null
          location_y: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          capacity: number
          category: CabinCategory
          location_x?: number | null
          location_y?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          capacity?: number
          category?: CabinCategory
          location_x?: number | null
          location_y?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      cabin_amenities: {
        Row: {
          id: string
          cabin_id: string
          category_id: string | null
          name: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          cabin_id: string
          category_id?: string | null
          name: string
          details?: Json
        }
        Update: {
          id?: string
          cabin_id?: string
          category_id?: string | null
          name?: string
          details?: Json
        }
      }
      cabin_amenity_categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          created_at?: string
        }
      }
      cabin_policies: {
        Row: {
          id: string
          cabin_id: string
          policy_type: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          cabin_id: string
          policy_type: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          cabin_id?: string
          policy_type?: string
          description?: string
          created_at?: string
        }
      }
      cabin_images: {
        Row: {
          id: string
          cabin_id: string
          url: string
          position: number
        }
        Insert: {
          id?: string
          cabin_id: string
          url: string
          position?: number
        }
        Update: {
          id?: string
          cabin_id?: string
          url?: string
          position?: number
        }
      }
      cabin_availability: {
        Row: {
          id: string
          cabin_id: string
          start_date: string
          end_date: string
          is_available: boolean
        }
        Insert: {
          id?: string
          cabin_id: string
          start_date: string
          end_date: string
          is_available?: boolean
        }
        Update: {
          id?: string
          cabin_id?: string
          start_date?: string
          end_date?: string
          is_available?: boolean
        }
      }
    }
  }
}