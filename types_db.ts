export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'customers_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database['public']['Enums']['pricing_plan_interval'] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database['public']['Enums']['pricing_type'] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database['public']['Enums']['pricing_plan_interval']
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database['public']['Enums']['pricing_type'] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database['public']['Enums']['subscription_status'] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database['public']['Enums']['subscription_status'] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_price_id_fkey';
            columns: ['price_id'];
            referencedRelation: 'prices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      states: {
        Row: {
          state_id: string;
          sigla: string | null;
          name: string | null;
        };
        Insert: {
          state_id?: string;
          sigla?: string | null;
          name?: string | null;
        };
        Update: {
          state_id?: string;
          sigla?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      seller_services_tags: {
        Row: {
          id: string;
          name: string | null;
          slug: string | null;
          description: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          slug?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          slug?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          city_id: string;
          name: string | null;
          state_id: string | null;
          states?: {
            sigla?: string | null;
          };
          state?: {
            sigla?: string | null;
          };
        };
        Insert: {
          city_id: string;
          name?: string | null;
          state_id?: string | null;
          states?: {
            sigla?: string | null;
          };
          state?: {
            sigla?: string | null;
          };
        };
        Update: {
          city_id?: string;
          name?: string | null;
          state_id?: string | null;
          states?: {
            sigla?: string | null;
          };
          state?: {
            sigla?: string | null;
          };
        };
        Relationships: [
          {
            foreignKeyName: 'cities_state_id_fkey';
            columns: ['state_id'];
            referencedRelation: 'states';
            referencedColumns: ['id'];
          }
        ];
      };
      sellers: {
        Row: {
          seller_id: string;
          user_id: string;
          name: string | null;
          description: string | null;
          short_description: string | null;
          phone: string | null;
          city_id: string | null;
          state_id: string | null;
          neighborhood: string | null;
          avatar_url: string | null;
          feature_image: string | null;
          gender: string | null;
          hourly_rate?: number | null;
          age?: number | null;
          location_description?: string | null;
          sexual_orientation?: string | null;
          current_weight?: number | null;
          current_height?: number | null;
          ethnicity?: string | null;
          hair_color?: string | null;
          hair_length?: string | null;
          shoe_size?: number | null;
          has_silicone?: boolean | null;
          has_tattoos?: boolean | null;
          has_piercings?: boolean | null;
          payment_methods?: string[] | null;
          featured_image_url?: string | null;
          service_location?: string | null;
          address_details?: string | null;
          service_tags?: string[];
          media?: Database['public']['Tables']['media']['Row'][];
          cities?: {
            city_id: string;
            name?: string | null;
            states?: {
              sigla?: string | null;
            };
          };
        };
        Insert: {
          seller_id: string;
          user_id: string;
          name?: string | null;
          description?: string | null;
          short_description?: string | null;
          phone?: string | null;
          city_id?: string | null;
          state_id?: string | null;
          neighborhood?: string | null;
          avatar_url?: string | null;
          feature_image?: string | null;
          gender?: string | null;
          hourly_rate?: number | null;
          age?: number | null;
          location_description?: string | null;
          sexual_orientation?: string | null;
          current_weight?: number | null;
          current_height?: number | null;
          ethnicity?: string | null;
          hair_color?: string | null;
          hair_length?: string | null;
          shoe_size?: number | null;
          has_silicone?: boolean | null;
          has_tattoos?: boolean | null;
          has_piercings?: boolean | null;
          payment_methods?: string[] | null;
          service_location?: string | null;
          featured_image_url?: string | null;
          address_details?: string | null;
          media?: Database['public']['Tables']['media']['Row'][];
          service_tags?: string[];
          cities?: {
            city_id: string;
            name?: string | null;
            states?: {
              sigla?: string | null;
            };
          };
        };
        Update: {
          seller_id?: string;
          user_id?: string;
          name?: string | null;
          description?: string | null;
          short_description?: string | null;
          phone?: string | null;
          city_id?: string | null;
          state_id?: string | null;
          neighborhood?: string | null;
          avatar_url?: string | null;
          feature_image?: string | null;
          gender?: string | null;
          hourly_rate?: number | null;
          age?: number | null;
          location_description?: string | null;
          sexual_orientation?: string | null;
          current_weight?: number | null;
          current_height?: number | null;
          ethnicity?: string | null;
          hair_color?: string | null;
          hair_length?: string | null;
          shoe_size?: number | null;
          has_silicone?: boolean | null;
          has_tattoos?: boolean | null;
          has_piercings?: boolean | null;
          payment_methods?: string[] | null;
          service_location?: string | null;
          address_details?: string | null;
          featured_image_url?: string | null;
          media?: Database['public']['Tables']['media']['Row'][];
          service_tags?: string[];
          cities?: {
            city_id: string;
            name?: string | null;
            states?: {
              sigla?: string | null;
            };
          };
        };
        Relationships: [
          {
            foreignKeyName: 'sellers_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sellers_city_id_fkey';
            columns: ['city_id'];
            referencedRelation: 'cities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sellers_state_id_fkey';
            columns: ['state_id'];
            referencedRelation: 'states';
            referencedColumns: ['id'];
          }
        ];
      };
      media: {
        Row: {
          user_id: string;
          media_id: string;
          media_type: string | null;
          media_url: string | null;
          description: string | null;
        };
        Insert: {
          user_id?: string | null;
          media_id?: string | null;
          media_type?: string | null;
          media_url?: string | null;
          description?: string | null;
        };
        Update: {
          user_id?: string;
          media_id?: string;
          media_type?: string | null;
          media_url?: string | null;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'media_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year';
      pricing_type: 'one_time' | 'recurring';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
        | 'paused';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
