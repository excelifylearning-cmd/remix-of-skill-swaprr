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
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          threshold: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name: string
          threshold?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          threshold?: number | null
        }
        Relationships: []
      }
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
      badges: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          priority: string
          status: string
          subject: string | null
          topic: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          priority?: string
          status?: string
          subject?: string | null
          topic?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          priority?: string
          status?: string
          subject?: string | null
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          created_at: string
          description: string
          filed_against: string
          filed_by: string
          id: string
          outcome: string | null
          resolved_at: string | null
          sp_amount: number
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          filed_against: string
          filed_by: string
          id?: string
          outcome?: string | null
          resolved_at?: string | null
          sp_amount?: number
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          filed_against?: string
          filed_by?: string
          id?: string
          outcome?: string | null
          resolved_at?: string | null
          sp_amount?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_filed_against_profiles_fkey"
            columns: ["filed_against"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "disputes_filed_by_profiles_fkey"
            columns: ["filed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enterprise_candidates: {
        Row: {
          candidate_user_id: string
          created_at: string
          id: string
          posted_at: string
          project_id: string | null
          role: string
          stage: string
          urgency: string
          user_id: string
        }
        Insert: {
          candidate_user_id: string
          created_at?: string
          id?: string
          posted_at?: string
          project_id?: string | null
          role?: string
          stage?: string
          urgency?: string
          user_id: string
        }
        Update: {
          candidate_user_id?: string
          created_at?: string
          id?: string
          posted_at?: string
          project_id?: string | null
          role?: string
          stage?: string
          urgency?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_candidates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "enterprise_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enterprise_consultations: {
        Row: {
          created_at: string
          expert_name: string
          expert_user_id: string | null
          id: string
          scheduled_date: string | null
          scheduled_time: string | null
          sp_cost: number
          status: string
          topic: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expert_name?: string
          expert_user_id?: string | null
          id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          sp_cost?: number
          status?: string
          topic?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expert_name?: string
          expert_user_id?: string | null
          id?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          sp_cost?: number
          status?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      enterprise_projects: {
        Row: {
          budget: number
          created_at: string
          deadline: string | null
          description: string
          id: string
          name: string
          priority: string
          progress: number
          status: string
          team_size: number
          updated_at: string
          user_id: string
        }
        Insert: {
          budget?: number
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          name: string
          priority?: string
          progress?: number
          status?: string
          team_size?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          budget?: number
          created_at?: string
          deadline?: string | null
          description?: string
          id?: string
          name?: string
          priority?: string
          progress?: number
          status?: string
          team_size?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          status: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          status?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          end_date: string | null
          event_date: string
          event_type: string
          icon: string
          id: string
          is_featured: boolean
          is_recurring: boolean
          location: string | null
          prize: string | null
          recurrence_rule: string | null
          spots: number | null
          spots_filled: number
          status: string
          tags: string[] | null
          time_label: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          event_date: string
          event_type?: string
          icon?: string
          id?: string
          is_featured?: boolean
          is_recurring?: boolean
          location?: string | null
          prize?: string | null
          recurrence_rule?: string | null
          spots?: number | null
          spots_filled?: number
          status?: string
          tags?: string[] | null
          time_label?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          event_date?: string
          event_type?: string
          icon?: string
          id?: string
          is_featured?: boolean
          is_recurring?: boolean
          location?: string | null
          prize?: string | null
          recurrence_rule?: string | null
          spots?: number | null
          spots_filled?: number
          status?: string
          tags?: string[] | null
          time_label?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_requests: {
        Row: {
          category: string
          comments: number
          created_at: string
          description: string
          hot: boolean
          icon: string
          id: string
          status: string
          title: string
          votes: number
        }
        Insert: {
          category?: string
          comments?: number
          created_at?: string
          description?: string
          hot?: boolean
          icon?: string
          id?: string
          status?: string
          title: string
          votes?: number
        }
        Update: {
          category?: string
          comments?: number
          created_at?: string
          description?: string
          hot?: boolean
          icon?: string
          id?: string
          status?: string
          title?: string
          votes?: number
        }
        Relationships: []
      }
      feature_votes: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
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
      guild_achievements: {
        Row: {
          achievement_id: string
          completed: boolean
          completed_at: string | null
          guild_id: string
          id: string
          progress: number
        }
        Insert: {
          achievement_id: string
          completed?: boolean
          completed_at?: string | null
          guild_id: string
          id?: string
          progress?: number
        }
        Update: {
          achievement_id?: string
          completed?: boolean
          completed_at?: string | null
          guild_id?: string
          id?: string
          progress?: number
        }
        Relationships: [
          {
            foreignKeyName: "guild_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guild_achievements_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          guild_id: string
          id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          guild_id: string
          id?: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          guild_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guild_badges_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_loans: {
        Row: {
          amount: number
          borrowed_at: string
          borrower_id: string
          due_date: string
          guild_id: string
          id: string
          interest_rate: number
          status: string
        }
        Insert: {
          amount?: number
          borrowed_at?: string
          borrower_id: string
          due_date: string
          guild_id: string
          id?: string
          interest_rate?: number
          status?: string
        }
        Update: {
          amount?: number
          borrowed_at?: string
          borrower_id?: string
          due_date?: string
          guild_id?: string
          id?: string
          interest_rate?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_loans_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          guild_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          guild_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          guild_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guild_members_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      guild_projects: {
        Row: {
          client: string
          created_at: string
          guild_id: string
          id: string
          members_count: number
          progress: number
          sp_pool: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client?: string
          created_at?: string
          guild_id: string
          id?: string
          members_count?: number
          progress?: number
          sp_pool?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client?: string
          created_at?: string
          guild_id?: string
          id?: string
          members_count?: number
          progress?: number
          sp_pool?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_projects_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_treasury_log: {
        Row: {
          amount: number
          created_at: string
          guild_id: string
          id: string
          reason: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          guild_id: string
          id?: string
          reason?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          guild_id?: string
          id?: string
          reason?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_treasury_log_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_wars: {
        Row: {
          created_at: string
          guild_id: string
          id: string
          opponent_guild_id: string | null
          opponent_name: string
          our_score: number
          stakes: number
          start_date: string
          status: string
          their_score: number
        }
        Insert: {
          created_at?: string
          guild_id: string
          id?: string
          opponent_guild_id?: string | null
          opponent_name?: string
          our_score?: number
          stakes?: number
          start_date: string
          status?: string
          their_score?: number
        }
        Update: {
          created_at?: string
          guild_id?: string
          id?: string
          opponent_guild_id?: string | null
          opponent_name?: string
          our_score?: number
          stakes?: number
          start_date?: string
          status?: string
          their_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "guild_wars_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guild_wars_opponent_guild_id_fkey"
            columns: ["opponent_guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          avatar_url: string | null
          avg_elo: number
          category: string
          created_at: string
          created_by: string
          description: string
          id: string
          is_public: boolean
          name: string
          perks: string[] | null
          rank: number
          requirements: string[] | null
          slogan: string
          total_gigs: number
          total_sp: number
          updated_at: string
          win_rate: number
        }
        Insert: {
          avatar_url?: string | null
          avg_elo?: number
          category?: string
          created_at?: string
          created_by: string
          description?: string
          id?: string
          is_public?: boolean
          name: string
          perks?: string[] | null
          rank?: number
          requirements?: string[] | null
          slogan?: string
          total_gigs?: number
          total_sp?: number
          updated_at?: string
          win_rate?: number
        }
        Update: {
          avatar_url?: string | null
          avg_elo?: number
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          is_public?: boolean
          name?: string
          perks?: string[] | null
          rank?: number
          requirements?: string[] | null
          slogan?: string
          total_gigs?: number
          total_sp?: number
          updated_at?: string
          win_rate?: number
        }
        Relationships: []
      }
      help_reports: {
        Row: {
          created_at: string
          description: string
          email: string | null
          id: string
          priority: string
          reference_id: string | null
          report_type: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          email?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          report_type: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          report_type?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          inquiries: number
          price: string
          status: string
          title: string
          updated_at: string
          user_id: string
          views: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          inquiries?: number
          price?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          views?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          inquiries?: number
          price?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      tournament_participants: {
        Row: {
          id: string
          placement: number | null
          registered_at: string
          score: number
          status: string
          team_name: string | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          placement?: number | null
          registered_at?: string
          score?: number
          status?: string
          team_name?: string | null
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          placement?: number | null
          registered_at?: string
          score?: number
          status?: string
          team_name?: string | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          end_date: string | null
          entry_fee: number
          format: string
          icon: string
          id: string
          is_quarterly: boolean
          max_teams: number | null
          min_elo: number
          min_gigs: number
          min_tier: string
          name: string
          prize_pool: string
          registration_deadline: string | null
          start_date: string
          status: string
          team_size: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          entry_fee?: number
          format?: string
          icon?: string
          id?: string
          is_quarterly?: boolean
          max_teams?: number | null
          min_elo?: number
          min_gigs?: number
          min_tier?: string
          name: string
          prize_pool?: string
          registration_deadline?: string | null
          start_date: string
          status?: string
          team_size?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          end_date?: string | null
          entry_fee?: number
          format?: string
          icon?: string
          id?: string
          is_quarterly?: boolean
          max_teams?: number | null
          min_elo?: number
          min_gigs?: number
          min_tier?: string
          name?: string
          prize_pool?: string
          registration_deadline?: string | null
          start_date?: string
          status?: string
          team_size?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
