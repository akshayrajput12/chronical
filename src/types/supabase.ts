export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          created_at: string
          email: string
          role: string
          clerk_id: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          role?: string
          clerk_id: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: string
          clerk_id?: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
    CompositeTypes: Record<string, unknown>
  }
}
