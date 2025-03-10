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
      establishments: {
        Row: {
          address: string | null
          contact_number: string | null
          created_at: string | null
          dti_cert_no: string
          id: string
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["establishment_status"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          dti_cert_no: string
          id?: string
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["establishment_status"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_number?: string | null
          created_at?: string | null
          dti_cert_no?: string
          id?: string
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["establishment_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          application_id: string
          application_type: string
          content_type: string
          created_at: string | null
          file_name: string
          file_url: string
          id: string
        }
        Insert: {
          application_id: string
          application_type: string
          content_type: string
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
        }
        Update: {
          application_id?: string
          application_type?: string
          content_type?: string
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
        }
        Relationships: []
      }
      fsec_applications: {
        Row: {
          application_date: string
          application_time: string
          certificate_url: string | null
          created_at: string | null
          establishment_id: string
          id: string
          owner_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id: string
          id?: string
          owner_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id?: string
          id?: string
          owner_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fsec_applications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      fsic_business_applications: {
        Row: {
          application_date: string
          application_time: string
          certificate_url: string | null
          created_at: string | null
          establishment_id: string
          id: string
          inspection_date: string | null
          inspection_time: string | null
          inspector_id: string | null
          owner_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          owner_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id?: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          owner_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fsic_business_applications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      fsic_occupancy_applications: {
        Row: {
          application_date: string
          application_time: string
          certificate_url: string | null
          created_at: string | null
          establishment_id: string
          id: string
          inspection_date: string | null
          inspection_time: string | null
          inspector_id: string | null
          owner_id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          owner_id: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          application_date?: string
          application_time?: string
          certificate_url?: string | null
          created_at?: string | null
          establishment_id?: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          owner_id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fsic_occupancy_applications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_checklists: {
        Row: {
          application_id: string
          application_type: string
          checklist_data: Json
          created_at: string | null
          id: string
          images: string[] | null
          inspection_date: string
          inspector_id: string
          inspector_name: string
        }
        Insert: {
          application_id: string
          application_type: string
          checklist_data: Json
          created_at?: string | null
          id?: string
          images?: string[] | null
          inspection_date?: string
          inspector_id: string
          inspector_name: string
        }
        Update: {
          application_id?: string
          application_type?: string
          checklist_data?: Json
          created_at?: string | null
          id?: string
          images?: string[] | null
          inspection_date?: string
          inspector_id?: string
          inspector_name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          middle_name: string | null
          position: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          middle_name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "fire_inspector" | "establishment_owner"
      application_status:
        | "pending"
        | "approved"
        | "rejected"
        | "unscheduled"
        | "for_inspection"
        | "inspected"
      establishment_status:
        | "unregistered"
        | "pending"
        | "registered"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
