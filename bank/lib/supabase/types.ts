export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          address: string | null;
          country: string;
          role: "user" | "admin";
          kyc_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          country?: string;
          role?: "user" | "admin";
          kyc_verified?: boolean;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          address?: string | null;
          country?: string;
          role?: "user" | "admin";
          kyc_verified?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          account_number: string;
          iban: string | null;
          account_type: "checking" | "savings" | "investment" | "business";
          currency: string;
          balance: number;
          name: string;
          is_primary: boolean;
          status: "active" | "frozen" | "closed";
          created_at: string;
        };
        Insert: {
          user_id: string;
          account_number: string;
          iban?: string | null;
          account_type: "checking" | "savings" | "investment" | "business";
          currency?: string;
          balance?: number;
          name: string;
          is_primary?: boolean;
          status?: "active" | "frozen" | "closed";
        };
        Update: {
          balance?: number;
          name?: string;
          is_primary?: boolean;
          status?: "active" | "frozen" | "closed";
        };
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          cardholder_name: string;
          card_number: string | null;
          last_four: string;
          expiry_month: number;
          expiry_year: number;
          card_type: "visa" | "mastercard" | "amex" | "discover";
          cvv: string | null;
          nickname: string | null;
          is_frozen: boolean;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          account_id?: string | null;
          cardholder_name: string;
          card_number?: string | null;
          last_four: string;
          expiry_month: number;
          expiry_year: number;
          card_type: "visa" | "mastercard" | "amex" | "discover";
          cvv?: string | null;
          nickname?: string | null;
          is_frozen?: boolean;
          is_primary?: boolean;
        };
        Update: {
          cardholder_name?: string;
          nickname?: string | null;
          is_frozen?: boolean;
          is_primary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "cards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "payment" | "refund";
          amount: number;
          currency: string;
          description: string | null;
          merchant: string | null;
          category: string | null;
          status: "pending" | "completed" | "failed" | "flagged" | "blocked";
          reference_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          account_id?: string | null;
          type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "payment" | "refund";
          amount: number;
          currency?: string;
          description?: string | null;
          merchant?: string | null;
          category?: string | null;
          status?: "pending" | "completed" | "failed" | "flagged" | "blocked";
          reference_id?: string | null;
          metadata?: Json | null;
        };
        Update: {
          status?: "pending" | "completed" | "failed" | "flagged" | "blocked";
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          admin_id: string;
          action: string;
          details?: Json | null;
        };
        Update: {
          details?: Json | null;
        };
        Relationships: [];
      };
      withdrawal_requests: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          amount: number;
          bank_name: string;
          routing_number: string;
          account_number: string;
          account_holder_name: string;
          account_type: "checking" | "savings";
          note: string | null;
          otp: string;
          otp_verified: boolean;
          status: "pending" | "otp_pending" | "processing" | "completed" | "rejected" | "cancelled";
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          account_id: string;
          amount: number;
          bank_name: string;
          routing_number: string;
          account_number: string;
          account_holder_name: string;
          account_type?: "checking" | "savings";
          note?: string | null;
          otp: string;
          otp_verified?: boolean;
          status?: "pending" | "otp_pending" | "processing" | "completed" | "rejected" | "cancelled";
        };
        Update: {
          otp?: string;
          otp_verified?: boolean;
          status?: "pending" | "otp_pending" | "processing" | "completed" | "rejected" | "cancelled";
          admin_note?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      support_messages: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          sender_type: "user" | "admin";
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          message: string;
          sender_type: "user" | "admin";
          read?: boolean;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
      admin_credentials: {
        Row: {
          id: number;
          username: string;
          password_hash: string;
          updated_at: string;
        };
        Insert: {
          username: string;
          password_hash: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          password_hash?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      transfer_between_users: {
        Args: {
          p_from_account_id: string;
          p_to_email: string;
          p_amount: number;
          p_note: string | null;
        };
        Returns: Json;
      };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Card = Database["public"]["Tables"]["cards"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type WithdrawalRequest = Database["public"]["Tables"]["withdrawal_requests"]["Row"];
export type SupportMessage = Database["public"]["Tables"]["support_messages"]["Row"];
