export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// User type for authentication
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    [key: string]: any;
  };
  app_metadata?: {
    [key: string]: any;
  };
  aud: string;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          dietary_preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          dietary_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          dietary_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_ingredients: {
        Row: {
          id: string
          user_id: string
          ingredient_name: string
          quantity: number | null
          unit: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ingredient_name: string
          quantity?: number | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ingredient_name?: string
          quantity?: number | null
          unit?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_recipes: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          recipe_data: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id: string
          recipe_data: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string
          recipe_data?: Json
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dietary_preferences: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      recent_searches: {
        Row: {
          id: string
          user_id: string
          search_query: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_query: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_query?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 