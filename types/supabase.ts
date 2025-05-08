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
      boss: {
        Row: {
          boss_name: string
          category: string | null
          dkp_points: number
          id: number
        }
        Insert: {
          boss_name: string
          category?: string | null
          dkp_points: number
          id?: number
        }
        Update: {
          boss_name?: string
          category?: string | null
          dkp_points?: number
          id?: number
        }
        Relationships: []
      }
      Expense: {
        Row: {
          amount: number
          comment: string | null
          date: string
          id: number
          source: string
          target: string
        }
        Insert: {
          amount: number
          comment?: string | null
          date: string
          id?: number
          source: string
          target: string
        }
        Update: {
          amount?: number
          comment?: string | null
          date?: string
          id?: number
          source?: string
          target?: string
        }
        Relationships: []
      }
      givenawayloot: {
        Row: {
          comment: string | null
          created_at: string | null
          date: string
          id: number
          name: string
          status: string | null
          user_id: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          date: string
          id?: number
          name: string
          status?: string | null
          user_id: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          date?: string
          id?: number
          name?: string
          status?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "givenawayloot_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      GuildFunds: {
        Row: {
          id: number
          month: number
          profit: number
          salaryBudget: number
          totalExpenses: number
          totalIncome: number
          treasuryLeft: number
          year: number
        }
        Insert: {
          id?: number
          month: number
          profit: number
          salaryBudget: number
          totalExpenses: number
          totalIncome: number
          treasuryLeft: number
          year: number
        }
        Update: {
          id?: number
          month?: number
          profit?: number
          salaryBudget?: number
          totalExpenses?: number
          totalIncome?: number
          treasuryLeft?: number
          year?: number
        }
        Relationships: []
      }
      item_type: {
        Row: {
          id: number
          name: string
          price: number | null
        }
        Insert: {
          id?: number
          name: string
          price?: number | null
        }
        Update: {
          id?: number
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      link_token: {
        Row: {
          expiresAt: string
          id: number
          token: string
          used: boolean
          userId: number
        }
        Insert: {
          expiresAt: string
          id?: number
          token: string
          used?: boolean
          userId: number
        }
        Update: {
          expiresAt?: string
          id?: number
          token?: string
          used?: boolean
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "link_token_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      loot: {
        Row: {
          acquired_at: string | null
          comment: string | null
          created_at: string
          group_id: number | null
          id: number
          item_type_id: number
          price: number | null
          quantity: number
          sold_at: string | null
          sold_to: string | null
          sold_to_user_id: number | null
          source: string | null
          status: string | null
        }
        Insert: {
          acquired_at?: string | null
          comment?: string | null
          created_at?: string
          group_id?: number | null
          id?: number
          item_type_id: number
          price?: number | null
          quantity?: number
          sold_at?: string | null
          sold_to?: string | null
          sold_to_user_id?: number | null
          source?: string | null
          status?: string | null
        }
        Update: {
          acquired_at?: string | null
          comment?: string | null
          created_at?: string
          group_id?: number | null
          id?: number
          item_type_id?: number
          price?: number | null
          quantity?: number
          sold_at?: string | null
          sold_to?: string | null
          sold_to_user_id?: number | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_item_type"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sold_to_user"
            columns: ["sold_to_user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      loot_queue: {
        Row: {
          created_at: string | null
          delivered: number
          id: number
          item_type_id: number
          remaining: number | null
          required: number
          status: string | null
          synth_target: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          delivered?: number
          id?: number
          item_type_id: number
          remaining?: number | null
          required?: number
          status?: string | null
          synth_target?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          delivered?: number
          id?: number
          item_type_id?: number
          remaining?: number | null
          required?: number
          status?: string | null
          synth_target?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "loot_queue_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loot_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      News: {
        Row: {
          content: string
          createdAt: string
          date: string
          id: number
          title: string
          updatedAt: string
        }
        Insert: {
          content: string
          createdAt?: string
          date?: string
          id?: number
          title: string
          updatedAt?: string
        }
        Update: {
          content?: string
          createdAt?: string
          date?: string
          id?: number
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      raid: {
        Row: {
          created_at: string
          dkp_summary: number | null
          id: number
          is_pvp: boolean | null
          is_pvp_long: boolean | null
          start_date: string | null
          type: string | null
        }
        Insert: {
          created_at: string
          dkp_summary?: number | null
          id?: never
          is_pvp?: boolean | null
          is_pvp_long?: boolean | null
          start_date?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          dkp_summary?: number | null
          id?: never
          is_pvp?: boolean | null
          is_pvp_long?: boolean | null
          start_date?: string | null
          type?: string | null
        }
        Relationships: []
      }
      raid_attendance: {
        Row: {
          created_at: string
          id: number
          raid_id: number
          user_id: number
        }
        Insert: {
          created_at: string
          id?: never
          raid_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          id?: never
          raid_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "raid_attendance_raid_id_fkey"
            columns: ["raid_id"]
            isOneToOne: false
            referencedRelation: "raid"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raid_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      raid_boss: {
        Row: {
          boss_id: number
          raid_id: number
        }
        Insert: {
          boss_id: number
          raid_id: number
        }
        Update: {
          boss_id?: number
          raid_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "raid_boss_boss_id_fkey"
            columns: ["boss_id"]
            isOneToOne: false
            referencedRelation: "boss"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "raid_boss_raid_id_fkey"
            columns: ["raid_id"]
            isOneToOne: false
            referencedRelation: "raid"
            referencedColumns: ["id"]
          },
        ]
      }
      Salary: {
        Row: {
          amount: number
          bonus: number | null
          id: number
          month: number
          total: number
          userId: number
          year: number
        }
        Insert: {
          amount: number
          bonus?: number | null
          id?: number
          month: number
          total: number
          userId: number
          year: number
        }
        Update: {
          amount?: number
          bonus?: number | null
          id?: number
          month?: number
          total?: number
          userId?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "Salary_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          id: number
          name: string | null
          user_id: number
        }
        Insert: {
          completed_at?: string | null
          created_at: string
          id?: number
          name?: string | null
          user_id: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: number
          name?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks_user: {
        Row: {
          tasks_user_id: number
          user_id: number
        }
        Insert: {
          tasks_user_id: number
          user_id: number
        }
        Update: {
          tasks_user_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_tasks_user_id_fkey"
            columns: ["tasks_user_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          active: boolean
          class: string | null
          class_gear_score: number | null
          created_at: string
          google_id: string | null
          id: number
          is_eligible_for_salary: boolean
          joined_at: string | null
          salaryBonus: number | null
          secondary_class: string | null
          secondary_class_gear_score: number | null
          username: string
          vk_id: string | null
          vk_name: string | null
        }
        Insert: {
          active: boolean
          class?: string | null
          class_gear_score?: number | null
          created_at: string
          google_id?: string | null
          id: number
          is_eligible_for_salary: boolean
          joined_at?: string | null
          salaryBonus?: number | null
          secondary_class?: string | null
          secondary_class_gear_score?: number | null
          username: string
          vk_id?: string | null
          vk_name?: string | null
        }
        Update: {
          active?: boolean
          class?: string | null
          class_gear_score?: number | null
          created_at?: string
          google_id?: string | null
          id?: number
          is_eligible_for_salary?: boolean
          joined_at?: string | null
          salaryBonus?: number | null
          secondary_class?: string | null
          secondary_class_gear_score?: number | null
          username?: string
          vk_id?: string | null
          vk_name?: string | null
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          created_at: string
          id: number
          name: string | null
          quality: string | null
          quantity: number | null
          type: string | null
          user_id: number
        }
        Insert: {
          created_at: string
          id?: number
          name?: string | null
          quality?: string | null
          quantity?: number | null
          type?: string | null
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          quality?: string | null
          quantity?: number | null
          type?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_salary_bonus: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          reason: string
          user_id: number
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          reason: string
          user_id: number
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          reason?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_salary_bonus_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tags: {
        Row: {
          created_at: string
          id: number
          tag: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          tag: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: never
          tag?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
