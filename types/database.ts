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
      order_items: {
        Row: {
          id: string
          order_id: string
          product_variant_id: string
          design_url: string | null
          design_width: number | null
          design_height: number | null
          placement: Json | null
          quantity: number
          unit_price_mxn: number
        }
        Insert: {
          id?: string
          order_id: string
          product_variant_id: string
          design_url?: string | null
          design_width?: number | null
          design_height?: number | null
          placement?: Json | null
          quantity: number
          unit_price_mxn: number
        }
        Update: {
          id?: string
          order_id?: string
          product_variant_id?: string
          design_url?: string | null
          design_width?: number | null
          design_height?: number | null
          placement?: Json | null
          quantity?: number
          unit_price_mxn?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: Database['public']['Enums']['order_status']
          total_mxn: number
          shipping_mxn: number
          payment_id: string | null
          fulfillment_ref: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_street: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_zip: string | null
          shipping_country: string
          created_at: string
          production_stage: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: Database['public']['Enums']['order_status']
          total_mxn: number
          shipping_mxn: number
          payment_id?: string | null
          fulfillment_ref?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shipping_country: string
          created_at?: string
          production_stage?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: Database['public']['Enums']['order_status']
          total_mxn?: number
          shipping_mxn?: number
          payment_id?: string | null
          fulfillment_ref?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shipping_country?: string
          created_at?: string
          production_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          color_name: string
          color_hex: string
          size: string
          sku: string
          extra_price_mxn: number
          printful_variant_id: string | null
          active: boolean
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          color_hex: string
          size: string
          sku: string
          extra_price_mxn?: number
          printful_variant_id?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          product_id?: string
          color_name?: string
          color_hex?: string
          size?: string
          sku?: string
          extra_price_mxn?: number
          printful_variant_id?: string | null
          active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          base_price_mxn: number
          print_area: Json | null
          mockup_front_url: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          base_price_mxn: number
          print_area?: Json | null
          mockup_front_url?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          base_price_mxn?: number
          print_area?: Json | null
          mockup_front_url?: string | null
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: Database['public']['Enums']['user_role']
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      user_role: 'user' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
