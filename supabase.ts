import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  owner: {
    id: string;
    email: string;
    mobile: string;
    password_hash: string;
    created_at: string;
  };
  customers: {
    id: string;
    email: string | null;
    mobile: string | null;
    name: string | null;
    created_at: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    images: string[];
    created_at: string;
    updated_at: string;
  };
  orders: {
    id: string;
    customer_id: string | null;
    product_id: string | null;
    product_name: string;
    product_price: number;
    quantity: number;
    total_amount: number;
    customer_name: string;
    customer_email: string | null;
    customer_mobile: string | null;
    delivery_address: string;
    status: string;
    created_at: string;
  };
  shop_details: {
    id: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    updated_at: string;
  };
  about_us: {
    id: string;
    description: string | null;
    experience: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    contact_address: string | null;
    updated_at: string;
  };
  gallery_images: {
    id: string;
    image_url: string;
    category: 'shop' | 'work' | 'banner';
    created_at: string;
  };
  gallery_videos: {
    id: string;
    video_url: string;
    title: string | null;
    created_at: string;
  };
};
