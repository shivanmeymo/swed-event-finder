export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          approved: boolean | null
          attendees: number | null
          category: string
          created_at: string | null
          data_retention_extended_at: string | null
          description: string | null
          end_datetime: string
          id: string
          image_url: string | null
          is_free: boolean | null
          location: string
          organizer_description: string | null
          organizer_email: string | null
          organizer_id: string
          price_adults: number | null
          price_kids: number | null
          price_seniors: number | null
          price_students: number | null
          start_datetime: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          attendees?: number | null
          category: string
          created_at?: string | null
          data_retention_extended_at?: string | null
          description?: string | null
          end_datetime?: string
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          location: string
          organizer_description?: string | null
          organizer_email?: string | null
          organizer_id: string
          price_adults?: number | null
          price_kids?: number | null
          price_seniors?: number | null
          price_students?: number | null
          start_datetime?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          attendees?: number | null
          category?: string
          created_at?: string | null
          data_retention_extended_at?: string | null
          description?: string | null
          end_datetime?: string
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          location?: string
          organizer_description?: string | null
          organizer_email?: string | null
          organizer_id?: string
          price_adults?: number | null
          price_kids?: number | null
          price_seniors?: number | null
          price_students?: number | null
          start_datetime?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          category_filter: string | null
          created_at: string
          email: string
          id: string
          keyword_filter: string | null
          location_filter: string | null
        }
        Insert: {
          category_filter?: string | null
          created_at?: string
          email: string
          id?: string
          keyword_filter?: string | null
          location_filter?: string | null
        }
        Update: {
          category_filter?: string | null
          created_at?: string
          email?: string
          id?: string
          keyword_filter?: string | null
          location_filter?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          data_retention_extended_at: string | null
          email: string
          full_name: string | null
          gdpr_deletion_notified_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          data_retention_extended_at?: string | null
          email: string
          full_name?: string | null
          gdpr_deletion_notified_at?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          data_retention_extended_at?: string | null
          email?: string
          full_name?: string | null
          gdpr_deletion_notified_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      events_public: {
        Row: {
          approved: boolean | null
          attendees: number | null
          category: string | null
          created_at: string | null
          description: string | null
          end_datetime: string | null
          id: string | null
          image_url: string | null
          is_free: boolean | null
          location: string | null
          organizer_description: string | null
          organizer_email: string | null
          organizer_id: string | null
          price_adults: number | null
          price_kids: number | null
          price_seniors: number | null
          price_students: number | null
          start_datetime: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          attendees?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string | null
          image_url?: string | null
          is_free?: boolean | null
          location?: string | null
          organizer_description?: string | null
          organizer_email?: never
          organizer_id?: string | null
          price_adults?: number | null
          price_kids?: number | null
          price_seniors?: number | null
          price_students?: number | null
          start_datetime?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          attendees?: number | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string | null
          image_url?: string | null
          is_free?: boolean | null
          location?: string | null
          organizer_description?: string | null
          organizer_email?: never
          organizer_id?: string | null
          price_adults?: number | null
          price_kids?: number | null
          price_seniors?: number | null
          price_students?: number | null
          start_datetime?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      extend_data_retention: { Args: { p_user_id: string }; Returns: undefined }
      get_users_due_for_gdpr_deletion: {
        Args: never
        Returns: {
          email: string
          user_id: string
        }[]
      }
      get_users_due_for_gdpr_warning: {
        Args: never
        Returns: {
          email: string
          full_name: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_gdpr_warning_sent: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      mask_email: { Args: { email: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "organizer" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "organizer", "user"],
    },
  },
} as const
