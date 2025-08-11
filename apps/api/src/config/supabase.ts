import { createClient } from '@supabase/supabase-js';

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
  PAYMENTS: 'payments'
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

// Supabase service class
export class SupabaseService {
  
  // Flight operations
  async searchFlights(params: {
    from?: string;
    to?: string;
    departureDate?: string;
    limit?: number;
  }) {
    let query = supabase
      .from(TABLES.FLIGHTS)
      .select('*')
      .eq('status', 'scheduled');

    if (params.from) {
      query = query.ilike('departure_city', `%${params.from}%`);
    }

    if (params.to) {
      query = query.ilike('arrival_city', `%${params.to}%`);
    }

    if (params.departureDate) {
      query = query.eq('departure_date', params.departureDate);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query.order('departure_time', { ascending: true });

    if (error) {
      throw new Error(`Error searching flights: ${error.message}`);
    }

    return data as Flight[];
  }

  async getFlightById(flightId: string) {
    const { data, error } = await supabase
      .from(TABLES.FLIGHTS)
      .select('*')
      .eq('id', flightId)
      .single();

    if (error) {
      throw new Error(`Error getting flight: ${error.message}`);
    }

    return data as Flight;
  }

  // Booking operations
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }

    return data as Booking;
  }

  async getBookingByNumber(bookingNumber: string) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .select(`
        *,
        flight:flights(*),
        passengers(*),
        payment:payments(*)
      `)
      .eq('booking_number', bookingNumber)
      .single();

    if (error) {
      throw new Error(`Error getting booking: ${error.message}`);
    }

    return data;
  }

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from(TABLES.BOOKINGS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating booking status: ${error.message}`);
    }

    return data as Booking;
  }

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
