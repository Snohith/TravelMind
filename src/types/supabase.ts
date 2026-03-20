export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          day_id: string
          description: string | null
          id: string
          lat: number | null
          lng: number | null
          price_inr: number | null
          time: string
          title: string
          type: string
        }
        Insert: {
          day_id: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          price_inr?: number | null
          time: string
          title: string
          type: string
        }
        Update: {
          day_id?: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          price_inr?: number | null
          time?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          coords_lat: number
          coords_lng: number
          id: string
          image_url: string | null
          local_delicacies: Json | null
          name: string
          photo_gallery: string[] | null
          theme: string
        }
        Insert: {
          coords_lat: number
          coords_lng: number
          id?: string
          image_url?: string | null
          local_delicacies?: Json | null
          name: string
          photo_gallery?: string[] | null
          theme: string
        }
        Update: {
          coords_lat?: number
          coords_lng?: number
          id?: string
          image_url?: string | null
          local_delicacies?: Json | null
          name?: string
          photo_gallery?: string[] | null
          theme?: string
        }
        Relationships: []
      }
      itinerary_days: {
        Row: {
          date: string
          day_number: number
          description: string | null
          id: string
          lat: number
          lng: number
          title: string
          trip_id: string
        }
        Insert: {
          date: string
          day_number: number
          description?: string | null
          id?: string
          lat: number
          lng: number
          title: string
          trip_id: string
        }
        Update: {
          date?: string
          day_number?: number
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          budget: number
          created_at: string | null
          duration: number
          from_city: string
          id: string
          start_date: string | null
          to_city: string
          total_price: number | null
          user_id: string
          vibe: string
        }
        Insert: {
          budget: number
          created_at?: string | null
          duration: number
          from_city: string
          id?: string
          start_date?: string | null
          to_city: string
          total_price?: number | null
          user_id: string
          vibe: string
        }
        Update: {
          budget?: number
          created_at?: string | null
          duration?: number
          from_city?: string
          id?: string
          start_date?: string | null
          to_city?: string
          total_price?: number | null
          user_id?: string
          vibe?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
  }
}
