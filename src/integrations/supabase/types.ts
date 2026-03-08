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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_id: string | null
          author_name: string
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          parent_id: string | null
          post_id: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_id?: string | null
          post_id: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string
          category: string
          comment_count: number | null
          content: Json
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          like_count: number | null
          read_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          category?: string
          comment_count?: number | null
          content?: Json
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          like_count?: number | null
          read_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category?: string
          comment_count?: number | null
          content?: Json
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          like_count?: number | null
          read_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          thread_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          thread_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          thread_count?: number | null
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          author_id: string | null
          author_name: string
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          parent_id: string | null
          thread_id: string
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          thread_id: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          thread_id?: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string | null
          author_name: string
          category_id: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes: number | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string
          category_id?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          category_id?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_votes: {
        Row: {
          comment_id: string | null
          created_at: string | null
          id: string
          thread_id: string | null
          user_id: string
          vote_type: number
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id: string
          vote_type: number
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string | null
          avatar_emoji: string | null
          avatar_url: string | null
          bio: string | null
          certificates: Json | null
          created_at: string
          display_name: string | null
          education_history: Json | null
          elo: number
          email: string
          full_name: string
          github_url: string | null
          hourly_rate: string | null
          id: string
          id_verified: boolean | null
          instagram_url: string | null
          interests: string[] | null
          languages: string[] | null
          linkedin_url: string | null
          location: string | null
          needs: string[] | null
          onboarding_complete: boolean | null
          personal_website: string | null
          portfolio_items: Json | null
          portfolio_url: string | null
          preferred_comm: string | null
          referral_code: string | null
          referred_by: string | null
          response_time: string | null
          skill_levels: Json | null
          skills: string[] | null
          slogan: string | null
          sp: number
          streak_days: number | null
          tier: string
          timezone: string | null
          total_gigs_completed: number | null
          twitter_url: string | null
          university: string | null
          updated_at: string
          user_id: string
          work_history: Json | null
          youtube_url: string | null
        }
        Insert: {
          availability?: string | null
          avatar_emoji?: string | null
          avatar_url?: string | null
          bio?: string | null
          certificates?: Json | null
          created_at?: string
          display_name?: string | null
          education_history?: Json | null
          elo?: number
          email?: string
          full_name?: string
          github_url?: string | null
          hourly_rate?: string | null
          id?: string
          id_verified?: boolean | null
          instagram_url?: string | null
          interests?: string[] | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          needs?: string[] | null
          onboarding_complete?: boolean | null
          personal_website?: string | null
          portfolio_items?: Json | null
          portfolio_url?: string | null
          preferred_comm?: string | null
          referral_code?: string | null
          referred_by?: string | null
          response_time?: string | null
          skill_levels?: Json | null
          skills?: string[] | null
          slogan?: string | null
          sp?: number
          streak_days?: number | null
          tier?: string
          timezone?: string | null
          total_gigs_completed?: number | null
          twitter_url?: string | null
          university?: string | null
          updated_at?: string
          user_id: string
          work_history?: Json | null
          youtube_url?: string | null
        }
        Update: {
          availability?: string | null
          avatar_emoji?: string | null
          avatar_url?: string | null
          bio?: string | null
          certificates?: Json | null
          created_at?: string
          display_name?: string | null
          education_history?: Json | null
          elo?: number
          email?: string
          full_name?: string
          github_url?: string | null
          hourly_rate?: string | null
          id?: string
          id_verified?: boolean | null
          instagram_url?: string | null
          interests?: string[] | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          needs?: string[] | null
          onboarding_complete?: boolean | null
          personal_website?: string | null
          portfolio_items?: Json | null
          portfolio_url?: string | null
          preferred_comm?: string | null
          referral_code?: string | null
          referred_by?: string | null
          response_time?: string | null
          skill_levels?: Json | null
          skills?: string[] | null
          slogan?: string | null
          sp?: number
          streak_days?: number | null
          tier?: string
          timezone?: string | null
          total_gigs_completed?: number | null
          twitter_url?: string | null
          university?: string | null
          updated_at?: string
          user_id?: string
          work_history?: Json | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "admin" | "moderator" | "user" | "enterprise"
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
      app_role: ["admin", "moderator", "user", "enterprise"],
    },
  },
} as const
