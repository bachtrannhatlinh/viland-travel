import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database table names
export const TABLES = {
  FLIGHTS: 'flights',
  BOOKINGS: 'bookings',
  PASSENGERS: 'passengers',
  PAYMENTS: 'payments',
  TOURS: 'tours',
  TOUR_ITINERARY: 'tour_itinerary',
  TOUR_BOOKINGS: 'tour_bookings'
} as const;

// Flight interface
export interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  aircraft_type: string;
  departure_airport: string;
  arrival_airport: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  pricing: {
    economy: { price: number; available: number };
    business?: { price: number; available: number };
    first?: { price: number; available: number };
  };
  status: 'scheduled' | 'delayed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
}

// Booking interface
export interface Booking {
  id?: string;
  booking_number: string;
  flight_id: string;
  user_id?: string;
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
  selected_class: 'economy' | 'business' | 'first';
  total_amount: number;
  special_requests?: string;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
}

// Passenger interface
export interface Passenger {
  id?: string;
  booking_id: string;
  type: 'adult' | 'child' | 'infant';
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  passport_number?: string;
  passport_expiry?: string;
  created_at?: string;
}

// Payment interface
export interface Payment {
  id?: string;
  booking_id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  gateway: 'vnpay' | 'zalopay' | 'momo' | 'onepay';
  payment_url?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Tour interfaces
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  images: string[];
  duration_days: number;
  duration_nights: number;
  destinations: string[];
  start_location?: any;
  end_location?: any;
  price_adult: number;
  price_child: number;
  price_infant: number;
  currency: string;
  discount_adult?: number;
  discount_child?: number;
  discount_infant?: number;
  inclusions: string[];
  exclusions: string[];
  category: string;
  difficulty: string;
  max_group_size: number;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TourItinerary {
  id: string;
  tour_id: string;
  day_number: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

// Supabase service class
export class SupabaseService {
  // Lấy chi tiết chuyến bay theo id
  async getFlightById(flightId: string) {
    const { data, error } = await supabase
      .from(TABLES.FLIGHTS)
      .select('*')
      .eq('id', flightId)
      .single();
    if (error) throw new Error(`Error getting flight: ${error.message}`);
    return data;
  }

  // Tạo booking chuyến bay
  async createBooking(bookingData: any) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert([bookingData])
      .select()
      .single();
    if (error) throw new Error(`Error creating booking: ${error.message}`);
    return data;
  }

  // Cập nhật trạng thái booking
  async updateBookingStatus(bookingId: string, status: string) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();
    if (error) throw new Error(`Error updating booking status: ${error.message}`);
    return data;
  }
  
  // ...existing code...

  // ...existing code...

  // Passenger operations
  async createPassengers(passengers: Omit<Passenger, 'id' | 'created_at'>[]) {
    const { data, error } = await supabase
      .from(TABLES.PASSENGERS)
      .insert(passengers)
      .select();

    if (error) {
      throw new Error(`Error creating passengers: ${error.message}`);
    }

    return data as Passenger[];
  }

  // Payment operations
  async createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .insert(paymentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }

    return data as Payment;
  }

  async updatePaymentStatus(transactionId: string, status: Payment['status'], paidAt?: string) {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (paidAt) {
      updateData.paid_at = paidAt;
    }

    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .update(updateData)
      .eq('transaction_id', transactionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating payment status: ${error.message}`);
    }

    return data as Payment;
  }

  async getPaymentByTransactionId(transactionId: string) {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) {
      throw new Error(`Error getting payment: ${error.message}`);
    }

    return data as Payment;
  }

  // Tour operations
  async getTours(params: {
    category?: string;
    difficulty?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from(TABLES.TOURS)
      .select('*')
      .eq('is_active', true);

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.difficulty) {
      query = query.eq('difficulty', params.difficulty);
    }

    if (params.featured) {
      query = query.eq('is_featured', true);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error getting tours: ${error.message}`);
    }

    return data as Tour[];
  }

  async getTourById(tourId: string) {
    const { data, error } = await supabase
      .from(TABLES.TOURS)
      .select(`
        *,
        tour_itinerary (*)
      `)
      .eq('id', tourId)
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(`Error getting tour: ${error.message}`);
    }

    return data as Tour & { tour_itinerary: TourItinerary[] };
  }

  async searchTours(params: {
    destination?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    duration?: number;
    limit?: number;
  }) {
    let query = supabase
      .from(TABLES.TOURS)
      .select('*')
      .eq('is_active', true);

    if (params.destination) {
      query = query.contains('destinations', [params.destination]);
    }

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.minPrice) {
      query = query.gte('price_adult', params.minPrice);
    }

    if (params.maxPrice) {
      query = query.lte('price_adult', params.maxPrice);
    }

    if (params.duration) {
      query = query.eq('duration_days', params.duration);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      throw new Error(`Error searching tours: ${error.message}`);
    }

    return data as Tour[];
  }

  // Utility methods
  async initializeDatabase() {
    console.log('🔄 Initializing Supabase database...');
    
    try {
      // Test connection
      const { data, error } = await supabase.from(TABLES.FLIGHTS).select('count').limit(1);
      
      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        throw error;
      }
      
      console.log('✅ Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Supabase initialization failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
