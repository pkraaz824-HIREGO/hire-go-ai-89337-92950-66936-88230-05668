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
      ai_evaluations: {
        Row: {
          candidate_id: string
          clarity_score: number | null
          communication_score: number | null
          confidence_score: number | null
          created_at: string | null
          emotion_analysis: Json | null
          evaluation_notes: string | null
          id: string
          overall_rating: number | null
          skill_score: number | null
          transcript: string | null
          video_recording_id: string
        }
        Insert: {
          candidate_id: string
          clarity_score?: number | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          emotion_analysis?: Json | null
          evaluation_notes?: string | null
          id?: string
          overall_rating?: number | null
          skill_score?: number | null
          transcript?: string | null
          video_recording_id: string
        }
        Update: {
          candidate_id?: string
          clarity_score?: number | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          emotion_analysis?: Json | null
          evaluation_notes?: string | null
          id?: string
          overall_rating?: number | null
          skill_score?: number | null
          transcript?: string | null
          video_recording_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_evaluations_video_recording_id_fkey"
            columns: ["video_recording_id"]
            isOneToOne: false
            referencedRelation: "video_recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          ai_recommendation_notes: string | null
          ai_recommendation_score: number | null
          applied_at: string | null
          candidate_id: string
          cover_letter: string | null
          id: string
          job_id: string
          match_score: number | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_recommendation_notes?: string | null
          ai_recommendation_score?: number | null
          applied_at?: string | null
          candidate_id: string
          cover_letter?: string | null
          id?: string
          job_id: string
          match_score?: number | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_recommendation_notes?: string | null
          ai_recommendation_score?: number | null
          applied_at?: string | null
          candidate_id?: string
          cover_letter?: string | null
          id?: string
          job_id?: string
          match_score?: number | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_question_assignments: {
        Row: {
          assigned_at: string | null
          candidate_id: string
          completed_at: string | null
          id: string
          question_id: string
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          candidate_id: string
          completed_at?: string | null
          id?: string
          question_id: string
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          candidate_id?: string
          completed_at?: string | null
          id?: string
          question_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_question_assignments_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "interview_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          proficiency_level: string | null
          skill_name: string
          years_experience: number | null
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          proficiency_level?: string | null
          skill_name: string
          years_experience?: number | null
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          proficiency_level?: string | null
          skill_name?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          id: string
          question_text: string
          question_type: string | null
          role_category: string
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          question_text: string
          question_type?: string | null
          role_category: string
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          question_text?: string
          question_type?: string | null
          role_category?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          application_id: string
          candidate_id: string
          created_at: string | null
          employer_id: string
          id: string
          job_title: string
          notes: string | null
          recording_url: string | null
          scheduled_date: string
          scheduled_time: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          candidate_id: string
          created_at?: string | null
          employer_id: string
          id?: string
          job_title: string
          notes?: string | null
          recording_url?: string | null
          scheduled_date: string
          scheduled_time: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          candidate_id?: string
          created_at?: string | null
          employer_id?: string
          id?: string
          job_title?: string
          notes?: string | null
          recording_url?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          company: string
          contact_email: string | null
          created_at: string | null
          description: string | null
          employer_id: string
          employment_type: string | null
          experience_level: string | null
          id: string
          is_draft: boolean | null
          job_category: string | null
          job_responsibilities: string | null
          key_qualifications: string | null
          location: string | null
          num_openings: number | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_deadline?: string | null
          company: string
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          employer_id: string
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_draft?: boolean | null
          job_category?: string | null
          job_responsibilities?: string | null
          key_qualifications?: string | null
          location?: string | null
          num_openings?: number | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_deadline?: string | null
          company?: string
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          employer_id?: string
          employment_type?: string | null
          experience_level?: string | null
          id?: string
          is_draft?: boolean | null
          job_category?: string | null
          job_responsibilities?: string | null
          key_qualifications?: string | null
          location?: string | null
          num_openings?: number | null
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_description: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          designation: string | null
          education_background: string | null
          email: string | null
          employee_count: string | null
          full_name: string | null
          id: string
          industry: string | null
          is_verified: boolean | null
          linkedin_profile: string | null
          location: string | null
          overall_candidate_score: number | null
          phone: string | null
          pincode: string | null
          previous_experience: string | null
          profile_completion_status: string | null
          role: string | null
          state: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_description?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          designation?: string | null
          education_background?: string | null
          email?: string | null
          employee_count?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          linkedin_profile?: string | null
          location?: string | null
          overall_candidate_score?: number | null
          phone?: string | null
          pincode?: string | null
          previous_experience?: string | null
          profile_completion_status?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_description?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          designation?: string | null
          education_background?: string | null
          email?: string | null
          employee_count?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          is_verified?: boolean | null
          linkedin_profile?: string | null
          location?: string | null
          overall_candidate_score?: number | null
          phone?: string | null
          pincode?: string | null
          previous_experience?: string | null
          profile_completion_status?: string | null
          role?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
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
      video_recordings: {
        Row: {
          candidate_id: string
          created_at: string | null
          duration: number | null
          id: string
          question_id: string | null
          recorded_at: string | null
          video_type: string
          video_url: string
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          duration?: number | null
          id?: string
          question_id?: string | null
          recorded_at?: string | null
          video_type: string
          video_url: string
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          question_id?: string | null
          recorded_at?: string | null
          video_type?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "candidate" | "employer" | "admin"
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
      app_role: ["candidate", "employer", "admin"],
    },
  },
} as const
