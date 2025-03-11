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
      application_documents: {
        Row: {
          application_id: string
          document_type: string
          file_path: string
          id: string
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          document_type: string
          file_path: string
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          document_type?: string
          file_path?: string
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_date: string
          application_time: string
          application_type: Database["public"]["Enums"]["application_type"]
          created_at: string | null
          establishment_id: string
          id: string
          inspection_date: string | null
          inspection_time: string | null
          inspector_id: string | null
          priority: boolean | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          application_date?: string
          application_time?: string
          application_type: Database["public"]["Enums"]["application_type"]
          created_at?: string | null
          establishment_id: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          priority?: boolean | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          application_date?: string
          application_time?: string
          application_type?: Database["public"]["Enums"]["application_type"]
          created_at?: string | null
          establishment_id?: string
          id?: string
          inspection_date?: string | null
          inspection_time?: string | null
          inspector_id?: string | null
          priority?: boolean | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          application_id: string
          certificate_number: string
          created_at: string | null
          expiry_date: string
          file_path: string
          id: string
          issue_date: string
        }
        Insert: {
          application_id: string
          certificate_number: string
          created_at?: string | null
          expiry_date: string
          file_path: string
          id?: string
          issue_date?: string
        }
        Update: {
          application_id?: string
          certificate_number?: string
          created_at?: string | null
          expiry_date?: string
          file_path?: string
          id?: string
          issue_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          checklist_id: string
          id: string
          image_path: string | null
          is_compliant: boolean
          item_name: string
          notes: string | null
        }
        Insert: {
          checklist_id: string
          id?: string
          image_path?: string | null
          is_compliant: boolean
          item_name: string
          notes?: string | null
        }
        Update: {
          checklist_id?: string
          id?: string
          image_path?: string | null
          is_compliant?: boolean
          item_name?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "inspection_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string | null
          created_at: string | null
          dti_number: string
          id: string
          location: unknown | null
          name: string
          owner_id: string
          status: Database["public"]["Enums"]["establishment_status"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          dti_number: string
          id?: string
          location?: unknown | null
          name: string
          owner_id: string
          status?: Database["public"]["Enums"]["establishment_status"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          dti_number?: string
          id?: string
          location?: unknown | null
          name?: string
          owner_id?: string
          status?: Database["public"]["Enums"]["establishment_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      inspection_checklists: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          inspection_date: string
          inspector_id: string
          inspector_name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          inspection_date: string
          inspector_id: string
          inspector_name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          inspection_date?: string
          inspector_id?: string
          inspector_name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_checklists_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          middle_name: string | null
          position: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          middle_name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          middle_name?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
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
      application_status:
        | "pending"
        | "approved"
        | "rejected"
        | "unscheduled"
        | "for_inspection"
        | "inspected"
      application_type: "fsec" | "fsic_occupancy" | "fsic_business"
      establishment_status: "unregistered" | "registered" | "rejected"
      user_role: "admin" | "inspector" | "owner"
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
