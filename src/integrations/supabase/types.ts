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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          from_email: string
          id: boolean
          notifications_enabled: boolean
          recipient_override: string | null
          site_url: string
          updated_at: string
        }
        Insert: {
          from_email?: string
          id?: boolean
          notifications_enabled?: boolean
          recipient_override?: string | null
          site_url?: string
          updated_at?: string
        }
        Update: {
          from_email?: string
          id?: boolean
          notifications_enabled?: boolean
          recipient_override?: string | null
          site_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          amount_annual_ht: number | null
          commercial_invoice_received_at: string | null
          commercial_invoice_ref: string | null
          commercial_paid_at: string | null
          commercial_share: number | null
          commission_actual: number | null
          commission_confirmed_at: string | null
          commission_expected: number | null
          commission_invoice_ref: string | null
          commission_invoiced_at: string | null
          commission_paid_at: string | null
          commission_status: Database["public"]["Enums"]["commission_status"]
          created_at: string
          created_by: string | null
          duration_months: number | null
          id: string
          lead_id: string
          notes: string | null
          reference: string | null
          signed_at: string
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"]
          supplier: string | null
          supplier_id: string | null
          updated_at: string
          withdrawal_deadline: string | null
        }
        Insert: {
          amount_annual_ht?: number | null
          commercial_invoice_received_at?: string | null
          commercial_invoice_ref?: string | null
          commercial_paid_at?: string | null
          commercial_share?: number | null
          commission_actual?: number | null
          commission_confirmed_at?: string | null
          commission_expected?: number | null
          commission_invoice_ref?: string | null
          commission_invoiced_at?: string | null
          commission_paid_at?: string | null
          commission_status?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          created_by?: string | null
          duration_months?: number | null
          id?: string
          lead_id: string
          notes?: string | null
          reference?: string | null
          signed_at: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          supplier?: string | null
          supplier_id?: string | null
          updated_at?: string
          withdrawal_deadline?: string | null
        }
        Update: {
          amount_annual_ht?: number | null
          commercial_invoice_received_at?: string | null
          commercial_invoice_ref?: string | null
          commercial_paid_at?: string | null
          commercial_share?: number | null
          commission_actual?: number | null
          commission_confirmed_at?: string | null
          commission_expected?: number | null
          commission_invoice_ref?: string | null
          commission_invoiced_at?: string | null
          commission_paid_at?: string | null
          commission_status?: Database["public"]["Enums"]["commission_status"]
          created_at?: string
          created_by?: string | null
          duration_months?: number | null
          id?: string
          lead_id?: string
          notes?: string | null
          reference?: string | null
          signed_at?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
          supplier?: string | null
          supplier_id?: string | null
          updated_at?: string
          withdrawal_deadline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "contracts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_attachments: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          id: string
          lead_id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          document_type?: string
          file_name: string
          id?: string
          lead_id: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          id?: string
          lead_id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "lead_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_events: {
        Row: {
          actor_id: string | null
          changes: Json | null
          created_at: string
          event_type: string
          from_status: Database["public"]["Enums"]["lead_status"] | null
          id: number
          lead_id: string
          to_status: Database["public"]["Enums"]["lead_status"] | null
        }
        Insert: {
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          event_type: string
          from_status?: Database["public"]["Enums"]["lead_status"] | null
          id?: number
          lead_id: string
          to_status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Update: {
          actor_id?: string | null
          changes?: Json | null
          created_at?: string
          event_type?: string
          from_status?: Database["public"]["Enums"]["lead_status"] | null
          id?: number
          lead_id?: string
          to_status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      leads: {
        Row: {
          amount_current: number | null
          assigned_supplier: string | null
          commercial_id: string
          company_name: string | null
          consent_at: string
          consent_given: boolean
          consent_version: string
          created_at: string
          details: Json
          duplicate_of: string | null
          id: string
          loss_comment: string | null
          loss_reason: Database["public"]["Enums"]["loss_reason"] | null
          mandate_comment: string | null
          mandate_sent_at: string | null
          mandate_signed_at: string | null
          mandate_status: Database["public"]["Enums"]["mandate_status"]
          notes: string | null
          phone_digits: string | null
          postal_code: string
          product_code: string
          prospect_email: string | null
          prospect_first_name: string
          prospect_last_name: string
          prospect_phone: string
          reference: string
          siren: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          amount_current?: number | null
          assigned_supplier?: string | null
          commercial_id: string
          company_name?: string | null
          consent_at?: string
          consent_given: boolean
          consent_version?: string
          created_at?: string
          details?: Json
          duplicate_of?: string | null
          id?: string
          loss_comment?: string | null
          loss_reason?: Database["public"]["Enums"]["loss_reason"] | null
          mandate_comment?: string | null
          mandate_sent_at?: string | null
          mandate_signed_at?: string | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"]
          notes?: string | null
          phone_digits?: string | null
          postal_code: string
          product_code: string
          prospect_email?: string | null
          prospect_first_name: string
          prospect_last_name: string
          prospect_phone: string
          reference?: string
          siren?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          amount_current?: number | null
          assigned_supplier?: string | null
          commercial_id?: string
          company_name?: string | null
          consent_at?: string
          consent_given?: boolean
          consent_version?: string
          created_at?: string
          details?: Json
          duplicate_of?: string | null
          id?: string
          loss_comment?: string | null
          loss_reason?: Database["public"]["Enums"]["loss_reason"] | null
          mandate_comment?: string | null
          mandate_sent_at?: string | null
          mandate_signed_at?: string | null
          mandate_status?: Database["public"]["Enums"]["mandate_status"]
          notes?: string | null
          phone_digits?: string | null
          postal_code?: string
          product_code?: string
          prospect_email?: string | null
          prospect_first_name?: string
          prospect_last_name?: string
          prospect_phone?: string
          reference?: string
          siren?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_commission_monthly"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_contracts_admin"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_finance_contracts"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_funnel"
            referencedColumns: ["product_code"]
          },
        ]
      }
      products: {
        Row: {
          code: string
          commercial_share_basis: string
          commercial_share_fixed: number | null
          commercial_share_rate: number | null
          commission_basis: string
          commission_fixed: number | null
          commission_rate: number | null
          created_at: string
          icon: string | null
          is_active: boolean
          label: string
          redirect_url: string | null
          requires_mandate: boolean
          sort_order: number
          tunnel: Database["public"]["Enums"]["tunnel_type"]
          vertical: string
        }
        Insert: {
          code: string
          commercial_share_basis?: string
          commercial_share_fixed?: number | null
          commercial_share_rate?: number | null
          commission_basis?: string
          commission_fixed?: number | null
          commission_rate?: number | null
          created_at?: string
          icon?: string | null
          is_active?: boolean
          label: string
          redirect_url?: string | null
          requires_mandate?: boolean
          sort_order?: number
          tunnel: Database["public"]["Enums"]["tunnel_type"]
          vertical: string
        }
        Update: {
          code?: string
          commercial_share_basis?: string
          commercial_share_fixed?: number | null
          commercial_share_rate?: number | null
          commission_basis?: string
          commission_fixed?: number | null
          commission_rate?: number | null
          created_at?: string
          icon?: string | null
          is_active?: boolean
          label?: string
          redirect_url?: string | null
          requires_mandate?: boolean
          sort_order?: number
          tunnel?: Database["public"]["Enums"]["tunnel_type"]
          vertical?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          manager_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          manager_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          manager_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_products: {
        Row: {
          product_code: string
          supplier_id: string
        }
        Insert: {
          product_code: string
          supplier_id: string
        }
        Update: {
          product_code?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "supplier_products_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_commission_monthly"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "supplier_products_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_contracts_admin"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "supplier_products_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_finance_contracts"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "supplier_products_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_funnel"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          account_reference: string | null
          billing_contact: string | null
          billing_email: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          payment_terms_days: number | null
          updated_at: string
        }
        Insert: {
          account_reference?: string | null
          billing_contact?: string | null
          billing_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          payment_terms_days?: number | null
          updated_at?: string
        }
        Update: {
          account_reference?: string | null
          billing_contact?: string | null
          billing_email?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          payment_terms_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_commission_monthly: {
        Row: {
          commercial_share_total: number | null
          commission_clawback: number | null
          commission_expected: number | null
          commission_paid: number | null
          commission_secured: number | null
          contracts_retracted: number | null
          contracts_signed: number | null
          month: string | null
          product_code: string | null
          product_label: string | null
          revenue_client_ht: number | null
        }
        Relationships: []
      }
      v_contracts_admin: {
        Row: {
          amount_annual_ht: number | null
          commercial_id: string | null
          commercial_name: string | null
          commercial_share: number | null
          commission_actual: number | null
          commission_expected: number | null
          commission_paid_at: string | null
          commission_status:
            | Database["public"]["Enums"]["commission_status"]
            | null
          company_name: string | null
          created_at: string | null
          duration_months: number | null
          id: string | null
          lead_id: string | null
          lead_reference: string | null
          notes: string | null
          product_code: string | null
          product_label: string | null
          prospect_first_name: string | null
          prospect_last_name: string | null
          reference: string | null
          retractable: boolean | null
          signed_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["contract_status"] | null
          supplier: string | null
          withdrawal_deadline: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "leads_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_finance_contracts: {
        Row: {
          billing_state: string | null
          commercial_id: string | null
          commercial_invoice_received_at: string | null
          commercial_invoice_ref: string | null
          commercial_is_active: boolean | null
          commercial_name: string | null
          commercial_paid_at: string | null
          commercial_share_ht: number | null
          commission_confirmed_at: string | null
          commission_ht: number | null
          commission_invoice_ref: string | null
          commission_invoiced_at: string | null
          commission_is_actual: boolean | null
          commission_paid_at: string | null
          commission_status:
            | Database["public"]["Enums"]["commission_status"]
            | null
          company_name: string | null
          contract_id: string | null
          contract_reference: string | null
          contract_status: Database["public"]["Enums"]["contract_status"] | null
          jours_depuis_facturation: number | null
          jours_encours: number | null
          lead_id: string | null
          lead_reference: string | null
          marge_ht: number | null
          payout_state: string | null
          product_code: string | null
          product_label: string | null
          prospect_display: string | null
          prospect_first_name: string | null
          prospect_last_name: string | null
          signed_at: string | null
          supplier_billing_email: string | null
          supplier_id: string | null
          supplier_name: string | null
          tunnel: Database["public"]["Enums"]["tunnel_type"] | null
          volume_client_ht: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_leads_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_mandates_pending"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["earlier_lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_potential_duplicates"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "v_withdrawal_pending"
            referencedColumns: ["lead_id"]
          },
          {
            foreignKeyName: "contracts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_funnel: {
        Row: {
          delai_qualif_heures: number | null
          nouveau: number | null
          product_code: string | null
          product_label: string | null
          proposition: number | null
          qualifie: number | null
          signe: number | null
          sortis: number | null
          total: number | null
          transmis: number | null
        }
        Relationships: []
      }
      v_leads_admin: {
        Row: {
          amount_current: number | null
          assigned_supplier: string | null
          commercial_name: string | null
          company_name: string | null
          contracts_count: number | null
          created_at: string | null
          details: Json | null
          id: string | null
          loss_reason: Database["public"]["Enums"]["loss_reason"] | null
          mandate_sent_at: string | null
          mandate_signed_at: string | null
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          postal_code: string | null
          product_label: string | null
          prospect_email: string | null
          prospect_first_name: string | null
          prospect_last_name: string | null
          prospect_phone: string | null
          reference: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          tunnel: Database["public"]["Enums"]["tunnel_type"] | null
          vertical: string | null
        }
        Relationships: []
      }
      v_mandates_pending: {
        Row: {
          commercial_name: string | null
          company_name: string | null
          created_at: string | null
          id: string | null
          jours_en_attente: number | null
          mandate_sent_at: string | null
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          prospect_first_name: string | null
          prospect_last_name: string | null
          prospect_phone: string | null
          reference: string | null
        }
        Relationships: []
      }
      v_potential_duplicates: {
        Row: {
          created_at: string | null
          earlier_created_at: string | null
          earlier_lead_id: string | null
          earlier_lead_reference: string | null
          lead_id: string | null
          lead_reference: string | null
          phone_digits: string | null
          product_code: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_commission_monthly"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_contracts_admin"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_finance_contracts"
            referencedColumns: ["product_code"]
          },
          {
            foreignKeyName: "leads_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "v_funnel"
            referencedColumns: ["product_code"]
          },
        ]
      }
      v_withdrawal_pending: {
        Row: {
          amount_annual_ht: number | null
          commercial_id: string | null
          commercial_name: string | null
          commercial_share: number | null
          commission_expected: number | null
          company_name: string | null
          id: string | null
          jours_restants: number | null
          lead_id: string | null
          lead_reference: string | null
          product_label: string | null
          prospect_first_name: string | null
          prospect_last_name: string | null
          reference: string | null
          signed_at: string | null
          supplier: string | null
          withdrawal_deadline: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      jsonb_num: { Args: { p_data: Json; p_key: string }; Returns: number }
      purge_stale_leads: { Args: { p_years?: number }; Returns: number }
      storage_lead_id: { Args: { p_name: string }; Returns: string }
      suggest_commission: {
        Args: { p_amount_annual_ht: number; p_product_code: string }
        Returns: {
          commercial_share: number
          commission: number
        }[]
      }
    }
    Enums: {
      commission_status: "estimee" | "confirmee" | "payee" | "annulee"
      contract_status:
        | "en_attente"
        | "actif"
        | "retracte"
        | "resilie"
        | "annule"
      lead_status:
        | "nouveau"
        | "qualifie"
        | "transmis_fournisseur"
        | "proposition_envoyee"
        | "signe"
        | "perdu"
        | "doublon"
        | "sans_suite"
      loss_reason:
        | "prix_non_competitif"
        | "client_injoignable"
        | "deja_engage_ailleurs"
        | "hors_cible"
        | "dossier_incomplet"
        | "client_a_renonce"
        | "refus_fournisseur"
        | "non_eligible"
        | "autre"
      mandate_status: "non_requis" | "a_envoyer" | "envoye" | "signe" | "refuse"
      tunnel_type: "particuliers" | "professionnels"
      user_role: "admin" | "manager" | "commercial"
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
      commission_status: ["estimee", "confirmee", "payee", "annulee"],
      contract_status: ["en_attente", "actif", "retracte", "resilie", "annule"],
      lead_status: [
        "nouveau",
        "qualifie",
        "transmis_fournisseur",
        "proposition_envoyee",
        "signe",
        "perdu",
        "doublon",
        "sans_suite",
      ],
      loss_reason: [
        "prix_non_competitif",
        "client_injoignable",
        "deja_engage_ailleurs",
        "hors_cible",
        "dossier_incomplet",
        "client_a_renonce",
        "refus_fournisseur",
        "non_eligible",
        "autre",
      ],
      mandate_status: ["non_requis", "a_envoyer", "envoye", "signe", "refuse"],
      tunnel_type: ["particuliers", "professionnels"],
      user_role: ["admin", "manager", "commercial"],
    },
  },
} as const
